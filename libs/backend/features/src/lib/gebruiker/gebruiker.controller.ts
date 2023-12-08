import { Controller, Delete, Put } from '@nestjs/common';
import { Get, Param, Post, Body } from '@nestjs/common';
import { IGebruiker } from '@cswf/shared/api';
import { GebruikerService } from './gebruiker.service';
import { CreateGebruikerDto } from '@cswf/backend/dto';

@Controller('Gebruiker')
export class GebruikerController {
    constructor(private GebruikerService: GebruikerService) {}

    @Get('')
    async findAll(): Promise<IGebruiker[]> {
        return this.GebruikerService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<IGebruiker | null> {
        return this.GebruikerService.findOne(id);
    }

    @Post('')
    async create(@Body() data: IGebruiker): Promise<IGebruiker> {
        return this.GebruikerService.create(data);
    }

    @Post('login')
    async login(@Body() gebruiker: CreateGebruikerDto): Promise<IGebruiker | null> {
        return this.GebruikerService.login(gebruiker.gebruikersnaam, gebruiker.wachtwoord);
    }

    @Post('logout/:id')
    async logout(@Param('id') id: number): Promise<void> {
        await this.GebruikerService.logout(id);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<IGebruiker | null> {
        return this.GebruikerService.delete(id);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() data: IGebruiker): Promise<IGebruiker | null> {
        return this.GebruikerService.update(id, data);
    }
}


