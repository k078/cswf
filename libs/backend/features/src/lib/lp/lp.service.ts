import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ILp } from '@cswf/shared/api';
import { InjectModel } from '@nestjs/mongoose';
import { Lp, LpDocument } from './lp.schema';
import { Model } from 'mongoose';
import { CreateLpDto, UpdateLpDto } from '@cswf/backend/dto';
import { Gebruiker } from '../gebruiker/gebruiker.schema';
import { TokenBlacklistService } from '../gebruiker/blacklist.service';
import { Neo4jService } from '@cswf/shared/api';
import { RecommendationClientService } from '../rcmnd/rcmndClient.service';
import { Recommendation } from '@cswf/shared/api';

@Injectable()
export class LpService {
  private readonly logger = new Logger(LpService.name);

  constructor(
    @InjectModel(Lp.name) private readonly lpModel: Model<LpDocument>,
    @InjectModel(Gebruiker.name)
    private readonly gebruikerModel: Model<Gebruiker>,
    private readonly tokenBlacklistService: TokenBlacklistService,
    private readonly neo4jService: Neo4jService,
    private readonly recommendationClientService: RecommendationClientService
  ) {}

  async syncAllLPs(): Promise<{synced: number}> {
    const lps = await this.lpModel.find().lean().exec();
    let syncedCount = 0;

    for (const lp of lps) {
      try {
        const result = await this.neo4jService.runQuery(
          `
          MERGE (l:LP {id: $id})
          SET l.titel = $titel,
              l.artiest = $artiest,
              l.genre = $genre,
              l.releaseJaar = toInteger($releaseJaar),
              l.land = $land,
              l.label = $label
          MERGE (a:Artist {name: $artiest})
          MERGE (g:Genre {name: $genre})
          MERGE (l)-[:HAS_ARTIST]->(a)
          MERGE (l)-[:HAS_GENRE]->(g)
          RETURN l.id
          `,
          {
            id: lp.id.toString(),
            titel: lp.titel,
            artiest: lp.artiest,
            genre: lp.genre,
            releaseJaar: lp.releaseJaar,
            land: lp.land,
            label: lp.label
          }
        );

        if (result?.length) syncedCount++;
      } catch (error) {
        console.error(`Error syncing LP ${lp.id}:`, error);
      }
    }

    console.log(`Synced ${syncedCount}/${lps.length} LPs to Neo4j`);
    return { synced: syncedCount };
  }


  private async getLowestId(): Promise<number> {
    this.logger.log('getLowestId called');
    const usedIds = (await this.lpModel.distinct('id').exec()) as number[];
    let lowestId = 1;
    while (usedIds.includes(lowestId)) {
      lowestId++;
    }
    this.logger.log(`Found lowest available ID: ${lowestId}`);
    return lowestId;
  }

  async findAll(): Promise<ILp[]> {
    this.logger.log('findAll called');

    const syncResult = await this.syncAllLPs();
    this.logger.log(`Sync result: ${syncResult.synced} LPs synced`);

    const neo4jLps = await this.neo4jService.runQuery(
      'MATCH (l:LP) RETURN l.id, l.releaseJaar LIMIT 10'
    );
    console.log('Neo4j LP samples:', neo4jLps);

    const lps = await this.lpModel.find().lean().exec();
    this.logger.log(`Found ${lps.length} LPs`);
    return lps as ILp[];
  }

  async findOne(id: number) {
    const lp = await this.lpModel.findOne({ id }).lean().exec();
    if (!lp) return null;

    try {
      const recommendations = await this.recommendationClientService.getRecommendations(
        lp.artiest,
        lp.genre,
        lp.id.toString()
      );

      console.log('Raw recommendations:', recommendations);

      //const suggestions = recommendations
      //  .filter(
      //    (suggestion: Recommendation) =>
      //      suggestion && +suggestion.id !== +lp.id
      //  )
      //  .slice(0, 5);

      const result = {
        ...lp,
        suggestions: recommendations,
      };

      console.log('Final result:', result);
      return result;
    } catch (error) {
      console.error('Error:', error);
      return {
        ...lp,
        suggestions: [],
      };
    }
  }

