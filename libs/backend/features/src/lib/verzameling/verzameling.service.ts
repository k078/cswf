import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IVerzameling } from '@cswf/shared/api';
import { BehaviorSubject, race } from 'rxjs';
import { Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { ValidationError } from 'class-validator';
import { VerzamelingDocument } from './verzameling.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateVerzamelingDto, UpdateVerzamelingDto } from '@cswf/backend/dto';


@Injectable()
export class VerzamelingService {
  private readonly logger = new Logger(VerzamelingService.name);

  constructor(
    @InjectModel('Verzameling') private readonly verzamelingModel: Model<VerzamelingDocument>,
  ) {}

  private async getLowestId(): Promise<number> {
    const usedIds = (await this.verzamelingModel.distinct('id').exec()) as number[];
    let lowestId = 1;
    while(usedIds.includes(lowestId)) {
      lowestId++;
    }
    return lowestId;
  }

  async findAll(): Promise<IVerzameling[]> {
    const verzamelingen = await this.verzamelingModel.find().exec();
    return verzamelingen;
  }

  async findOne(id: number): Promise<IVerzameling | null> {
      const item = await this.verzamelingModel.findOne({id}).exec();
      return item;
  }

  async create(verzameling: CreateVerzamelingDto): Promise<IVerzameling> {
    const date = new Date(Date.now());
    const id = await this.getLowestId();
    const verzamelingMetDatum = {
      ...verzameling,
      id,
      oprichting: date
    }

    const createdVerzameling = await this.verzamelingModel.create(verzamelingMetDatum);
    return createdVerzameling.toObject(); // Convert to plain object to avoid potential issues with Mongoose documents
  }

  async delete(id: number): Promise<IVerzameling | null> {
    const deletedVerzameling = await this.verzamelingModel.findOneAndDelete({id}, {}).exec();
    return deletedVerzameling as IVerzameling;
  }



  async update(id: number, verzameling: UpdateVerzamelingDto): Promise<IVerzameling | null> {
    return this.verzamelingModel.findOneAndUpdate({id}, verzameling, { new: true }).exec();
  }


}
