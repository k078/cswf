import { Controller, Delete, Put } from '@nestjs/common';
import { Get, Param, Post, Body } from '@nestjs/common';
import { IGebruiker } from '@cswf/shared/api';
import { GebruikerService } from './gebruiker.service';

@Controller('Gebruiker')
export class GebruikerController {
    constructor(private GebruikerService: GebruikerService) {}

    @Get('')
    getAll(): IGebruiker[] {
        return this.GebruikerService.getAll();
    }

    @Get(':id')
    getOne(@Param('id') id: number): IGebruiker {
        return this.GebruikerService.getOne(id);
    }


    @Post('')
    create(@Body() data: IGebruiker): IGebruiker{
        console.log('Received data:', data);
        return this.GebruikerService.create(data);
    }

    @Delete(':id')
    delete(@Param('id') id: number): IGebruiker {
        return this.GebruikerService.delete(id);
    }

    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() data: IGebruiker
    ):IGebruiker{
        return this.GebruikerService.update(id, data);
    }
}


