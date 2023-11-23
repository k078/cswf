import { Id } from './id.type';
import { ILp } from './lp.interface';

export interface IArtiest {
    id:Id;
    naam:string;
    land:string;
    leeftijd:number;
    bio:string;
    lps: ILp[];
}
