import { Id } from './id.type';
import { Rol } from './rol.enum';
import { IVerzameling } from './verzameling.interface';

export interface IGebruiker {
    id:Id;
    gebruikersnaam:string;
    wachtwoord:string;
    rol:Rol;
    geboortedatum:Date;
    token?:string;
    verzamelingen:IVerzameling[];
}

export type ICreateGebruiker = Pick<IGebruiker, 'gebruikersnaam' | 'wachtwoord' | 'rol' | 'geboortedatum'>;
export type IUpdateGebruiker = Partial<Omit<IGebruiker, 'id'>>;
export type IUpsertGebruiker=IGebruiker;

