import { Controller, Delete, Put } from '@nestjs/common';
import { VerzamelingService } from './verzameling.service';
import { Get, Param, Post, Body } from '@nestjs/common';
import { IVerzameling } from '@cswf/shared/api';
import { CreateVerzamelingDto } from '@cswf/backend/dto';

@Controller('Verzameling')
export class VerzamelingController {
    constructor(private verzamelingService: VerzamelingService) {}

    @Get('')
    async getAll(): Promise<IVerzameling[]> {
        return await this.verzamelingService.findAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: string): Promise<IVerzameling | null> {
        return await this.verzamelingService.findOne(id);
    }

    @Post('')
    async create(@Body() data: CreateVerzamelingDto): Promise<IVerzameling> {
        console.log('Received data:', data);
        return await this.verzamelingService.create(data);
    }


    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() data: IVerzameling
    ): Promise<IVerzameling | null> {
        return await this.verzamelingService.update(id, data);
    }
}
