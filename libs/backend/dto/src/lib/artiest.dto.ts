import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
  IsOptional
} from 'class-validator';
import {
  ICreateArtiest,
  IUpdateArtiest,
  IUpsertArtiest,
} from '@cswf/shared/api';

export class CreateArtiestDto implements ICreateArtiest {
  @IsString()
  @IsNotEmpty()
  naam!: string;

  @IsString()
  @IsNotEmpty()
  land!: string;

  @IsNumber()
  @IsNotEmpty()
  leeftijd!: number;

  @IsString()
  @IsNotEmpty()
  bio!: string;

  @IsString()
  @IsNotEmpty()
  img!: string;

  @IsString()
  @IsOptional()
  gebruikerId!: number;
}


export class UpdateArtiestDto implements IUpdateArtiest{
  @IsString()
  @IsOptional()
  naam?: string;

  @IsString()
  @IsOptional()
  land?: string;

  @IsNumber()
  @IsOptional()
  leeftijd?: number;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  img?: string;

  @IsString()
  @IsOptional()
  gebruiker?: string;
}

export class UpsertArtiestDto implements IUpsertArtiest{
  gebruikerId!: number;
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @IsString()
  @IsNotEmpty()
  naam!: string;

  @IsString()
  @IsNotEmpty()
  land!: string;

  @IsNumber()
  @IsNotEmpty()
  leeftijd!: number;

  @IsString()
  @IsNotEmpty()
  bio!: string;

  @IsString()
  @IsNotEmpty()
  img!: string;

  @IsString()
  @IsNotEmpty()
  gebruiker!: string;
}
