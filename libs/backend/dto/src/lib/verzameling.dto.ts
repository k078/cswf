import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
  IsArray,
  isNumber,
} from 'class-validator';
import {
  ICreateVerzameling,
  IUpdateVerzameling,
  IUpsertVerzameling,
} from '@cswf/shared/api';
import { IGebruiker } from '@cswf/shared/api';

export class CreateVerzamelingDto implements ICreateVerzameling {
  @IsString()
  @IsNotEmpty()
  naam!: string;

  @IsNumber()
  @IsOptional()
  gebruikerId!: number;

  @IsString()
  @IsNotEmpty()
  info!: string;
}

export class UpdateVerzamelingDto implements IUpdateVerzameling{
  @IsString()
  @IsOptional()
  naam?: string;

  @IsString()
  @IsOptional()
  gebruikerId?: number;

  @IsOptional()
  @IsDate()
  oprichting?: Date;

  @IsString()
  @IsOptional()
  info?: string;
}

export class UpsertVerzamelingDto implements IUpsertVerzameling{
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @IsString()
  @IsNotEmpty()
  naam!: string;

  @IsNumber()
  @IsNotEmpty()
  gebruikerId!: number;

  @IsDate()
  @IsNotEmpty()
  oprichting!: Date;

  @IsNotEmpty()
  @IsString()
  info!: string;

  @IsNotEmpty()
  lps!: Array<number>;
}
