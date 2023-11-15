import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
} from 'class-validator';
import {
  ICreateVerzameling,
  IUpdateVerzameling,
  IUpsertVerzameling,
} from '@cswf/shared/api';

export class CreateVerzamelingDto implements ICreateVerzameling {
  @IsString()
  @IsNotEmpty()
  naam!: string;

  @IsString()
  @IsNotEmpty()
  eigenaar!: string;

  @IsString()
  @IsNotEmpty()
  info!: string;
}

export class UpdateVerzamelingDto implements IUpdateVerzameling{
  @IsString()
  @IsNotEmpty()
  naam?: string;

  @IsNotEmpty()
  eigenaar?: string;

  @IsNotEmpty()
  @IsDate()
  oprichting?: Date;

  @IsString()
  @IsNotEmpty()
  info?: string;
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
