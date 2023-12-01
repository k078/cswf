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

  async findAll(): Promise<IVerzameling[]> {
    const verzamelingen = await this.verzamelingModel.find().exec();
    return verzamelingen;
  }

  async findOne(id: string): Promise<IVerzameling | null> {
    const verzameling = await this.verzamelingModel.findById(id).exec();
    return verzameling;
  }

  async create(verzameling: CreateVerzamelingDto): Promise<IVerzameling> {

    const toCreateVerzameling : CreateVerzamelingDto ={
      naam: verzameling.naam,
      eigenaar: verzameling.eigenaar,
      oprichting: new Date(Date.now()),
      info: verzameling.info,
      lps: new Array<number>()
    }
    const createdVerzameling = this.verzamelingModel.create(toCreateVerzameling);
    return createdVerzameling;
  }

  async update(id: string, verzameling: UpdateVerzamelingDto): Promise<IVerzameling | null> {
    return this.verzamelingModel.findByIdAndUpdate(id, verzameling, { new: true }).exec();
  }


}
