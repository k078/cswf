import { Injectable, Logger } from '@nestjs/common';
import { IGebruiker } from '@cswf/shared/api';
import { InjectModel } from '@nestjs/mongoose';
import { Gebruiker, GebruikerDocument } from './gebruiker.schema';
import { Model } from 'mongoose';
import { CreateGebruikerDto, UpdateGebruikerDto } from '@cswf/backend/dto';
import { sign } from 'jsonwebtoken';
import { environment } from '@cswf/shared/util-env';
import { TokenBlacklistService } from './blacklist.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class GebruikerService {
  private readonly logger = new Logger(GebruikerService.name);

  constructor(
    @InjectModel(Gebruiker.name)
    private readonly gebruikerModel: Model<GebruikerDocument>,
    private readonly tokenBlacklistService: TokenBlacklistService
  ) {}

  private async getLowestId(): Promise<number> {
    this.logger.log('getLowestId called');
    const usedIds = (await this.gebruikerModel
      .distinct('id')
      .exec()) as number[];
    let lowestId = 1;
    while (usedIds.includes(lowestId)) {
      lowestId++;
    }
    this.logger.log(`Found lowest available ID: ${lowestId}`);
    return lowestId;
  }

  async findAll(id: string): Promise<IGebruiker[]> {
    this.logger.log('findAll called');
    const gebruikers = await this.gebruikerModel.find().lean().exec();
    this.logger.log(`Found ${gebruikers.length} gebruikers`);

    const gebruiker = await this.gebruikerModel.findOne({ id }).lean().exec();
    if (gebruiker?.rol !== 'ADMIN') {
      this.logger.warn(`Unauthorized access for gebruiker: ${id}`);
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized',
          message: 'You do not have permission to view all gebruikers',
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    return gebruikers as IGebruiker[];
  }

  async findOne(gebruikerId: string, id: string): Promise<IGebruiker | null> {
    this.logger.log(`findOne called with id ${id}`);
    const gebruikersIdNum = parseInt(gebruikerId, 10);
    const targetId = typeof id === 'string' ? parseInt(id, 10) : id;

    const LoggedInGebruiker = await this.gebruikerModel
        .findOne({ id: gebruikersIdNum })
        .lean()
        .exec();

    const isAdmin = LoggedInGebruiker?.rol === 'ADMIN';
    const isSameUser = gebruikersIdNum === targetId;
    const gebruikerToFind = await this.gebruikerModel.findOne({ id }).lean().exec();
    if (!isAdmin && !isSameUser) {
      this.logger.warn(`Unauthorized access for gebruiker: ${gebruikerId}`);
      throw new HttpException(
          {
              status: HttpStatus.UNAUTHORIZED,
              error: 'Unauthorized',
              message: 'You do not have permission to view a gebruiker other than yourself',
          },
          HttpStatus.UNAUTHORIZED
      );
  }
    if (!gebruikerToFind) {
      this.logger.warn(`Gebruiker with id ${id} not found`);
      return null;
    }
    this.logger.log(`Found gebruiker with id ${id}`);
    return gebruikerToFind as IGebruiker;
  }

  async create(gebruiker: CreateGebruikerDto): Promise<IGebruiker> {
    this.logger.log('create called');
    const id = await this.getLowestId();
    const gebruikerData = {
      ...gebruiker,
      id,
    };
    this.logger.debug(
      `Creating gebruiker with data: ${JSON.stringify(gebruikerData)}`
    );

    const createdGebruiker = await this.gebruikerModel.create(gebruikerData);
    const plainObject = createdGebruiker.toObject();
    this.logger.log(`Created gebruiker with id ${plainObject.id}`);
    return plainObject as IGebruiker;
  }

  async delete(gebruikerId: string, id: number): Promise<IGebruiker | null> {
    this.logger.log(`delete called with id ${id}`);
    const gebruiker = await this.gebruikerModel
      .findOne({ id: gebruikerId })
      .lean()
      .exec();
    if (gebruiker?.rol !== 'ADMIN') {
      this.logger.warn(`Unauthorized access for gebruiker: ${gebruikerId}`);
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized',
          message: 'You do not have permission to delete a gebruiker',
        },
        HttpStatus.UNAUTHORIZED
      );
    } else {
      const deletedGebruiker = await this.gebruikerModel
        .findOneAndDelete({ id })
        .lean()
        .exec();
      if (!deletedGebruiker) {
        this.logger.warn(`Gebruiker with id ${id} not found for deletion`);
        return null;
      }
      this.logger.log(`Deleted gebruiker with id ${id}`);
      return deletedGebruiker as IGebruiker;
    }
  }

  async login(
    gebruikersnaam: string,
    wachtwoord: string
  ): Promise<IGebruiker | null> {
    this.logger.log(`login called for gebruiker: ${gebruikersnaam}`);
    const gebruiker = await this.gebruikerModel
      .findOne({ gebruikersnaam, wachtwoord })
      .lean()
      .exec();

    if (!gebruiker) {
      this.logger.warn(`Login failed for gebruiker: ${gebruikersnaam}`);
      return null;
    }

    const token = sign(
      { gebruikerId: gebruiker.id.toString() },
      environment.jwtSecret,
      {
        expiresIn: '1h',
      }
    );

    const response = { ...gebruiker, token };
    this.logger.log(`Successful login for gebruiker: ${gebruikersnaam}`);
    return response as IGebruiker;
  }

  async logout(gebruikerId: string, token: string): Promise<boolean> {
    this.logger.log(`logout called for gebruiker id: ${gebruikerId}`);
    try {
      const gebruiker = await this.gebruikerModel
        .findOne({ id: gebruikerId })
        .lean()
        .exec();
      if (!gebruiker) {
        this.logger.warn(
          `Gebruiker with id ${gebruikerId} not found for logout`
        );
        return false;
      }

      this.tokenBlacklistService.add(token);

      this.logger.log(`Token invalidated for gebruiker id: ${gebruikerId}`);
      this.logger.log(`Successful logout for gebruiker id: ${gebruikerId}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Error during logout for gebruiker id: ${gebruikerId}`,
        (error as Error).stack
      );
      throw new Error('Logout failed');
    }
  }

  async update(
    gebruikersId: string,
    id: number,
    gebruiker: UpdateGebruikerDto
): Promise<IGebruiker | null> {
    this.logger.log(`update called with id ${id}`);

    const gebruikersIdNum = parseInt(gebruikersId, 10);
    const targetId = typeof id === 'string' ? parseInt(id, 10) : id;

    const LoggedInGebruiker = await this.gebruikerModel
        .findOne({ id: gebruikersIdNum })
        .lean()
        .exec();

    this.logger.log(`LoggedInGebruiker: ${JSON.stringify(LoggedInGebruiker)}`);
    this.logger.log(`loggedInId: ${gebruikersIdNum} (type: ${typeof gebruikersIdNum})`);
    this.logger.log(`id: ${targetId} (type: ${typeof targetId})`);

    const isAdmin = LoggedInGebruiker?.rol === 'ADMIN';
    const isSameUser = gebruikersIdNum === targetId;

    if (!isAdmin && !isSameUser) {
        this.logger.warn(`Unauthorized access for gebruiker: ${gebruikersId}`);
        throw new HttpException(
            {
                status: HttpStatus.UNAUTHORIZED,
                error: 'Unauthorized',
                message: 'You do not have permission to update a gebruiker',
            },
            HttpStatus.UNAUTHORIZED
        );
    }

    const updatedGebruiker = await this.gebruikerModel
        .findOneAndUpdate({ id: targetId }, gebruiker, { new: true, lean: true })
        .exec();

    if (!updatedGebruiker) {
        this.logger.warn(`Gebruiker with id ${targetId} not found for update`);
        return null;
    }

    this.logger.log(`Updated gebruiker with id ${targetId}`);
    return updatedGebruiker as IGebruiker;
}
}
