import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
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
  @IsNotEmpty()
  gebruiker!: string;
}


export class UpdateArtiestDto implements IUpdateArtiest{
  @IsString()
  @IsNotEmpty()
  naam?: string;

  @IsString()
  @IsNotEmpty()
  land?: string;

  @IsNumber()
  @IsNotEmpty()
  leeftijd?: number;

  @IsString()
  @IsNotEmpty()
  bio?: string;

  @IsString()
  @IsNotEmpty()
  img?: string;

  @IsString()
  @IsNotEmpty()
  gebruiker?: string;
}

export class UpsertArtiestDto implements IUpsertArtiest{
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
