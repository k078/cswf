import { Genre } from './genre.enum';
import { Id } from './id.type';

export interface ILabel {
    id:Id;
    naam:string;
    oprichting:Date;
    land:string;
    genres:Genre[];
}
