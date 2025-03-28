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

  rol: Rol = Rol.USER;

  @IsNotEmpty()
  @IsDate()
  geboortedatum!: Date;
}
export class UpdateGebruikerDto implements IUpdateGebruiker {
  @IsOptional()
  @IsString()
  gebruikersnaam?: string;

  @IsOptional()
  @IsString()
  wachtwoord?: string;

  rol: Rol = Rol.USER;

  @IsOptional()
  @IsDate()
  geboortedatum?: Date;
}
function Type(arg0: () => DateConstructor): (target: CreateGebruikerDto, propertyKey: "geboortedatum") => void {
  throw new Error("Function not implemented.");
}

