import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { environment } from '@cswf/shared/util-env';
import { verify } from 'jsonwebtoken';
import { TokenBlacklistService } from '../gebruiker/blacklist.service'; // Importeer de blacklist-service

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenBlacklistService: TokenBlacklistService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      throw new HttpException('No authorization header found', HttpStatus.UNAUTHORIZED);
    }

    const token = authorizationHeader.replace('Bearer ', '');

    // Controleer of het token in de blacklist staat
    if (this.tokenBlacklistService.has(token)) {
      throw new HttpException('Token is invalidated', HttpStatus.UNAUTHORIZED);
    }

    try {
      const payload = verify(token, environment.jwtSecret) as { gebruikerId: string };
      request['gebruikerId'] = payload.gebruikerId; // Voeg gebruikerId toe aan het request-object
    } catch (err) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}
