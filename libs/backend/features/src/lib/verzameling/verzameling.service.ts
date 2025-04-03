import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { IVerzameling } from '@cswf/shared/api';
import { InjectModel } from '@nestjs/mongoose';
import { Verzameling, VerzamelingDocument } from './verzameling.schema';
import { Model } from 'mongoose';
import { CreateVerzamelingDto, UpdateVerzamelingDto } from '@cswf/backend/dto';
import { Lp } from '../lp/lp.schema';
import { Gebruiker } from '../gebruiker/gebruiker.schema';
import { TokenBlacklistService } from '../gebruiker/blacklist.service';

@Injectable()
export class VerzamelingService {
    private readonly logger = new Logger(VerzamelingService.name);

    constructor(
        @InjectModel(Verzameling.name) private readonly verzamelingModel: Model<VerzamelingDocument>,
        @InjectModel(Lp.name) private readonly lpModel: Model<Lp>,
        @InjectModel(Gebruiker.name) private readonly gebruikerModel: Model<Gebruiker>,
        private readonly tokenBlacklistService: TokenBlacklistService,
    ) {}

    private async getLowestId(): Promise<number> {
        this.logger.log('getLowestId called');
        const usedIds = (await this.verzamelingModel.distinct('id').exec()) as number[];
        let lowestId = 1;
        while(usedIds.includes(lowestId)) {
            lowestId++;
        }
        this.logger.log(`Found lowest available ID: ${lowestId}`);
        return lowestId;
    }

    async findAll(): Promise<IVerzameling[]> {
        this.logger.log('findAll called');
        const verzamelingen = await this.verzamelingModel.find().lean().exec();
        this.logger.log(`Found ${verzamelingen.length} verzamelingen`);
        return verzamelingen as IVerzameling[];
    }

    async findOne(id: number): Promise<IVerzameling | null> {
        this.logger.log(`findOne called with id ${id}`);
        const verzameling = await this.verzamelingModel.findOne({id}).lean().exec();
        if (!verzameling) {
            this.logger.warn(`Verzameling with id ${id} not found`);
            return null;
        }
        this.logger.log(`Found verzameling with id ${id}`);
        return verzameling as IVerzameling;
    }

