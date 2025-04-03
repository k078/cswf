import { Module } from '@nestjs/common';
import { LpController } from './lp/lp.controller';
import { LpService } from './lp/lp.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Lp, LpSchema } from './lp/lp.schema';
import { TokenBlacklistService } from './gebruiker/blacklist.service';
import { GebruikerModule } from './gebruiker.module';
import { Neo4jService } from '@cswf/shared/api';
import { HttpModule } from '@nestjs/axios';
import { RecommendationClientService } from './rcmnd/rcmndClient.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lp.name, schema: LpSchema },
    ]),
    GebruikerModule,
    HttpModule
  ],
  controllers: [LpController],
  providers: [LpService, TokenBlacklistService, Neo4jService, RecommendationClientService],
  exports: [LpService, MongooseModule]
})
export class LpModule {}

