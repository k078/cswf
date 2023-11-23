import { Id } from './id.type';
import { IArtiest } from './artiest.interface';
import { Genre } from './genre.enum';

type Label = string;

export interface ILp {
    id:Id;
    titel:string;
    artiest:IArtiest;
    release:Date;
    land:string;
    label:Label;
    genre:Genre;
    featurings: IArtiest[];
}
