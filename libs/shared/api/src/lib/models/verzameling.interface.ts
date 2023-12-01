import { Id } from './id.type';

type User = string;

export interface IVerzameling {
    id:Id;
    naam:string;
    eigenaar:string;
    oprichting:Date;
    info:string;
    lps:Array<number>;
}

export type ICreateVerzameling = Pick<IVerzameling, 'naam' | 'eigenaar' | 'info'>;
export type IUpdateVerzameling = Partial<Omit<IVerzameling, 'id'>>;
export type IUpsertVerzameling=IVerzameling;
