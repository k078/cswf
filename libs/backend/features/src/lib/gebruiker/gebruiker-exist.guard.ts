import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gebruiker } from './gebruiker.schema';
import { Observable } from 'rxjs';

@Injectable()
export class GebruikerExistGuard implements CanActivate {
    constructor(@InjectModel('gebruiker') private readonly gebruikerModel: Model<Gebruiker>) {}

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const gebruiker = context.switchToHttp().getRequest().body;
        return !!this.gebruikerModel.findOne({ gebruikername: gebruiker.gebruikername });
    }
}
