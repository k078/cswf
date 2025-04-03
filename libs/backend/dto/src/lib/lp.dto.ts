import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
  IsDateString,
  IsEnum,
  IsOptional,
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

  @IsNumber()
  @IsNotEmpty()
  releaseJaar!: number;

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

  @IsString()
  @IsOptional()
  gebruikerId!: number;
}


export class UpdateLpDto implements IUpdateLp{
  @IsString()
  @IsOptional()
  titel?: string;

  @IsOptional()
  artiest?: string;

  @IsNumber()
  @IsOptional()
  releaseJaar?: number;

  @IsString()
  @IsOptional()
  land?: string;

  @IsString()
  @IsOptional()
  label?: string;

  @IsOptional()
  genre?: Genre;

  @IsNumber()
  @IsOptional()
  gebruikerId?: number;
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

  @IsNumber()
  @IsNotEmpty()
  releaseJaar!: number;

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

  @IsNumber()
  gebruikerId!: number;
}
