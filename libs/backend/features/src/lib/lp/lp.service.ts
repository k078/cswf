import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ILp } from '@cswf/shared/api';
import { InjectModel } from '@nestjs/mongoose';
import { Lp, LpDocument } from './lp.schema';
import { Model } from 'mongoose';
import { CreateLpDto, UpdateLpDto } from '@cswf/backend/dto';
import { Gebruiker } from '../gebruiker/gebruiker.schema';
import { TokenBlacklistService } from '../gebruiker/blacklist.service';

@Injectable()
export class LpService {
    private readonly logger = new Logger(LpService.name);

    constructor(
        @InjectModel(Lp.name) private readonly lpModel: Model<LpDocument>,
        @InjectModel(Gebruiker.name) private readonly gebruikerModel: Model<Gebruiker>,
        private readonly tokenBlacklistService: TokenBlacklistService
    ) {}

    private async getLowestId(): Promise<number> {
        this.logger.log('getLowestId called');
        const usedIds = (await this.lpModel.distinct('id').exec()) as number[];
        let lowestId = 1;
        while(usedIds.includes(lowestId)) {
            lowestId++;
        }
        this.logger.log(`Found lowest available ID: ${lowestId}`);
        return lowestId;
    }

    async findAll(): Promise<ILp[]> {
        this.logger.log('findAll called');
        const lps = await this.lpModel.find().lean().exec();
        this.logger.log(`Found ${lps.length} LPs`);
        return lps as ILp[];
    }

    async findOne(id: number): Promise<ILp | null> {
        this.logger.log(`findOne called with id ${id}`);
        const lp = await this.lpModel.findOne({id}).lean().exec();
        if (!lp) {
            this.logger.warn(`LP with id ${id} not found`);
            return null;
        }
        this.logger.log(`Found LP with id ${id}`);
        return lp as ILp;
    }

    async create(lpDto: CreateLpDto, gebruikerId: string): Promise<ILp> {
        this.logger.log('create called');

        // Haal de ingelogde gebruiker op
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
        const lpData = {
            ...lpDto,
            id,
            release: new Date(lpDto.release),
            gebruikerId: gebruiker.id // Sla de gebruikerId op
        };
        this.logger.debug(`Creating LP with data: ${JSON.stringify(lpData)}`);

        const createdLp = await this.lpModel.create(lpData);
        const plainObject = createdLp.toObject();
        this.logger.log(`Created LP with id ${plainObject.id}`);
        return plainObject as ILp;
    }

    async delete(id: number, gebruikerId: string): Promise<ILp | null> {
        this.logger.log(`delete called with id ${id}`);

        // Haal de LP en gebruiker op
        const lp = await this.lpModel.findOne({id}).lean().exec();
        const gebruiker = await this.gebruikerModel.findOne({ id: gebruikerId }).lean().exec();

        if (!lp || !gebruiker) {
            this.logger.warn(`LP or user not found`);
            return null;
        }

        // Controleer of gebruiker admin is of eigenaar van de LP
        if (gebruiker.rol !== 'ADMIN' && gebruiker.id !== lp.gebruikerId) {
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized',
                    message: 'You do not have permission to delete this LP',
                },
                HttpStatus.UNAUTHORIZED
            );
        }

        const deletedLp = await this.lpModel.findOneAndDelete({id}).lean().exec();
        if (!deletedLp) {
            this.logger.warn(`LP with id ${id} not found for deletion`);
            return null;
        }
        this.logger.log(`Deleted LP with id ${id}`);
        return deletedLp as ILp;
    }

    async update(id: number, lpDto: UpdateLpDto, gebruikerId: string): Promise<ILp | null> {
        this.logger.log(`update called with id ${id}`);

        // Haal de LP en gebruiker op
        const lp = await this.lpModel.findOne({id}).lean().exec();
        const gebruiker = await this.gebruikerModel.findOne({ id: gebruikerId }).lean().exec();

        if (!lp || !gebruiker) {
            this.logger.warn(`LP or user not found`);
            return null;
        }

        // Controleer of gebruiker admin is of eigenaar van de LP
        if (gebruiker.rol !== 'ADMIN' && gebruiker.id !== lp.gebruikerId) {
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized',
                    message: 'You do not have permission to update this LP',
                },
                HttpStatus.UNAUTHORIZED
            );
        }
        lpDto.gebruikerId = gebruiker.id as number;
        const updatedLp = await this.lpModel.findOneAndUpdate(
            {id},
            lpDto,
            { new: true, lean: true }
        ).exec();

        if (!updatedLp) {
            this.logger.warn(`LP with id ${id} not found for update`);
            return null;
        }

        this.logger.log(`Updated LP with id ${id}`);
        return updatedLp as ILp;
    }
}
