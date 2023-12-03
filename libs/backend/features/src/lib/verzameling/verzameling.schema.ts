import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { IVerzameling, IGebruiker, ILp } from '@cswf/shared/api';

export type VerzamelingDocument = Verzameling & Document;

@Schema({
  versionKey: false,
})
export class Verzameling implements IVerzameling {
  @Prop({ type:Number, unique: true, required: true })
  id!: number;

  @Prop({ required: true })
  naam!: string;

  @Prop({ required: true })
  eigenaar!: string;

  @Prop({ required: false })
  oprichting: Date= new Date(Date.now());

  @Prop({ required: false })
  info!: string;

  @Prop({ required: false, type: [] })
  lps!: Array<number>;
}

export const VerzamelingSchema = SchemaFactory.createForClass(Verzameling);