  async create(lpDto: CreateLpDto, gebruikerId: string): Promise<ILp> {
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
    const lpData = {
      ...lpDto,
      id,
      gebruikerId: gebruiker.id,
    };
    this.logger.debug(`Creating LP with data: ${JSON.stringify(lpData)}`);

    const createdLp = await this.lpModel.create(lpData);

    await this.neo4jService.runQuery(
      `
        MERGE (a:Artist {name: $artiest})
        MERGE (l:LP {id: $id})
        SET l.titel = $titel,
            l.artiest = $artiest,
            l.releaseJaar = $releaseJaar
        MERGE (l)-[:HAS_ARTIST]->(a)
        MERGE (l)-[:HAS_GENRE]->(g:Genre {name: $genre})
      `,
      {
        id: createdLp.id,
        titel: createdLp.titel,
        artiest: createdLp.artiest,
        genre: createdLp.genre,
        releaseJaar: createdLp.releaseJaar
      }
    );

    const plainObject = createdLp.toObject();
    this.logger.log(`Created LP with id ${plainObject.id}`);
    return plainObject as ILp;
  }

  async delete(id: number, gebruikerId: string): Promise<ILp | null> {
    this.logger.log(`delete called with id ${id}`);

    const lp = await this.lpModel.findOne({ id }).lean().exec();
    const gebruiker = await this.gebruikerModel
      .findOne({ id: gebruikerId })
      .lean()
      .exec();

    if (!lp || !gebruiker) {
      this.logger.warn(`LP or user not found`);
      return null;
    }

    if (gebruiker.rol !== 'ADMIN' && gebruiker.id !== lp.gebruikerId) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized',
          message: 'You do not have permission to delete this LP',
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    const deletedLp = await this.lpModel.findOneAndDelete({ id }).lean().exec();
    if (!deletedLp) {
      this.logger.warn(`LP with id ${id} not found for deletion`);
      return null;
    }
    this.logger.log(`Deleted LP with id ${id}`);

    await this.neo4jService.runQuery(
      `
          MATCH (l:LP {id: $id})
          DETACH DELETE l
        `,
      { id }
    );

    return deletedLp as ILp;
  }

  async update(
    id: number,
    lpDto: UpdateLpDto,
    gebruikerId: string
  ): Promise<ILp | null> {
    this.logger.log(`update called with id ${id}`);

    const lp = await this.lpModel.findOne({ id }).lean().exec();
    const gebruiker = await this.gebruikerModel
      .findOne({ id: gebruikerId })
      .lean()
      .exec();

    if (!lp || !gebruiker) {
      this.logger.warn(`LP or user not found`);
      return null;
    }

    if (gebruiker.rol !== 'ADMIN' && gebruiker.id !== lp.gebruikerId) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized',
          message: 'You do not have permission to update this LP',
        },
        HttpStatus.UNAUTHORIZED
      );
    }
    lpDto.gebruikerId = gebruiker.id as number;
    const updatedLp = await this.lpModel
      .findOneAndUpdate({ id }, lpDto, { new: true, lean: true })
      .exec();

    if (!updatedLp) {
      this.logger.warn(`LP with id ${id} not found for update`);
      return null;
    }

    this.logger.log(`Updated LP with id ${id}`);

    await this.neo4jService.runQuery(
      `
          MATCH (l:LP {id: $id})
          SET l.titel = $titel, l.artiest = $artiest
          WITH l
          OPTIONAL MATCH (l)-[r:HAS_GENRE]->()
          DELETE r
          WITH l
          MERGE (g:Genre {name: $genre})
          MERGE (l)-[:HAS_GENRE]->(g)
          WITH l
          OPTIONAL MATCH (l)-[r:HAS_ARTIST]->()
          DELETE r
          WITH l
          MERGE (a:Artist {name: $artiest})
          MERGE (l)-[:HAS_ARTIST]->(a)
        `,
      {
        id,
        titel: lpDto.titel,
        artiest: lpDto.artiest,
        genre: lpDto.genre,
      }
    );

    await this.neo4jService.runQuery(
      `
          MATCH (l:LP {id: $id})
          SET l.titel = $titel, l.artiest = $artiestNaam
          WITH l
          OPTIONAL MATCH (l)-[r:HAS_ARTIST]->()
          DELETE r
          WITH l
          MERGE (a:Artist {name: $artiestNaam})
          MERGE (l)-[:HAS_ARTIST]->(a)
      `,
      {
        id,
        titel: lpDto.titel,
        artiestNaam: lpDto.artiest,
      }
    );
    return updatedLp as ILp;
  }
}
