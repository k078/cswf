import { Id } from './id.type';
import { Rol } from './rol.enum';

export interface IGebruiker {
    id:Id;
    gebruikersnaam:string;
    wachtwoord:string;
    rol:Rol;
    geboortedatum:Date;
}

export type ICreateGebruiker = Pick<IGebruiker, 'gebruikersnaam' | 'wachtwoord' | 'rol' | 'geboortedatum'>;
export type IUpdateGebruiker = Partial<Omit<IGebruiker, 'id'>>;
export type IUpsertGebruiker=IGebruiker;

