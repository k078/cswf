  import { Module, forwardRef } from '@nestjs/common';
  import { VerzamelingController } from './verzameling/verzameling.controller';
  import { VerzamelingService } from './verzameling/verzameling.service';
  import { MongooseModule } from '@nestjs/mongoose';
  import { Verzameling, VerzamelingSchema } from './verzameling/verzameling.schema';
  import { LpModule } from './lp.module';

  @Module({
    imports: [
      MongooseModule.forFeature([
        { name: Verzameling.name, schema: VerzamelingSchema },
      ]),
      LpModule
    ],
    controllers: [VerzamelingController],
    providers: [VerzamelingService],
    exports: [VerzamelingService],
  })
  export class VerzamelingModule {}
