import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Genre, IGebruiker, IVerzameling, Id, Rol } from '@cswf/shared/api';

export type GebruikerDocument = Gebruiker & Document;

@Schema({
  versionKey: false,
})
export class Gebruiker implements IGebruiker {
  @Prop({ type: Number, unique: true, required: true })
  id!: number;

  @Prop({ required: true })
  gebruikersnaam!: string;

  @Prop({ required: true })
  wachtwoord!: string;

  @Prop({ required: true, type: Date })
  geboortedatum!: Date;

  @Prop({ type: String, enum: Rol, required: true })
  rol!: Rol;

  @Prop({ required: true })
  verzamelingen!: IVerzameling[];
}

export const GebruikerSchema = SchemaFactory.createForClass(Gebruiker);
