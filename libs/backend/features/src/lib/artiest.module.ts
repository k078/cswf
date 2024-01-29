import { Module } from '@nestjs/common';
import { ArtiestController } from './artiest/artiest.controller';
import { ArtiestService } from './artiest/artiest.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Artiest, ArtiestSchema } from './artiest/artiest.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Artiest.name, schema: ArtiestSchema },
    ]),
  ],
  controllers: [ArtiestController],
  providers: [ArtiestService],
  exports: [ArtiestService, MongooseModule],
})
export class ArtiestModule {}

