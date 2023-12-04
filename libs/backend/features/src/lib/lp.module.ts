// lp.module.ts
import { Module } from '@nestjs/common';
import { LpController } from './lp/lp.controller';
import { LpService } from './lp/lp.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Lp, LpSchema } from './lp/lp.schema';

// lp.module.ts
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lp.name, schema: LpSchema },
    ]),
  ],
  controllers: [LpController],
  providers: [LpService],
  exports: [LpService, MongooseModule], // Zorg ervoor dat LpModel correct wordt geëxporteerd
})
export class LpModule {}

