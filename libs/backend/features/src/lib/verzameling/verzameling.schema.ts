import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { IVerzameling, IGebruiker, ILp } from '@cswf/shared/api';

export type VerzamelingDocument = Verzameling & Document;

@Schema()
export class Verzameling implements IVerzameling {
  @Prop()
  id!: number;

  @Prop({ required: true })
  naam!: string;

  @Prop({ required: true })
  eigenaar!: string;

  @Prop({ required: false })
  oprichting: Date= new Date(Date.now());

  @Prop({ required: false })
  info!: string;

  @Prop({ required: false })
  lps!: Array<number>;
}

export const VerzamelingSchema = SchemaFactory.createForClass(Verzameling);
