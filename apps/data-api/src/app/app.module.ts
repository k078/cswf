import { Module } from '@nestjs/common';
import { VerzamelingModule } from '@cswf/backend/features';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [VerzamelingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
