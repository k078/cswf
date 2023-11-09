import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsDate,
} from 'class-validator';
import {
  ICreateVerzameling,
  IUpdateVerzameling,
  IUpsertVerzameling,
} from '@cswf/shared/api';

export class CreateVerzamelingDto implements ICreateVerzameling{
  @IsString()
  @IsNotEmpty()
  naam!: string;

  @IsNotEmpty()
  eigenaar!: string;

  @IsDate()
  @IsNotEmpty()
  oprichting!: Date;

  @IsNotEmpty()
  @IsString()
  info!: string;
}

export class UpdateVerzamelingDto implements IUpdateVerzameling{
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  naam?: string;

  @IsNotEmpty()
  @IsOptional()
  eigenaar?: string;

  @IsNotEmpty()
  @IsDate()
  @IsOptional()
  oprichting?: Date;
}

export class UpsertVerzamelingDto implements IUpsertVerzameling{
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @IsString()
  @IsNotEmpty()
  naam!: string;

  @IsNotEmpty()
  eigenaar!: string;

  @IsDate()
  @IsNotEmpty()
  oprichting!: Date;

  @IsNotEmpty()
  @IsString()
  info!: string;
}
