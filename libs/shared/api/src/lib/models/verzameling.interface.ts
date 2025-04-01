import { Id } from './id.type';

export interface IVerzameling {
    id:Id;
    naam:string;
    gebruikerId:number;
    oprichting:Date;
    info:string;
    lps:Array<number>;
}

export type ICreateVerzameling = Pick<IVerzameling, 'naam' | 'info'>;
export type IUpdateVerzameling = Partial<Omit<IVerzameling, 'id'>>;
export type IUpsertVerzameling=IVerzameling;
