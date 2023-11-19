import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IVerzameling } from '@cswf/shared/api';
import { CreateVerzamelingDto, UpdateVerzamelingDto } from '@cswf/backend/dto';
import { BehaviorSubject, race } from 'rxjs';
import { Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { ValidationError } from 'class-validator';


@Injectable()
export class VerzamelingService {
  TAG = 'VerzamelingService';

  private Verzamelingen$ = new BehaviorSubject<IVerzameling[]>([
    {
      id: 1,
      naam: 'LPs van Kalle',
      eigenaar: 'Kalle',
      info: 'Een kartonnen doos met wat LPs erin',
      oprichting: new Date('2021-01-01'),
    },
    {
      id: 2,
      naam: 'Platendoos zolder',
      eigenaar: 'Sten',
      info: 'Doos met wat platen erin',
      oprichting: new Date('2021-01-01'),
    },
    {
      id: 3,
      naam: 'Meer LPs van Kalle',
      eigenaar: 'Kalle',
      info: 'Tweede verzameling met wat platen erin',
      oprichting: new Date('2021-01-01'),
    },
    {
      id: 4,
      naam: 'LPs van vader',
      eigenaar: 'Kalle',
      info: 'Doos van vader met platen van vroeger',
      oprichting: new Date('2021-01-01'),
    },
    {
      id: 5,
      naam: 'Verzameling Sten',
      eigenaar: 'Sten',
      info: 'Verzameling nieuwe platen van Sten',
      oprichting: new Date('2021-01-01'),
    },
  ]);

  getAll(): IVerzameling[] {
    Logger.log('getAll', this.TAG);
    return this.Verzamelingen$.value.sort((a, b) => a.id - b.id);
  }

  getOne(id: number): IVerzameling {
    Logger.log(`getOne - Received id: ${id}`, this.TAG);
    Logger.log(`getOne(${id}) - Verzamelingen$: ${JSON.stringify(this.Verzamelingen$.value.map(v => v.id))}`, this.TAG);
    const Verzameling = this.Verzamelingen$.value.find((td) => {
        Logger.log(`Checking id: ${td.id}`, this.TAG);
        return td.id === +id;
    });

    if (!Verzameling) {
        Logger.log(`getOne(${id}) - Verzameling not found!`, this.TAG);
        throw new NotFoundException(`Verzameling could not be found!`);
    }

    Logger.log(`getOne(${id}) - Found Verzameling: ${JSON.stringify(Verzameling)}`, this.TAG);
    return Verzameling;
}




  create(verzamelingDto: Pick<IVerzameling, 'naam' | 'eigenaar' | 'info'>): IVerzameling {
    Logger.log('create', this.TAG);
    Logger.log('Received data:', verzamelingDto);

    try {
      // Maak een nieuw IVerzameling object zonder het 'id' veld

      const randId = Math.floor(Math.random() * 1000);
      const currentVerzamelingen = this.Verzamelingen$.value;
      const verzamelingObject: IVerzameling = {
        // Of een andere logica om een nieuw id te genereren
         id: randId,
         naam: verzamelingDto.naam,
         eigenaar: verzamelingDto.eigenaar,
         info: verzamelingDto.info,
         oprichting: new Date(),
       };

      this.Verzamelingen$.next([...currentVerzamelingen, verzamelingObject]);
      return verzamelingObject;
    } catch (errors) {
      // Als er validatiefouten optreden, behandel ze hier
      if (errors instanceof Array && errors.length > 0 && errors[0] instanceof ValidationError) {
        throw new BadRequestException(errors[0].toString());
      } else {
        throw errors;
      }
    }
  }



  delete(id: number): IVerzameling {
    Logger.log('delete', this.TAG);
    const current = this.Verzamelingen$.value;
    const VerzamelingToDelete = this.getOne(id);
    this.Verzamelingen$.next([
      ...current.filter((Verzameling) => Verzameling.id !== VerzamelingToDelete.id),
    ]);
    return VerzamelingToDelete;
  }

  update(id: number, verzamelingDto: Pick<IVerzameling, 'naam' | 'eigenaar' | 'info'>): IVerzameling {
    Logger.log('update', this.TAG);
    Logger.log('Received data:', verzamelingDto);

    try {
      const currentVerzamelingen = this.Verzamelingen$.value;
      const verzamelingToUpdate = this.getOne(id);

      // Update alleen de velden die zijn opgegeven in de verzamelingDto
      const updatedVerzameling: IVerzameling = {
        id: verzamelingToUpdate.id,
        naam: verzamelingDto.naam || verzamelingToUpdate.naam,
        eigenaar: verzamelingDto.eigenaar || verzamelingToUpdate.eigenaar,
        info: verzamelingDto.info || verzamelingToUpdate.info,
        oprichting: verzamelingToUpdate.oprichting, // Bijwerken van de oprichtingsdatum (of andere logica)
      };

      this.Verzamelingen$.next([
        ...currentVerzamelingen.filter((v) => v.id !== verzamelingToUpdate.id),
        updatedVerzameling,
      ]);

      return updatedVerzameling;
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
