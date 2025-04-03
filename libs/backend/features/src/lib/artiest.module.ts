import { Module } from '@nestjs/common';
import { ArtiestController } from './artiest/artiest.controller';
import { ArtiestService } from './artiest/artiest.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Artiest, ArtiestSchema } from './artiest/artiest.schema';
import { TokenBlacklistService } from './gebruiker/blacklist.service';
import { GebruikerModule } from './gebruiker.module';
import { RecommendationClientService } from './rcmnd/rcmndClient.service';
import { Neo4jModule } from '@cswf/shared/api';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Artiest.name, schema: ArtiestSchema },
    ]),
    GebruikerModule,
    Neo4jModule,
    HttpModule
  ],
  controllers: [ArtiestController],
  providers: [ArtiestService, TokenBlacklistService, RecommendationClientService],
  exports: [ArtiestService, MongooseModule],
})
export class ArtiestModule {}

