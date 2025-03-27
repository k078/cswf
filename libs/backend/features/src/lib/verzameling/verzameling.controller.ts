import { Controller, Get, Post, Body, Param, Delete, Put, HttpException, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { VerzamelingService } from './verzameling.service';
import { IVerzameling } from '@cswf/shared/api';
import { CreateVerzamelingDto, UpdateVerzamelingDto } from '@cswf/backend/dto';
import { AuthGuard } from '../auth/authguard';
import { CustomRequest } from '../auth/custom-request.interface';

@Controller('verzameling')
export class VerzamelingController {
    constructor(private readonly verzamelingService: VerzamelingService) {}

    @Get('')
    @UseGuards(AuthGuard)
    async getAll(): Promise<IVerzameling[]> {
        return this.verzamelingService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard)
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
    @UseGuards(AuthGuard)
    async addToVerzameling(
        @Req() request: CustomRequest,
        @Param('id') lpId: string,
        @Param('verzamelingId') verzamelingId: string,
    ): Promise<{ message: string }> {
        const gebruikerId = request.gebruikerId;
        const result = await this.verzamelingService.addToVerzameling(
            parseInt(lpId, 10),
            parseInt(verzamelingId, 10),
            gebruikerId as string
        );
        return { message: result };
    }

    @Post('remove-from-verzameling/:id/:verzamelingId')
    @UseGuards(AuthGuard)
    async removeFromVerzameling(
        @Req() request: CustomRequest,
        @Param('id') lpId: string,
        @Param('verzamelingId') verzamelingId: string,
    ): Promise<{ message: string }> {
        const gebruikerId = request.gebruikerId;
        const result = await this.verzamelingService.removeFromVerzameling(
            parseInt(lpId, 10),
            parseInt(verzamelingId, 10),
            gebruikerId as string
        );
        return { message: result };
    }

    @Post('')
    @UseGuards(AuthGuard)
    async create(@Req() request: CustomRequest, @Body() data: CreateVerzamelingDto): Promise<IVerzameling> {
        const gebruikerId = request.gebruikerId;
        return this.verzamelingService.create(data, gebruikerId as string);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async delete(@Req() request: CustomRequest, @Param('id') id: number): Promise<{ message: string }> {
        const gebruikerId = request.gebruikerId;
        const result = await this.verzamelingService.delete(id, gebruikerId as string);
        if (!result) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Verzameling with id ${id} not found or unauthorized`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return { message: `Verzameling with id ${id} deleted successfully` };
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    async update(
        @Req() request: CustomRequest,
        @Param('id') id: number,
        @Body() data: UpdateVerzamelingDto
    ): Promise<IVerzameling> {
        const gebruikerId = request.gebruikerId;
        const result = await this.verzamelingService.update(id, data, gebruikerId as string);
        if (!result) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Verzameling with id ${id} not found or unauthorized`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return result;
    }
}
