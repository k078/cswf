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
        return this.verzamelingService.findAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: number): Promise<IVerzameling | null> {
        return await this.verzamelingService.findOne(id);
    }

    @Post('add-to-verzameling/:id/:verzamelingId')
  async addToVerzameling(
    @Param('id') lpId: string,
    @Param('verzamelingId') verzamelingId: string,
  ): Promise<string> {
    const result = await this.verzamelingService.addToVerzameling(
      parseInt(lpId, 10),
      parseInt(verzamelingId, 10),
    );
    return result;
  }

    @Post('')
    async create(@Body() data: CreateVerzamelingDto): Promise<IVerzameling> {
        console.log('Received data:', data);
        return this.verzamelingService.create(data);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<IVerzameling | null> {
      return this.verzamelingService.delete(id);
    }


    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() data: IVerzameling
    ): Promise<IVerzameling | null> {
        return await this.verzamelingService.update(id, data);
    }
}
