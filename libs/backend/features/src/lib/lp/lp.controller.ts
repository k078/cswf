import { Controller, Get, Post, Body, Param, Delete, Put, HttpException, HttpStatus } from '@nestjs/common';
import { LpService } from './lp.service';
import { ILp } from '@cswf/shared/api';
import { CreateLpDto, UpdateLpDto } from '@cswf/backend/dto';

@Controller('lp')
export class LpController {
    constructor(private readonly lpService: LpService) {}

    @Get('')
    async getAll(): Promise<ILp[]> {
        return this.lpService.findAll();
    }

    @Get(':id')
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
    async create(@Body() data: CreateLpDto): Promise<ILp> {
        return this.lpService.create(data);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<{ message: string }> {
        const result = await this.lpService.delete(id);
        if (!result) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `LP with id ${id} not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return { message: `LP with id ${id} deleted successfully` };
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() data: UpdateLpDto
    ): Promise<ILp> {
        const result = await this.lpService.update(id, data);
        if (!result) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `LP with id ${id} not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return result;
    }
}
