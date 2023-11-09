import { Id } from './id.type';

type User = string;

export interface IVerzameling {
    id:Id;
    naam:string;
    eigenaar:User;
    oprichting:Date;
    info:string;
}

export type ICreateVerzameling = Pick<IVerzameling, 'naam' | 'eigenaar' | 'oprichting'>;
export type IUpdateVerzameling = Partial<Omit<IVerzameling, 'id'>>;
export type IUpsertVerzameling=IVerzameling;
