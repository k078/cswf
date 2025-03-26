import { Module } from '@nestjs/common';
import { GebruikerController } from './gebruiker/gebruiker.controller';
import { GebruikerService } from './gebruiker/gebruiker.service';
import { TokenBlacklistService } from './gebruiker/blacklist.service'; // Importeer de blacklist-service
import { MongooseModule } from '@nestjs/mongoose';
import { Gebruiker, GebruikerSchema } from './gebruiker/gebruiker.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Gebruiker.name, schema: GebruikerSchema },
    ]),
  ],
  controllers: [GebruikerController],
  providers: [GebruikerService, TokenBlacklistService], // Voeg de blacklist-service toe
  exports: [GebruikerService, TokenBlacklistService], // Exporteer de blacklist-service
})
export class GebruikerModule {}
