import { Controller, Get, Post, Body, Param, Delete, Put, HttpException, HttpStatus, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { IGebruiker } from '@cswf/shared/api';
import { GebruikerService } from './gebruiker.service';
import { CreateGebruikerDto, UpdateGebruikerDto } from '@cswf/backend/dto';
import { AuthGuard } from '../auth/authguard';
import { CustomRequest } from '../auth/custom-request.interface';
import { LoggingInterceptor } from '../auth/loggingInterceptor';

@UseInterceptors(LoggingInterceptor)
@Controller('gebruiker')
export class GebruikerController {
    constructor(private readonly gebruikerService: GebruikerService) {}

    @UseGuards(AuthGuard)
    @Get('')
    async findAll(@Req() request: CustomRequest): Promise <IGebruiker[] | null> {
        const gebruikerId = request.gebruikerId;
        if (!gebruikerId) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Bad Request',
                    message: 'gebruikerId is required',
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        return this.gebruikerService.findAll(gebruikerId);
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async findOne(@Req() request: CustomRequest, @Param('id') id: string): Promise<IGebruiker> {
      const gebruikerId = request.gebruikerId as string;
      const gebruiker = await this.gebruikerService.findOne(gebruikerId, id);
        if (!gebruiker) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Gebruiker with id ${id} not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return gebruiker;
    }

    @UseGuards(AuthGuard)
    @Post('')
    async create(@Body() data: CreateGebruikerDto): Promise<IGebruiker> {
        return this.gebruikerService.create(data);
    }

    @Post('login')
    async login(@Body() body: { gebruikersnaam: string, wachtwoord: string }): Promise<IGebruiker> {
        const gebruiker = await this.gebruikerService.login(body.gebruikersnaam, body.wachtwoord);
        if (!gebruiker) {
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized',
                    message: 'Invalid credentials'
                },
                HttpStatus.UNAUTHORIZED
            );
        }
        return gebruiker;
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Req() request: CustomRequest): Promise<{ message: string }> {
        const gebruikerId = request.gebruikerId;
        const authorizationHeader = request.headers.authorization;

        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized',
                    message: 'No valid token provided',
                },
                HttpStatus.UNAUTHORIZED,
            );
        }

        const token = authorizationHeader.split(' ')[1];

        if (!gebruikerId) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Bad Request',
                    message: 'gebruikerId is required',
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        const success = await this.gebruikerService.logout(gebruikerId, token);
        if (!success) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Gebruiker with id ${gebruikerId} not found`,
                },
                HttpStatus.NOT_FOUND,
            );
        }
        return { message: 'Successfully logged out' };
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async delete(@Req() request: CustomRequest, @Param('id') id: number): Promise<{ message: string }> {
      const gebruikerId = request.gebruikerId as string;
      const result = await this.gebruikerService.delete(gebruikerId, id);
        if (!result) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Gebruiker with id ${id} not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return { message: `Gebruiker with id ${id} deleted successfully` };
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    async update(@Req() request: CustomRequest, @Param('id') id: number, @Body() data: UpdateGebruikerDto): Promise<IGebruiker> {
      const gebruikerId = request.gebruikerId as string;
      const result = await this.gebruikerService.update(gebruikerId, id, data);
        if (!result) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Gebruiker with id ${id} not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return result;
    }
}
