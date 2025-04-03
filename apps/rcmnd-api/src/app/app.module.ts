import { Module } from '@nestjs/common';
import { Neo4jModule } from '@cswf/shared/api';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecommendationModule } from '../recommendation.module';

@Module({
  imports: [RecommendationModule, Neo4jModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
