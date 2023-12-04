import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
  IsDateString,
  IsEnum,
} from 'class-validator';
import {
  ICreateLp,
  IUpdateLp,
  IUpsertLp,
} from '@cswf/shared/api';
import { Genre } from '@cswf/shared/api';

export class CreateLpDto implements ICreateLp {
  @IsString()
  @IsNotEmpty()
  titel!: string;

  @IsString()
  @IsNotEmpty()
  artiest!: string;

  @IsDateString()  // IsDateString voor datumvalidatie
  @IsNotEmpty()
  release!: Date;

  @IsString()
  @IsNotEmpty()
  land!: string;

  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsEnum(Genre)
  @IsNotEmpty()
  genre!: Genre;

  @IsString()
  @IsNotEmpty()
  img!: string;
}


export class UpdateLpDto implements IUpdateLp{
  @IsString()
  @IsNotEmpty()
  titel?: string;

  @IsNotEmpty()
  artiest?: string;

  @IsNotEmpty()
  @IsDate()
  release?: Date;

  @IsString()
  @IsNotEmpty()
  land?: string;

  @IsString()
  @IsNotEmpty()
  label?: string;

  @IsNotEmpty()
  genre?: Genre;
}

export class UpsertLpDto implements IUpsertLp{
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @IsString()
  @IsNotEmpty()
  titel!: string;

  @IsNotEmpty()
  artiest!: string;

  @IsDate()
  @IsNotEmpty()
  release!: Date;

  @IsString()
  @IsNotEmpty()
  land!: string;

  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsNotEmpty()
  genre!: Genre;

  @IsString()
  @IsNotEmpty()
  img!: string;
}
