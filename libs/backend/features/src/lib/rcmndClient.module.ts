import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RecommendationClientService } from '../lib/rcmnd/rcmndClient.service'; // Zorg ervoor dat het pad correct is

@Module({
  imports: [HttpModule], // HttpModule voor Axios
  providers: [RecommendationClientService],
  exports: [RecommendationClientService], // Exporteer de service voor gebruik in andere modules
})
export class RcmndClientModule {}
