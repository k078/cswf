import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IGebruiker, Rol } from '@cswf/shared/api';
import { BehaviorSubject} from 'rxjs';
import { Logger } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { InjectModel } from '@nestjs/mongoose';
import { Gebruiker, GebruikerDocument } from './gebruiker.schema';
import { Model } from 'mongoose';
import { CreateGebruikerDto, UpdateGebruikerDto } from '@cswf/backend/dto';
import { randomBytes } from 'crypto';
import { sign } from 'jsonwebtoken';



@Injectable()
export class GebruikerService {
  private readonly logger = new Logger(GebruikerService.name);

  constructor(
    @InjectModel(Gebruiker.name) private readonly GebruikerModel: Model<GebruikerDocument>,
  ) {}


  private async getLowestId(): Promise<number> {
    const usedIds = (await this.GebruikerModel.distinct('id').exec()) as number[];
    let lowestId = 1;
    while(usedIds.includes(lowestId)) {
      lowestId++;
    }
    return lowestId;
  }

  async findAll(): Promise<IGebruiker[]> {
    const Gebruikeren = await this.GebruikerModel.find().exec();
    return Gebruikeren;
  }

  async findOne(id: number): Promise<IGebruiker | null> {
      const item = await this.GebruikerModel.findOne({id}).exec();
      return item;
  }

  async create(Gebruiker: CreateGebruikerDto): Promise<IGebruiker> {
    const id = await this.getLowestId();
    const GebruikerMetDatum = {
      ...Gebruiker,
      id,
    }
    console.log('GebruikerMetDatum:', GebruikerMetDatum);
    const createdGebruiker = await this.GebruikerModel.create(GebruikerMetDatum);
    return createdGebruiker.toObject(); // Convert to plain object to avoid potential issues with Mongoose documents
  }

  async delete(id: number): Promise<IGebruiker | null> {
    const deletedGebruiker = await this.GebruikerModel.findOneAndDelete({id}, {}).exec();
    return deletedGebruiker as IGebruiker;
  }

  async login(gebruikersnaam: string, wachtwoord: string): Promise<IGebruiker> {
    console.log('login called');
    const gebruiker = await this.GebruikerModel
        .findOne({ gebruikersnaam, wachtwoord })
        .lean()
        .exec();

    if (!gebruiker) {
        throw new Error(`gebruiker with email ${gebruikersnaam} not found`);
    }

    const secretKey = randomBytes(32).toString('hex');
    const gebruikerId = gebruiker.id.toString();
    const token = sign({ gebruikerId }, secretKey, {
        expiresIn: '1h',
    }) as string;

    const response = { ...gebruiker, token };
    console.log('First Backend Response:', response);
    return response as IGebruiker;
}

async logout(gebruikerId: number): Promise<void> {
    console.log('logout called');

    const gebruiker = await this.GebruikerModel
        .findOne({ gebruikerId })
        .lean()
        .exec();

    if (!gebruiker) {
        throw new Error(`gebruiker with id ${gebruikerId} not found`);
    }

    localStorage.removeItem('auth_token');
    localStorage.removeItem('currentgebruiker');

    console.log('Logout successful');
}
  async update(id: number, Gebruiker: UpdateGebruikerDto): Promise<IGebruiker | null> {
    return this.GebruikerModel.findOneAndUpdate({id}, Gebruiker, { new: true }).exec();
  }

}
