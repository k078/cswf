import { Module } from '@nestjs/common';
import { VerzamelingModule } from '@cswf/backend/features';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LpModule } from '@cswf/backend/features';

@Module({
  imports: [VerzamelingModule, LpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
