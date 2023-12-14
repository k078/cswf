import { Injectable } from '@nestjs/common';
import { ILp } from '@cswf/shared/api';
import { Logger } from '@nestjs/common';
import { Lp, LpDocument } from './lp.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateLpDto, UpdateLpDto } from '@cswf/backend/dto';


@Injectable()
export class LpService {
  private readonly logger = new Logger(LpService.name);

  constructor(
    @InjectModel(Lp.name) private readonly LpModel: Model<LpDocument>,
  ) {}


  private async getLowestId(): Promise<number> {
    const usedIds = (await this.LpModel.distinct('id').exec()) as number[];
    let lowestId = 1;
    while(usedIds.includes(lowestId)) {
      lowestId++;
    }
    return lowestId;
  }

  async findAll(): Promise<ILp[]> {
    const Lpen = await this.LpModel.find().exec();
    return Lpen;
  }

  async findOne(id: number): Promise<ILp | null> {
      const item = await this.LpModel.findOne({id}).exec();
      return item;
  }

  async create(Lp: CreateLpDto): Promise<ILp> {
    console.log('LpCreate aangeroepen in backend');
    const id = await this.getLowestId();
    const LpMetDatum = {
      ...Lp,
      id,
      release: new Date(Lp.release)
    }
    console.log('LpMetDatum:', LpMetDatum);
    const createdLp = await this.LpModel.create(LpMetDatum);
    return createdLp.toObject(); // Convert to plain object to avoid potential issues with Mongoose documents
  }

  async delete(id: number): Promise<ILp | null> {
    const deletedLp = await this.LpModel.findOneAndDelete({id}, {}).exec();
    return deletedLp as ILp;
  }



  async update(id: number, Lp: UpdateLpDto): Promise<ILp | null> {
    return this.LpModel.findOneAndUpdate({id}, Lp, { new: true }).exec();
  }


}
