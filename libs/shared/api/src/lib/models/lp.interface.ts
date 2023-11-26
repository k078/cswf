import { Id } from './id.type';
import { IArtiest } from './artiest.interface';
import { Genre } from './genre.enum';

type Label = string;

export interface ILp {
    id:Id;
    titel:string;
    artiest:string;
    release:Date;
    land:string;
    label:string;
    genre:Genre;
    img:string;
}

export type ICreateLp = Pick<ILp, 'titel' | 'artiest' | 'release' | 'land' | 'label' | 'genre' | 'img'>;
export type IUpdateLp = Partial<Omit<ILp, 'id'>>;
export type IUpsertLp=ILp;
