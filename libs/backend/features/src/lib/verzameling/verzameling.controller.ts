import { Controller, Get, Post, Body, Param, Delete, Put, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { VerzamelingService } from './verzameling.service';
import { IVerzameling } from '@cswf/shared/api';
import { CreateVerzamelingDto, UpdateVerzamelingDto } from '@cswf/backend/dto';
import { AuthGuard } from '../auth/authguard';

@Controller('verzameling')
export class VerzamelingController {
    constructor(private readonly verzamelingService: VerzamelingService) {}

    @Get('')
    @UseGuards(AuthGuard)
    async getAll(): Promise<IVerzameling[]> {
        return this.verzamelingService.findAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: number): Promise<IVerzameling> {
        const verzameling = await this.verzamelingService.findOne(id);
        if (!verzameling) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Verzameling with id ${id} not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return verzameling;
    }

    @Post('add-to-verzameling/:id/:verzamelingId')
    async addToVerzameling(
        @Param('id') lpId: string,
        @Param('verzamelingId') verzamelingId: string,
    ): Promise<{ message: string }> {
        const result = await this.verzamelingService.addToVerzameling(
            parseInt(lpId, 10),
            parseInt(verzamelingId, 10),
        );
        return { message: result };
    }

    @Post('')
    async create(@Body() data: CreateVerzamelingDto): Promise<IVerzameling> {
        return this.verzamelingService.create(data);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<{ message: string }> {
        const result = await this.verzamelingService.delete(id);
        if (!result) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Verzameling with id ${id} not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return { message: `Verzameling with id ${id} deleted successfully` };
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() data: UpdateVerzamelingDto
    ): Promise<IVerzameling> {
        const result = await this.verzamelingService.update(id, data);
        if (!result) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Verzameling with id ${id} not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return result;
    }
}
