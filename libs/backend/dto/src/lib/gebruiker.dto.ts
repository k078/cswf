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
  @IsNotEmpty()
  @IsString()
  gebruikersnaam?: string;

  @IsNotEmpty()
  @IsString()
  wachtwoord?: string;

  @IsNotEmpty()
  @IsNumber()
  rol?: Rol;

  @IsNotEmpty()
  @IsDate()
  geboortedatum?: Date;
}
