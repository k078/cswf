import { Injectable } from '@nestjs/common';
import { IArtiest } from '@cswf/shared/api';
import { Logger } from '@nestjs/common';
import { Artiest, ArtiestDocument } from './artiest.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateArtiestDto, UpdateArtiestDto } from '@cswf/backend/dto';

@Injectable()
export class ArtiestService {
    private readonly logger = new Logger(ArtiestService.name);

    constructor(
        @InjectModel(Artiest.name) private readonly ArtiestModel: Model<ArtiestDocument>,
    ) {}

    private async getLowestId(): Promise<number> {
        this.logger.log('getLowestId called');
        const usedIds = (await this.ArtiestModel.distinct('id').exec()) as number[];
        let lowestId = 1;
        while(usedIds.includes(lowestId)) {
            lowestId++;
        }
        this.logger.log(`Found lowest available ID: ${lowestId}`);
        return lowestId;
    }

    async findAll(): Promise<IArtiest[]> {
        this.logger.log('findAll called');
        const artiesten = await this.ArtiestModel.find().lean().exec();
        this.logger.log(`Found ${artiesten.length} artiesten`);
        return artiesten as IArtiest[];
    }

    async findOne(id: number): Promise<IArtiest | null> {
        this.logger.log(`findOne called with id ${id}`);
        const item = await this.ArtiestModel.findOne({id}).lean().exec();
        if (!item) {
            this.logger.warn(`Artiest with id ${id} not found`);
            return null;
        }
        this.logger.log(`Found artiest with id ${id}`);
        return item as IArtiest;
    }

    async create(artiest: CreateArtiestDto): Promise<IArtiest> {
        this.logger.log('create called');
        const id = await this.getLowestId();
        const artiestData = {
            ...artiest,
            id,
        };
        this.logger.debug(`Creating artiest with data: ${JSON.stringify(artiestData)}`);

        const createdArtiest = await this.ArtiestModel.create(artiestData);
        const plainObject = createdArtiest.toObject();
        this.logger.log(`Created artiest with id ${plainObject.id}`);
        return plainObject as IArtiest;
    }

    async delete(id: number): Promise<IArtiest | null> {
        this.logger.log(`delete called with id ${id}`);
        const deletedArtiest = await this.ArtiestModel.findOneAndDelete({id}).lean().exec();
        if (!deletedArtiest) {
            this.logger.warn(`Artiest with id ${id} not found for deletion`);
            return null;
        }
        this.logger.log(`Deleted artiest with id ${id}`);
        return deletedArtiest as IArtiest;
    }

    async update(id: number, artiest: UpdateArtiestDto): Promise<IArtiest | null> {
        this.logger.log(`update called with id ${id}`);
        const updatedArtiest = await this.ArtiestModel.findOneAndUpdate(
            {id},
            artiest,
            { new: true, lean: true }
        ).exec();

        if (!updatedArtiest) {
            this.logger.warn(`Artiest with id ${id} not found for update`);
            return null;
        }

        this.logger.log(`Updated artiest with id ${id}`);
        return updatedArtiest as IArtiest;
    }
}
