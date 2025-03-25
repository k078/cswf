import { ICreateGebruiker, IUpdateGebruiker, Rol } from "@cswf/shared/api";
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
} from 'class-validator';

export class CreateGebruikerDto implements ICreateGebruiker {
  @IsString()
  @IsNotEmpty()
  gebruikersnaam!: string;

  @IsString()
  @IsNotEmpty()
  wachtwoord!: string;

  @IsNotEmpty()
  rol: Rol = Rol.USER;

  @IsDate()
  @IsOptional()
  geboortedatum!: Date;
}

export class UpdateGebruikerDto implements IUpdateGebruiker {
  @IsOptional()
  @IsString()
  gebruikersnaam?: string;

  @IsOptional()
  @IsString()
  wachtwoord?: string;

  @IsOptional()
  @IsNumber()
  rol?: Rol;

  @IsOptional()
  @IsDate()
  geboortedatum?: Date;
}
