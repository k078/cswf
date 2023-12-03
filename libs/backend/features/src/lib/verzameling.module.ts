import { Module } from '@nestjs/common';
import { VerzamelingController } from './verzameling/verzameling.controller';
import { VerzamelingService } from './verzameling/verzameling.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Verzameling, VerzamelingSchema } from './verzameling/verzameling.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Verzameling.name, schema: VerzamelingSchema },
    ]),
  ],
  controllers: [VerzamelingController],
  providers: [VerzamelingService],
  exports: [VerzamelingService],
})
export class VerzamelingModule {}
