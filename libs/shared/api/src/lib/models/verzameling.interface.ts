import { IGebruiker } from './gebruiker.interface';
import { Id } from './id.type';
import { ILp } from './lp.interface';

type User = string;

export interface IVerzameling {
    id:Id;
    naam:string;
    eigenaar:string;
    oprichting:Date;
    info:string;
    lps:Array<number>;
}

export type ICreateVerzameling = Pick<IVerzameling, 'naam' | 'eigenaar' | 'info' | 'lps'>;
export type IUpdateVerzameling = Partial<Omit<IVerzameling, 'id'>>;
export type IUpsertVerzameling=IVerzameling;
