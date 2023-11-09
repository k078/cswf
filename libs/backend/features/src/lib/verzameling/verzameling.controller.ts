import { Controller, Logger } from '@nestjs/common';
import { VerzamelingService } from './verzameling.service';
import { Get, Param, Post, Body } from '@nestjs/common';
import { IVerzameling } from '@cswf/shared/api';
import { CreateVerzamelingDto } from '@cswf/backend/dto';

@Controller('Verzameling')
export class VerzamelingController {
    constructor(private VerzamelingService: VerzamelingService) {}

    @Get('')
    getAll(): IVerzameling[] {
        return this.VerzamelingService.getAll();
    }

    @Get(':id')
    getOne(@Param('id') id: number): IVerzameling {
        return this.VerzamelingService.getOne(id);
    }


    @Post('')
    create(@Body() data: CreateVerzamelingDto): IVerzameling {
        return this.VerzamelingService.create(data);
    }
}
