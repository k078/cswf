import { Module } from '@nestjs/common';
import { GebruikerController } from './gebruiker/gebruiker.controller';
import { GebruikerService } from './gebruiker/gebruiker.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Gebruiker, GebruikerSchema } from './gebruiker/gebruiker.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Gebruiker.name, schema: GebruikerSchema },
    ]),
    GebruikerModule
  ],
  controllers: [GebruikerController],
  providers: [GebruikerService],
  exports: [GebruikerService],
})
export class GebruikerModule {}
