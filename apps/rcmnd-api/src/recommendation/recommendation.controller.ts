import { Controller, Get, Param, Query } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly service: RecommendationService) {}

  @Get('recommend/:artist/:genre')
  async getRecommendations(
    @Param('artist') artist: string,
    @Param('genre') genre: string,
    @Query('excludeId') excludeId?: string
  ) {
    return this.service.getRecommendations(artist, genre, excludeId);
  }

  @Get('genre/:genre')
  async getByGenre(
    @Param('genre') genre: string,
    @Query('excludeId') excludeId?: string
  ) {
    return this.service.getLPsByGenre(genre, excludeId);
  }

  @Get('artist/:artist')
  async getByArtist(
    @Param('artist') artist: string,
    @Query('excludeId') excludeId?: string
  ) {
    return this.service.getLPsByArtist(artist, excludeId);
  }
  @Get('artists')
  async getAllArtists() {
    return this.service.getAllArtistsFromNeo4j();
  }

  @Get('artist/:name')
  async getArtistByName(@Param('name') name: string) {
    return this.service.getArtistDetails(name);
  }
}
