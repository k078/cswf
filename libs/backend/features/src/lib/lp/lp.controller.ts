import { Controller, Delete, Put } from '@nestjs/common';
import { Get, Param, Post, Body } from '@nestjs/common';
import { ILp } from '@cswf/shared/api';
import { LpService } from './lp.service';

@Controller('Lp')
export class LpController {
    constructor(private LpService: LpService) {}

    @Get('')
    getAll(): ILp[] {
        return this.LpService.getAll();
    }

    @Get(':id')
    getOne(@Param('id') id: number): ILp {
        return this.LpService.getOne(id);
    }


    @Post('')
    create(@Body() data: ILp): ILp{
        console.log('Received data:', data);
        return this.LpService.create(data);
    }

    @Delete(':id')
    delete(@Param('id') id: number): ILp {
        return this.LpService.delete(id);
    }

    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() data: ILp
    ):ILp{
        return this.LpService.update(id, data);
    }
}


