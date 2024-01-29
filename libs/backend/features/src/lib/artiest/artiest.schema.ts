import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { IArtiest, Id } from '@cswf/shared/api';

export type ArtiestDocument = Artiest & Document;

@Schema({
  versionKey: false,
})
export class Artiest implements IArtiest {
  @Prop({ type: Number, unique: true, required: true })
  id!: number;

  @Prop({ required: true })
  naam!: string;

  @Prop({ required: true })
  land!: string;

  @Prop({ required: true })
  leeftijd!: number;

  @Prop({ required: true })
  bio!: string;

  @Prop({ required: true })
  img!: string;

  @Prop({ required: true })
  gebruiker!: string;
}

export const ArtiestSchema = SchemaFactory.createForClass(Artiest);
