import { Controller, Get, Param, Query } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

@Get('genre/:genre')
async getByGenre(
  @Param('genre') genre: string,
  @Query('excludeId') excludeId?: string
) {
  return this.recommendationService.getLPsByGenre(genre, excludeId);
}
}
