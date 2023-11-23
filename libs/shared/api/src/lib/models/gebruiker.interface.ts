import { Id } from './id.type';

export interface IGebruiker {
    id:Id;
    gebruikersnaam:string;
    wachtwoord:string;
    geboortedatum:Date;
}
