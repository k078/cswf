import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { IArtiest } from '@cswf/shared/api';
import { Artiest, ArtiestDocument } from './artiest.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateArtiestDto, UpdateArtiestDto } from '@cswf/backend/dto';
import { Gebruiker } from '../gebruiker/gebruiker.schema';
import { TokenBlacklistService } from '../gebruiker/blacklist.service';
import { Neo4jService } from '@cswf/shared/api';

@Injectable()
export class ArtiestService {
  private readonly logger = new Logger(ArtiestService.name);

  constructor(
    @InjectModel(Artiest.name)
    private readonly artiestModel: Model<ArtiestDocument>,
    @InjectModel(Gebruiker.name)
    private readonly gebruikerModel: Model<Gebruiker>,
    private readonly tokenBlacklistService: TokenBlacklistService,
    private readonly neo4jService: Neo4jService
  ) {}

  private async getLowestId(): Promise<number> {
    this.logger.log('getLowestId called');
    const usedIds = (await this.artiestModel.distinct('id').exec()) as number[];
    let lowestId = 1;
    while (usedIds.includes(lowestId)) {
      lowestId++;
    }
    this.logger.log(`Found lowest available ID: ${lowestId}`);
    return lowestId;
  }

  async findAll(): Promise<IArtiest[]> {
    this.logger.log('findAll called');
    const artiesten = await this.artiestModel.find().lean().exec();
    this.logger.log(`Found ${artiesten.length} artiesten`);
    return artiesten as IArtiest[];
  }

  async findOne(id: number): Promise<IArtiest | null> {
    this.logger.log(`findOne called with id ${id}`);
    const artiest = await this.artiestModel.findOne({ id }).lean().exec();
    if (!artiest) {
      this.logger.warn(`Artiest with id ${id} not found`);
      return null;
    }
    this.logger.log(`Found artiest with id ${id}`);
    return artiest as IArtiest;
  }

  async create(
    artiestDto: CreateArtiestDto,
    gebruikerId: string
  ): Promise<IArtiest> {
    this.logger.log('create called');

    const gebruiker = await this.gebruikerModel
      .findOne({ id: gebruikerId })
      .lean()
      .exec();
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
    const artiestData = {
      ...artiestDto,
      id,
      gebruikerId: gebruiker.id,
    };

    const createdArtiest = await this.artiestModel.create(artiestData);

    await this.neo4jService.runQuery(
      `
          MERGE (a:Artist {id: $id, name: $naam})
          SET a.beschrijving = $beschrijving
      `,
      {
        id: id.toString(),
        naam: artiestDto.naam,
        beschrijving: artiestDto.bio || '',
      }
    );

    return createdArtiest.toObject() as IArtiest;
  }

  async delete(id: number, gebruikerId: string): Promise<IArtiest | null> {
    this.logger.log(`delete called with id ${id}`);

    const artiest = await this.artiestModel.findOne({ id }).lean().exec();
    const gebruiker = await this.gebruikerModel
      .findOne({ id: gebruikerId })
      .lean()
      .exec();

    if (!artiest || !gebruiker) {
      this.logger.warn(`Artiest or user not found`);
      return null;
    }

    if (gebruiker.rol !== 'ADMIN' && gebruiker.id !== artiest.gebruikerId) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized',
          message: 'You do not have permission to delete this artiest',
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    const deletedArtiest = await this.artiestModel
      .findOneAndDelete({ id })
      .lean()
      .exec();
    if (!deletedArtiest) {
      this.logger.warn(`Artiest with id ${id} not found for deletion`);
      return null;
    }

    await this.neo4jService.runQuery(
      `
        MATCH (a:Artist {id: $id})
        DETACH DELETE a
    `,
      { id: id.toString() }
    );

    return deletedArtiest as IArtiest;
  }

  async update(
    id: number,
    artiestDto: UpdateArtiestDto,
    gebruikerId: string
  ): Promise<IArtiest | null> {
    this.logger.log(`update called with id ${id}`);

    const artiest = await this.artiestModel.findOne({ id }).lean().exec();
    const gebruiker = await this.gebruikerModel
      .findOne({ id: gebruikerId })
      .lean()
      .exec();

    if (!artiest || !gebruiker) {
      this.logger.warn(`Artiest or user not found`);
      return null;
    }

    if (gebruiker.rol !== 'ADMIN' && gebruiker.id !== artiest.gebruikerId) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized',
          message: 'You do not have permission to update this artiest',
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    const updatedArtiest = await this.artiestModel
      .findOneAndUpdate({ id }, artiestDto, { new: true, lean: true })
      .exec();

    if (!updatedArtiest) {
      this.logger.warn(`Artiest with id ${id} not found for update`);
      return null;
    }

    // Sync naar Neo4j
    await this.neo4jService.runQuery(
      `
          MERGE (a:Artist {id: $id})
          SET a.name = $naam,
              a.beschrijving = $beschrijving
      `,
      {
        id: id.toString(),
        naam: artiestDto.naam,
        beschrijving: artiestDto.bio || '',
      }
    );

    return updatedArtiest as IArtiest;
  }
}
