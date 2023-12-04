import { Controller, Delete, Put } from '@nestjs/common';
import { LpService } from './lp.service';
import { Get, Param, Post, Body } from '@nestjs/common';
import { ILp } from '@cswf/shared/api';
import { CreateLpDto } from '@cswf/backend/dto';

@Controller('Lp')
export class LpController {
    constructor(private lpService: LpService) {}

    @Get('')
    async getAll(): Promise<ILp[]> {
        return this.lpService.findAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: number): Promise<ILp | null> {
        return await this.lpService.findOne(id);
    }

    @Post('')
    async create(@Body() data: CreateLpDto): Promise<ILp> {
        console.log('Received data:', data);
        return this.lpService.create(data);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<ILp | null> {
      return this.lpService.delete(id);
    }


    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() data: ILp
    ): Promise<ILp | null> {
        return await this.lpService.update(id, data);
    }
}
