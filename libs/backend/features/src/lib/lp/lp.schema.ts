import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Genre, ILp, Id } from '@cswf/shared/api';

export type LpDocument = Lp & Document;

@Schema({
  versionKey: false,
})
export class Lp implements ILp {
  @Prop({ type: Number, unique: true, required: true })
  id!: number;

  @Prop({ required: true })
  titel!: string;

  @Prop({ required: true })
  artiest!: string;

  @Prop({ required: true })
  releaseJaar!: number;

  @Prop({ required: true })
  land!: string;

  @Prop({ required: true })
  label!: string;

  @Prop({ type: String, enum: Genre, required: true })
  genre!: Genre;

  @Prop({ required: true })
  img!: string;

  @Prop({ required: true })
  gebruikerId!: number;
}

export const LpSchema = SchemaFactory.createForClass(Lp);
