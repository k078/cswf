import { Controller, Delete, Put } from '@nestjs/common';
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
    create(@Body() data: IVerzameling): IVerzameling{
        console.log('Received data:', data);
        return this.VerzamelingService.create(data);
    }

    @Delete(':id')
    delete(@Param('id') id: number): IVerzameling {
        return this.VerzamelingService.delete(id);
    }

    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() data: IVerzameling
    ):IVerzameling{
        return this.VerzamelingService.update(id, data);
    }
}


