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
    const usedIds = (await this.ArtiestModel.distinct('id').exec()) as number[];
    let lowestId = 1;
    while(usedIds.includes(lowestId)) {
      lowestId++;
    }
    return lowestId;
  }

  async findAll(): Promise<IArtiest[]> {
    const Artiesten = await this.ArtiestModel.find().exec();
    return Artiesten;
  }

  async findOne(id: number): Promise<IArtiest | null> {
      const item = await this.ArtiestModel.findOne({id}).exec();
      return item;
  }

  async create(Artiest: CreateArtiestDto): Promise<IArtiest> {
    console.log('ArtiestCreate aangeroepen in backend');
    const id = await this.getLowestId();
    const ArtiestMetDatum = {
      ...Artiest,
      id,
    }
    console.log('ArtiestMetDatum:', ArtiestMetDatum);
    const createdArtiest = await this.ArtiestModel.create(ArtiestMetDatum);
    return createdArtiest.toObject();
  }

  async delete(id: number): Promise<IArtiest | null> {
    const deletedArtiest = await this.ArtiestModel.findOneAndDelete({id}, {}).exec();
    return deletedArtiest as IArtiest;
  }



  async update(id: number, Artiest: UpdateArtiestDto): Promise<IArtiest | null> {
    return this.ArtiestModel.findOneAndUpdate({id}, Artiest, { new: true }).exec();
  }


}
