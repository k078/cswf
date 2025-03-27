import { Module } from '@nestjs/common';
import { ArtiestController } from './artiest/artiest.controller';
import { ArtiestService } from './artiest/artiest.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Artiest, ArtiestSchema } from './artiest/artiest.schema';
import { TokenBlacklistService } from './gebruiker/blacklist.service';
import { GebruikerModule } from './gebruiker.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Artiest.name, schema: ArtiestSchema },
    ]),
    GebruikerModule
  ],
  controllers: [ArtiestController],
  providers: [ArtiestService, TokenBlacklistService],
  exports: [ArtiestService, MongooseModule],
})
export class ArtiestModule {}

