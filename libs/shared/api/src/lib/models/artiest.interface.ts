import { Id } from './id.type';
import { ILp } from './lp.interface';

export interface IArtiest {
    id:Id;
    naam:string;
    land:string;
    leeftijd:number;
    bio:string;
    img:string;
    gebruiker:string;
}

export type ICreateArtiest = Pick<IArtiest, 'naam' | 'land' | 'leeftijd' | 'bio' | 'img' | 'gebruiker'>;
export type IUpdateArtiest = Partial<Omit<IArtiest, 'id'>>;
export type IUpsertArtiest=IArtiest;
