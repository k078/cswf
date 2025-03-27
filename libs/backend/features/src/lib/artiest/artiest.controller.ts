import { Controller, Get, Post, Body, Param, Delete, Put, HttpException, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { ArtiestService } from './artiest.service';
import { IArtiest } from '@cswf/shared/api';
import { CreateArtiestDto, UpdateArtiestDto } from '@cswf/backend/dto';
import { AuthGuard } from '../auth/authguard';
import { CustomRequest } from '../auth/custom-request.interface';

@Controller('artiest')
export class ArtiestController {
    constructor(private readonly artiestService: ArtiestService) {}

    @Get('')
    @UseGuards(AuthGuard)
    async getAll(): Promise<IArtiest[]> {
        return this.artiestService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard)
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
    @UseGuards(AuthGuard)
    async create(@Req() request: CustomRequest, @Body() data: CreateArtiestDto): Promise<IArtiest> {
        const gebruikerId = request.gebruikerId;
        return this.artiestService.create(data, gebruikerId as string);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async delete(@Req() request: CustomRequest, @Param('id') id: number): Promise<{ message: string }> {
        const gebruikerId = request.gebruikerId;
        const result = await this.artiestService.delete(id, gebruikerId as string);
        if (!result) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Artiest with id ${id} not found or unauthorized`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return { message: `Artiest with id ${id} deleted successfully` };
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    async update(
        @Req() request: CustomRequest,
        @Param('id') id: number,
        @Body() data: UpdateArtiestDto
    ): Promise<IArtiest> {
        const gebruikerId = request.gebruikerId;
        const result = await this.artiestService.update(id, data, gebruikerId as string);
        if (!result) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Artiest with id ${id} not found or unauthorized`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return result;
    }
}
