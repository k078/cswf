import { Injectable, Logger } from '@nestjs/common';
import { IVerzameling } from '@cswf/shared/api';
import { InjectModel } from '@nestjs/mongoose';
import { Verzameling, VerzamelingDocument } from './verzameling.schema';
import { Model } from 'mongoose';
import { CreateVerzamelingDto, UpdateVerzamelingDto } from '@cswf/backend/dto';
import { Lp } from '../lp/lp.schema';

@Injectable()
export class VerzamelingService {
    private readonly logger = new Logger(VerzamelingService.name);

    constructor(
        @InjectModel(Verzameling.name) private readonly verzamelingModel: Model<VerzamelingDocument>,
        @InjectModel(Lp.name) private readonly lpModel: Model<Lp>,
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

    async create(verzamelingDto: CreateVerzamelingDto): Promise<IVerzameling> {
        this.logger.log('create called');
        const id = await this.getLowestId();
        const verzamelingData = {
            ...verzamelingDto,
            id,
            oprichting: new Date()
        };
        this.logger.debug(`Creating verzameling with data: ${JSON.stringify(verzamelingData)}`);

        const createdVerzameling = await this.verzamelingModel.create(verzamelingData);
        const plainObject = createdVerzameling.toObject();
        this.logger.log(`Created verzameling with id ${plainObject.id}`);
        return plainObject as IVerzameling;
    }

    async delete(id: number): Promise<IVerzameling | null> {
        this.logger.log(`delete called with id ${id}`);
        const deletedVerzameling = await this.verzamelingModel.findOneAndDelete({id}).lean().exec();
        if (!deletedVerzameling) {
            this.logger.warn(`Verzameling with id ${id} not found for deletion`);
            return null;
        }
        this.logger.log(`Deleted verzameling with id ${id}`);
        return deletedVerzameling as IVerzameling;
    }

    async addToVerzameling(lpId: number, verzamelingId: number): Promise<string> {
        this.logger.log(`addToVerzameling called with lpId ${lpId} and verzamelingId ${verzamelingId}`);

        const lp = await this.lpModel.findOne({ id: lpId }).lean().exec();
        const verzameling = await this.verzamelingModel.findOne({ id: verzamelingId }).exec();

        if (!lp || !verzameling) {
            this.logger.warn(`LP or verzameling not found (lpId: ${lpId}, verzamelingId: ${verzamelingId})`);
            return 'LP of verzameling niet gevonden';
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

    async update(id: number, verzamelingDto: UpdateVerzamelingDto): Promise<IVerzameling | null> {
        this.logger.log(`update called with id ${id}`);
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
