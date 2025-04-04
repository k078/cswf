import { Controller, Get, Post, Body, Param, Delete, Put, HttpException, HttpStatus, UseGuards, Req, UseInterceptors, NotFoundException } from '@nestjs/common';
import { LpService } from './lp.service';
import { ILp, Neo4jService } from '@cswf/shared/api';
import { CreateLpDto, UpdateLpDto } from '@cswf/backend/dto';
import { AuthGuard } from '../auth/authguard';
import { CustomRequest } from '../auth/custom-request.interface';
import { LoggingInterceptor } from '../auth/loggingInterceptor';

@UseInterceptors(LoggingInterceptor)
@Controller('lp')
export class LpController {
    constructor(private readonly lpService: LpService,
      private readonly neo4jService: Neo4jService,
    ) {}

    @Get('debug/neo4j-lps')
    async debugNeo4jLps() {
      const result = await this.neo4jService.runQuery(
        'MATCH (l:LP) RETURN l.id, l.titel, l.releaseJaar LIMIT 20'
      );
      return result?.map(r => r.toObject()) || [];
    }
    @Get('')
    @UseGuards(AuthGuard)
    async getAll(): Promise<ILp[]> {
        return this.lpService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async findOne(@Param('id') id: string) {
      const lp = await this.lpService.findOne(+id);
      if (!lp) {
        throw new NotFoundException('LP not found');
      }
      return {
        results: lp,
        info: {
          version: '1.0',
          type: 'object',
          count: 1
        }
      };
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
