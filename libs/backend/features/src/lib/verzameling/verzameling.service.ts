import { Injectable, NotFoundException } from '@nestjs/common';
import { IVerzameling } from '@cswf/shared/api';
import { BehaviorSubject } from 'rxjs';
import { Logger } from '@nestjs/common';

@Injectable()
export class VerzamelingService {
  TAG = 'VerzamelingService';

  private Verzamelingen$ = new BehaviorSubject<IVerzameling[]>([
    {
      id: 0,
      naam: 'Doos 1',
      eigenaar: 'Kalle',
      oprichting: new Date('2021-01-01'),
      info: 'Doos 1 met wat platen erin',
    },
    {
      id: 1,
      naam: 'Doos 2',
      eigenaar: 'Kalle',
      oprichting: new Date('2021-01-01'),
      info: 'Doos 2 met wat platen erin',
    },
  ]);

  getAll(): IVerzameling[] {
    Logger.log('getAll', this.TAG);
    return this.Verzamelingen$.value;
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



  /**
   * Update the arg signature to match the DTO, but keep the
   * return signature - we still want to respond with the complete
   * object
   */
  create(
    Verzameling: Pick<IVerzameling, 'naam' | 'eigenaar' | 'oprichting' | 'info'>
  ): IVerzameling {
    Logger.log('create', this.TAG);
    const current = this.Verzamelingen$.value;
    // Use the incoming data, a randomized ID, and a default value of `false` to create the new to-do
    const newVerzameling: IVerzameling = {
      id: this.Verzamelingen$.value.length+1,
      ...Verzameling,
    };
    this.Verzamelingen$.next([...current, newVerzameling]);
    return newVerzameling;
  }
}
