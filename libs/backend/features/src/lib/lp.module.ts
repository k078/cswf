import { Module } from '@nestjs/common';
import { LpController } from './lp/lp.controller';
import { LpService } from './lp/lp.service';

@Module({
  controllers: [LpController],
  providers: [LpService],
  exports: [LpService],
})
export class LpModule {}
