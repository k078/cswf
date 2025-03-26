import { Controller, Get, Post, Body, Param, Delete, Put, HttpException, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { IGebruiker } from '@cswf/shared/api';
import { GebruikerService } from './gebruiker.service';
import { CreateGebruikerDto, UpdateGebruikerDto } from '@cswf/backend/dto';
import { Request } from 'express';
import { AuthGuard } from '../auth/authguard';
import { CustomRequest } from '../auth/custom-request.interface';

@Controller('gebruiker')
export class GebruikerController {
    constructor(private readonly gebruikerService: GebruikerService) {}

    @Get('')
    async findAll(): Promise<IGebruiker[]> {
        return this.gebruikerService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<IGebruiker> {
        const gebruiker = await this.gebruikerService.findOne(id);
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

    @UseGuards(AuthGuard) // Zorg ervoor dat de AuthGuard wordt gebruikt
    @Post('logout')
    async logout(@Req() request: CustomRequest): Promise<{ message: string }> {
        const gebruikerId = request.gebruikerId; // Haal gebruikerId uit het request-object
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

        const token = authorizationHeader.split(' ')[1]; // Haal het token uit de Authorization-header

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

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<{ message: string }> {
        const result = await this.gebruikerService.delete(id);
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

    @Put(':id')
    async update(@Param('id') id: number, @Body() data: UpdateGebruikerDto): Promise<IGebruiker> {
        const result = await this.gebruikerService.update(id, data);
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
