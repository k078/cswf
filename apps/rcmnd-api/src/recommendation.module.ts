import { Module } from '@nestjs/common';
import { RecommendationController } from '../src/recommendation/recommendation.controller';
import { RecommendationService } from '../src/recommendation/recommendation.service';
import { Neo4jService } from '@cswf/shared/api'

@Module({
  controllers: [RecommendationController],
  providers: [RecommendationService, Neo4jService],
})
export class RecommendationModule {}
