import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ILp } from '@cswf/shared/api';
import { BehaviorSubject, race } from 'rxjs';
import { Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { ValidationError } from 'class-validator';
import { Genre } from '@cswf/shared/api';


@Injectable()
export class LpService {
  TAG = 'LpService';

  private Lps$ = new BehaviorSubject<ILp[]>([
    {
      id:1,
      titel: 'Midtown Playground',
      artiest: 'Chris Stussy',
      release: new Date('2023-10-6'),
      land: 'Netherlands',
      label: 'FUSE London',
      genre: Genre.Minimal,
      img: 'https://i1.sndcdn.com/artworks-xZeCEnLOwWin6DiW-fdeBxg-t500x500.jpg'
    },
    {
      id:2,
      titel: 'Blueprint',
      artiest: 'Chris Stussy',
      release: new Date('2023-10-6'),
      land: 'Netherlands',
      label: 'FUSE London',
      genre: Genre.Minimal,
      img: 'https://i1.sndcdn.com/artworks-xZeCEnLOwWin6DiW-fdeBxg-t500x500.jpg'
    },
    {
      id:3,
      titel: 'A Fresh Energy',
      artiest: 'Gaskin',
      release: new Date('2023-05-26'),
      land: 'United Kingdom',
      label: 'Bass Jamz',
      genre: Genre.House,
      img: 'https://i1.sndcdn.com/artworks-b0mRfmP3B1Tz7Hys-sua7uw-t500x500.jpg'
    },
    {
      id:4,
      titel: 'Pacific',
      artiest: 'Burnski',
      release: new Date('2023-11-3'),
      land: 'United Kingdom',
      label: 'Constant Sound',
      genre: Genre.Minimal,
      img: 'https://i1.sndcdn.com/artworks-ur2HYSJ8aAFlT1z6-sKjZ3g-t500x500.jpg'
    },
    {
      id:5,
      titel: 'Get Hard (You In The Lobby)',
      artiest: 'Luke Dean',
      release: new Date('2023-11-17'),
      land: 'United Kingdom',
      label: 'neXup',
      genre: Genre.House,
      img: 'https://i1.sndcdn.com/artworks-A50pbXPh0H76WuY6-7IIZIQ-t500x500.jpg'
    }
  ]);

  getAll(): ILp[] {
    Logger.log('getAll', this.TAG);
    return this.Lps$.value.sort((a, b) => a.id - b.id);
  }

  getOne(id: number): ILp {
    Logger.log(`getOne - Received id: ${id}`, this.TAG);
    Logger.log(`getOne(${id}) - Lpen$: ${JSON.stringify(this.Lps$.value.map(v => v.id))}`, this.TAG);
    const Lp = this.Lps$.value.find((td) => {
        Logger.log(`Checking id: ${td.id}`, this.TAG);
        return td.id === +id;
    });

    if (!Lp) {
        Logger.log(`getOne(${id}) - Lp not found!`, this.TAG);
        throw new NotFoundException(`Lp could not be found!`);
    }

    Logger.log(`getOne(${id}) - Found Lp: ${JSON.stringify(Lp)}`, this.TAG);
    return Lp;
}




  create(LpDto: Pick<ILp, 'titel' | 'artiest' | 'release' | 'land' | 'label' | 'genre' | 'img'>): ILp {
    Logger.log('create', this.TAG);
    Logger.log('Received data:', LpDto);

    try {
      // Maak een nieuw ILp object zonder het 'id' veld

      const randId = Math.floor(Math.random() * 1000);
      const currentLpen = this.Lps$.value;
      const LpObject: ILp = {
        id: randId,
        titel: LpDto.titel,
        artiest: LpDto.artiest,
        release: LpDto.release,
        land: LpDto.land,
        label: LpDto.label,
        genre: LpDto.genre,
        img: LpDto.img
       };

      this.Lps$.next([...currentLpen, LpObject]);
      return LpObject;
    } catch (errors) {
      // Als er validatiefouten optreden, behandel ze hier
      if (errors instanceof Array && errors.length > 0 && errors[0] instanceof ValidationError) {
        throw new BadRequestException(errors[0].toString());
      } else {
        throw errors;
      }
    }
  }



  delete(id: number): ILp {
    Logger.log('delete', this.TAG);
    const current = this.Lps$.value;
    const LpToDelete = this.getOne(id);
    this.Lps$.next([
      ...current.filter((Lp) => Lp.id !== LpToDelete.id),
    ]);
    return LpToDelete;
  }

  update(id: number, LpDto: Pick<ILp, 'titel' | 'artiest' | 'release' | 'land' | 'label' | 'genre' | 'img'>): ILp {
    Logger.log('update', this.TAG);
    Logger.log('Received data:', LpDto);

    try {
      const currentLpen = this.Lps$.value;
      const LpToUpdate = this.getOne(id);

      // Update alleen de velden die zijn opgegeven in de LpDto
      const updatedLp: ILp = {
        id: LpToUpdate.id,
        titel: LpDto.titel || LpToUpdate.titel,
        artiest: LpDto.artiest || LpToUpdate.artiest,
        release: LpDto.release || LpToUpdate.release,
        land: LpDto.land || LpToUpdate.land,
        label: LpDto.label || LpToUpdate.label,
        genre: LpDto.genre || LpToUpdate.genre,
        img: LpDto.img || LpToUpdate.img
      };

      this.Lps$.next([
        ...currentLpen.filter((v) => v.id !== LpToUpdate.id),
        updatedLp,
      ]);

      return updatedLp;
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
