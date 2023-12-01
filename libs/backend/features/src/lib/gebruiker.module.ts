import { Module } from '@nestjs/common';
import { GebruikerController } from './gebruiker/gebruiker.controller';
import { GebruikerService } from './gebruiker/gebruiker.service';

@Module({
  controllers: [GebruikerController],
  providers: [GebruikerService],
  exports: [GebruikerService],
})
export class GebruikerModule {}
