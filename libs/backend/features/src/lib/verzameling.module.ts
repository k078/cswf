import { Module } from '@nestjs/common';
import { VerzamelingController } from './verzameling/verzameling.controller';
import { VerzamelingService } from './verzameling/verzameling.service';

@Module({
  controllers: [VerzamelingController],
  providers: [VerzamelingService],
  exports: [VerzamelingService],
})
export class VerzamelingModule {}
