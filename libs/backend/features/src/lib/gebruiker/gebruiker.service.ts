import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IGebruiker, Rol } from '@cswf/shared/api';
import { BehaviorSubject} from 'rxjs';
import { Logger } from '@nestjs/common';
import { ValidationError } from 'class-validator';


@Injectable()
export class GebruikerService {
  TAG = 'GebruikerService';

  private Gebruikers$ = new BehaviorSubject<IGebruiker[]>([
    {
      id:1,
      gebruikersnaam: 'admin',
      wachtwoord: 'admin',
      rol: Rol.Admin,
      geboortedatum: new Date('2023-10-6')
    }
  ]);

  getAll(): IGebruiker[] {
    Logger.log('getAll', this.TAG);
    return this.Gebruikers$.value.sort((a, b) => a.id - b.id);
  }

  getOne(id: number): IGebruiker {
    Logger.log(`getOne - Received id: ${id}`, this.TAG);
    Logger.log(`getOne(${id}) - Gebruiker$: ${JSON.stringify(this.Gebruikers$.value.map(v => v.id))}`, this.TAG);
    const Gebruiker = this.Gebruikers$.value.find((td) => {
        Logger.log(`Checking id: ${td.id}`, this.TAG);
        return td.id === +id;
    });

    if (!Gebruiker) {
        Logger.log(`getOne(${id}) - Gebruiker not found!`, this.TAG);
        throw new NotFoundException(`Gebruiker could not be found!`);
    }

    Logger.log(`getOne(${id}) - Found Gebruiker: ${JSON.stringify(Gebruiker)}`, this.TAG);
    return Gebruiker;
}




  create(GebruikerDto: Pick<IGebruiker, 'gebruikersnaam' | 'wachtwoord' | 'rol' | 'geboortedatum'>): IGebruiker {
    Logger.log('create', this.TAG);
    Logger.log('Received data:', GebruikerDto);

    try {
      // Maak een nieuw IGebruiker object zonder het 'id' veld

      const randId = Math.floor(Math.random() * 1000);
      const currentGebruikeren = this.Gebruikers$.value;
      const GebruikerObject: IGebruiker = {
        id: randId,
        gebruikersnaam: GebruikerDto.gebruikersnaam,
        wachtwoord: GebruikerDto.wachtwoord,
        rol: GebruikerDto.rol,
        geboortedatum: GebruikerDto.geboortedatum
       };

      this.Gebruikers$.next([...currentGebruikeren, GebruikerObject]);
      return GebruikerObject;
    } catch (errors) {
      // Als er validatiefouten optreden, behandel ze hier
      if (errors instanceof Array && errors.length > 0 && errors[0] instanceof ValidationError) {
        throw new BadRequestException(errors[0].toString());
      } else {
        throw errors;
      }
    }
  }



  delete(id: number): IGebruiker {
    Logger.log('delete', this.TAG);
    const current = this.Gebruikers$.value;
    const GebruikerToDelete = this.getOne(id);
    this.Gebruikers$.next([
      ...current.filter((Gebruiker) => Gebruiker.id !== GebruikerToDelete.id),
    ]);
    return GebruikerToDelete;
  }

  update(id: number, GebruikerDto: Pick<IGebruiker, 'gebruikersnaam' | 'wachtwoord' | 'rol' | 'geboortedatum'>): IGebruiker {
    Logger.log('update', this.TAG);
    Logger.log('Received data:', GebruikerDto);

    try {
      const currentGebruikeren = this.Gebruikers$.value;
      const GebruikerToUpdate = this.getOne(id);

      // Update alleen de velden die zijn opgegeven in de GebruikerDto
      const updatedGebruiker: IGebruiker = {
        id: GebruikerToUpdate.id,
        gebruikersnaam: GebruikerDto.gebruikersnaam ?? GebruikerToUpdate.gebruikersnaam,
        wachtwoord: GebruikerDto.wachtwoord ?? GebruikerToUpdate.wachtwoord,
        rol: GebruikerDto.rol ?? GebruikerToUpdate.rol,
        geboortedatum: GebruikerDto.geboortedatum ?? GebruikerToUpdate.geboortedatum
      };

      this.Gebruikers$.next([
        ...currentGebruikeren.filter((v) => v.id !== GebruikerToUpdate.id),
        updatedGebruiker,
      ]);

      return updatedGebruiker;
    } catch (errors) {
      // Als er validatiefouten optreden, behandel ze hier
      if (errors instanceof Array && errors.length > 0 && errors[0] instanceof ValidationError) {
        throw new BadRequestException(errors[0].toString());
      } else {
        throw errors;
      }
    }
  }

}
