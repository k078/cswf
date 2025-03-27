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
  providers: [GebruikerService, TokenBlacklistService], 
  exports: [GebruikerService, TokenBlacklistService, MongooseModule],
})
export class GebruikerModule {}
