import { Controller, Delete, Put } from '@nestjs/common';
import { ArtiestService } from './artiest.service';
import { Get, Param, Post, Body } from '@nestjs/common';
import { IArtiest } from '@cswf/shared/api';
import { CreateArtiestDto } from '@cswf/backend/dto';

@Controller('Artiest')
export class ArtiestController {
    constructor(private ArtiestService: ArtiestService) {}

    @Get('')
    async getAll(): Promise<IArtiest[]> {
        return this.ArtiestService.findAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: number): Promise<IArtiest | null> {
        return await this.ArtiestService.findOne(id);
    }

    @Post('')
    async create(@Body() data: CreateArtiestDto): Promise<IArtiest> {
        console.log('Received data:', data);
        return this.ArtiestService.create(data);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<IArtiest | null> {
      return this.ArtiestService.delete(id);
    }


    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() data: IArtiest
    ): Promise<IArtiest | null> {
        return await this.ArtiestService.update(id, data);
    }
}
