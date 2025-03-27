import { Controller, Get, Post, Body, Param, Delete, Put, HttpException, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { LpService } from './lp.service';
import { ILp } from '@cswf/shared/api';
import { CreateLpDto, UpdateLpDto } from '@cswf/backend/dto';
import { AuthGuard } from '../auth/authguard';
import { CustomRequest } from '../auth/custom-request.interface';

@Controller('lp')
export class LpController {
    constructor(private readonly lpService: LpService) {}

    @Get('')
    @UseGuards(AuthGuard)
    async getAll(): Promise<ILp[]> {
        return this.lpService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async getOne(@Param('id') id: number): Promise<ILp> {
        const lp = await this.lpService.findOne(id);
        if (!lp) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `LP with id ${id} not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return lp;
    }

    @Post('')
    @UseGuards(AuthGuard)
    async create(@Req() request: CustomRequest, @Body() data: CreateLpDto): Promise<ILp> {
        const gebruikerId = request.gebruikerId;
        return this.lpService.create(data, gebruikerId as string);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async delete(@Req() request: CustomRequest, @Param('id') id: number): Promise<{ message: string }> {
        const gebruikerId = request.gebruikerId;
        const result = await this.lpService.delete(id, gebruikerId as string);
        if (!result) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `LP with id ${id} not found or unauthorized`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return { message: `LP with id ${id} deleted successfully` };
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    async update(
        @Req() request: CustomRequest,
        @Param('id') id: number,
        @Body() data: UpdateLpDto
    ): Promise<ILp> {
        const gebruikerId = request.gebruikerId;
        const result = await this.lpService.update(id, data, gebruikerId as string);
        if (!result) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `LP with id ${id} not found or unauthorized`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return result;
    }
}
