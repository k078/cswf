import { Controller, Get, Post, Body, Param, Delete, Put, HttpException, HttpStatus } from '@nestjs/common';
import { ArtiestService } from './artiest.service';
import { IArtiest } from '@cswf/shared/api';
import { CreateArtiestDto, UpdateArtiestDto } from '@cswf/backend/dto';

@Controller('artiest')
export class ArtiestController {
    constructor(private readonly artiestService: ArtiestService) {}

    @Get('')
    async getAll(): Promise<IArtiest[]> {
        return this.artiestService.findAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: number): Promise<IArtiest> {
        const artiest = await this.artiestService.findOne(id);
        if (!artiest) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Artiest with id ${id} not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return artiest;
    }

    @Post('')
    async create(@Body() data: CreateArtiestDto): Promise<IArtiest> {
        return this.artiestService.create(data);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<{ message: string }> {
        const result = await this.artiestService.delete(id);
        if (!result) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Artiest with id ${id} not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return { message: `Artiest with id ${id} deleted successfully` };
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() data: UpdateArtiestDto): Promise<IArtiest> {
        const result = await this.artiestService.update(id, data);
        if (!result) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Artiest with id ${id} not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return result;
    }
}