    async create(verzamelingDto: CreateVerzamelingDto, gebruikerId: string): Promise<IVerzameling> {
        this.logger.log('create called');

        const gebruiker = await this.gebruikerModel.findOne({ id: gebruikerId }).lean().exec();
        if (!gebruiker) {
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized',
                    message: 'User not found',
                },
                HttpStatus.UNAUTHORIZED
            );
        }

        const id = await this.getLowestId();
        const verzamelingData = {
            ...verzamelingDto,
            id,
            oprichting: new Date(),
            gebruikerId: gebruiker.id,
        };
        this.logger.debug(`Creating verzameling with data: ${JSON.stringify(verzamelingData)}`);
        verzamelingData.gebruikerId = gebruiker.id;
        const createdVerzameling = await this.verzamelingModel.create(verzamelingData);
        const plainObject = createdVerzameling.toObject();
        this.logger.log(`Created verzameling with id ${plainObject.id}`);
        return plainObject as IVerzameling;
    }

    async delete(id: number, gebruikerId: string): Promise<IVerzameling | null> {
        this.logger.log(`delete called with id ${id}`);

        const verzameling = await this.verzamelingModel.findOne({id}).lean().exec();
        const gebruiker = await this.gebruikerModel.findOne({ id: gebruikerId }).lean().exec();

        if (!verzameling || !gebruiker) {
            this.logger.warn(`Verzameling or user not found`);
            return null;
        }

        if (gebruiker.rol !== 'ADMIN' && gebruiker.id !== verzameling.gebruikerId) {
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized',
                    message: 'You do not have permission to delete this verzameling',
                },
                HttpStatus.UNAUTHORIZED
            );
        }

        const deletedVerzameling = await this.verzamelingModel.findOneAndDelete({id}).lean().exec();
        if (!deletedVerzameling) {
            this.logger.warn(`Verzameling with id ${id} not found for deletion`);
            return null;
        }
        this.logger.log(`Deleted verzameling with id ${id}`);
        return deletedVerzameling as IVerzameling;
    }

    async addToVerzameling(lpId: number, verzamelingId: number, gebruikerId: string): Promise<string> {
        this.logger.log(`addToVerzameling called with lpId ${lpId} and verzamelingId ${verzamelingId}`);

        // Haal de verzameling en gebruiker op
        const verzameling = await this.verzamelingModel.findOne({ id: verzamelingId }).exec();
        const gebruiker = await this.gebruikerModel.findOne({ id: gebruikerId }).lean().exec();

        if (!verzameling || !gebruiker) {
            this.logger.warn(`Verzameling or user not found`);
            return 'Verzameling of gebruiker niet gevonden';
        }

        // Controleer of gebruiker admin is of eigenaar van de verzameling
        if (gebruiker.rol !== 'ADMIN' && gebruiker.id !== verzameling.gebruikerId) {
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized',
                    message: 'You do not have permission to modify this verzameling',
                },
                HttpStatus.UNAUTHORIZED
            );
        }

        const lp = await this.lpModel.findOne({ id: lpId }).lean().exec();
        if (!lp) {
            this.logger.warn(`LP with id ${lpId} not found`);
            return 'LP niet gevonden';
        }

        if (!verzameling.lps || !Array.isArray(verzameling.lps)) {
            this.logger.warn('Verzameling bevat geen geldige lps array');
            return 'Verzameling bevat geen lps-veld of het is geen array';
        }

        if (verzameling.lps.includes(lpId)) {
            this.logger.warn(`LP ${lpId} already exists in verzameling ${verzamelingId}`);
            return 'LP zit al in de verzameling';
        }

        verzameling.lps.push(lpId);
        await verzameling.save();

        this.logger.log(`Successfully added LP ${lpId} to verzameling ${verzamelingId}`);
        return 'LP toegevoegd aan verzameling';
    }

    async removeFromVerzameling(lpId: number, verzamelingId: number, gebruikerId: string): Promise<string> {
        this.logger.log(`removeFromVerzameling called with lpId ${lpId} and verzamelingId ${verzamelingId}`);

        // Haal de verzameling en gebruiker op
        const verzameling = await this.verzamelingModel.findOne({ id: verzamelingId }).exec();
        const gebruiker = await this.gebruikerModel.findOne({ id: gebruikerId }).lean().exec();

        if (!verzameling || !gebruiker) {
            this.logger.warn(`Verzameling or user not found`);
            return 'Verzameling of gebruiker niet gevonden';
        }
        // Controleer of gebruiker admin is of eigenaar van de verzameling
        if (gebruiker.rol !== 'ADMIN' && gebruiker.id !== verzameling.gebruikerId) {
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized',
                    message: 'You do not have permission to modify this verzameling',
                },
                HttpStatus.UNAUTHORIZED
            );
        }
        if (!verzameling.lps || !Array.isArray(verzameling.lps)) {
            this.logger.warn('Verzameling bevat geen geldige lps array');
            return 'Verzameling bevat geen lps-veld of het is geen array';
        }
        if (!verzameling.lps.includes(lpId)) {
            this.logger.warn(`LP ${lpId} does not exist in verzameling ${verzamelingId}`);
            return 'LP zit niet in de verzameling';
        }
        verzameling.lps = verzameling.lps.filter((id) => id !== lpId);
        await verzameling.save();
        this.logger.log(`Successfully removed LP ${lpId} from verzameling ${verzamelingId}`);
        return 'LP verwijderd uit verzameling';
      }

    async update(id: number, verzamelingDto: UpdateVerzamelingDto, gebruikerId: string): Promise<IVerzameling | null> {
        this.logger.log(`update called with id ${id}`);

        // Haal de verzameling en gebruiker op
        const verzameling = await this.verzamelingModel.findOne({id}).lean().exec();
        const gebruiker = await this.gebruikerModel.findOne({ id: gebruikerId }).lean().exec();

        if (!verzameling || !gebruiker) {
            this.logger.warn(`Verzameling or user not found`);
            return null;
        }

        // Controleer of gebruiker admin is of eigenaar van de verzameling
        if (gebruiker.rol !== 'ADMIN' && gebruiker.id !== verzameling.gebruikerId) {
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized',
                    message: 'You do not have permission to update this verzameling',
                },
                HttpStatus.UNAUTHORIZED
            );
        }

        const updatedVerzameling = await this.verzamelingModel.findOneAndUpdate(
            {id},
            verzamelingDto,
            { new: true, lean: true }
        ).exec();

        if (!updatedVerzameling) {
            this.logger.warn(`Verzameling with id ${id} not found for update`);
            return null;
        }

        this.logger.log(`Updated verzameling with id ${id}`);
        return updatedVerzameling as IVerzameling;
    }
}
