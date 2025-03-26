  import { Module, forwardRef } from '@nestjs/common';
  import { VerzamelingController } from './verzameling/verzameling.controller';
  import { VerzamelingService } from './verzameling/verzameling.service';
  import { MongooseModule } from '@nestjs/mongoose';
  import { Verzameling, VerzamelingSchema } from './verzameling/verzameling.schema';
  import { LpModule } from './lp.module';
import { GebruikerModule } from './gebruiker.module';

  @Module({
    imports: [
      MongooseModule.forFeature([
        { name: Verzameling.name, schema: VerzamelingSchema },
      ]),
      LpModule,
      GebruikerModule
    ],
    controllers: [VerzamelingController],
    providers: [VerzamelingService],
    exports: [VerzamelingService],
  })
  export class VerzamelingModule {}
