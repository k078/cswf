import { Injectable, Logger } from '@nestjs/common';
import { ILp } from '@cswf/shared/api';
import { InjectModel } from '@nestjs/mongoose';
import { Lp, LpDocument } from './lp.schema';
import { Model } from 'mongoose';
import { CreateLpDto, UpdateLpDto } from '@cswf/backend/dto';

@Injectable()
export class LpService {
    private readonly logger = new Logger(LpService.name);

    constructor(
        @InjectModel(Lp.name) private readonly lpModel: Model<LpDocument>,
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

    async create(lpDto: CreateLpDto): Promise<ILp> {
        this.logger.log('create called');
        const id = await this.getLowestId();
        const lpData = {
            ...lpDto,
            id,
            release: new Date(lpDto.release)
        };
        this.logger.debug(`Creating LP with data: ${JSON.stringify(lpData)}`);

        const createdLp = await this.lpModel.create(lpData);
        const plainObject = createdLp.toObject();
        this.logger.log(`Created LP with id ${plainObject.id}`);
        return plainObject as ILp;
    }

    async delete(id: number): Promise<ILp | null> {
        this.logger.log(`delete called with id ${id}`);
        const deletedLp = await this.lpModel.findOneAndDelete({id}).lean().exec();
        if (!deletedLp) {
            this.logger.warn(`LP with id ${id} not found for deletion`);
            return null;
        }
        this.logger.log(`Deleted LP with id ${id}`);
        return deletedLp as ILp;
    }

    async update(id: number, lpDto: UpdateLpDto): Promise<ILp | null> {
        this.logger.log(`update called with id ${id}`);
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
