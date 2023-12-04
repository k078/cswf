import { Types } from 'mongoose';
import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { IVerzameling } from '@cswf/shared/api';
import { BehaviorSubject, race } from 'rxjs';
import { Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { ValidationError } from 'class-validator';
import { VerzamelingDocument } from './verzameling.schema';
import { Model, Schema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateVerzamelingDto, UpdateVerzamelingDto } from '@cswf/backend/dto';
import { LpModule } from '../lp.module'; // Importeer LpModule
import { Lp } from '../lp/lp.schema'; // Importeer Lp

@Injectable()
export class VerzamelingService {
  // ...

  constructor(
    @InjectModel('Verzameling') private readonly verzamelingModel: Model<VerzamelingDocument>,
    @InjectModel(Lp.name) private readonly lpModel: Model<Lp>, // Gebruik Lp hier
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



  async addToVerzameling(lpId: number, verzamelingId: number): Promise<string> {
    // Controleer of de lp en verzameling bestaan
    const lp = await this.lpModel.findOne({ id: lpId }).exec();
    const verzameling = await this.verzamelingModel.findOne({ id: verzamelingId }).exec();

    if (!lp || !verzameling) {
      throw new NotFoundException('LP of verzameling niet gevonden');
    }

    // Controleer of het veld lps in verzameling aanwezig is en een array is
    if (!verzameling.lps || !Array.isArray(verzameling.lps)) {
      throw new BadRequestException('Verzameling bevat geen lps-veld of het is geen array');
    }

    // Controleer of de lp al in de verzameling zit
    const lpExistsInVerzameling = verzameling.lps.includes(lpId);
    if (lpExistsInVerzameling) {
      throw new ConflictException('LP zit al in de verzameling');
    }

    // Voeg de lp toe aan de verzameling
    verzameling.lps.push(lpId);

    // Sla de wijzigingen op
    await verzameling.save();
    return 'LP toegevoegd aan verzameling';
  }


  async update(id: number, verzameling: UpdateVerzamelingDto): Promise<IVerzameling | null> {
    return this.verzamelingModel.findOneAndUpdate({id}, verzameling, { new: true }).exec();
  }


}
