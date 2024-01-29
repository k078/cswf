import { Logger, Module } from '@nestjs/common';
import { ArtiestModule, VerzamelingModule } from '@cswf/backend/features';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LpModule } from '@cswf/backend/features';
import { GebruikerModule } from '@cswf/backend/features';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://kalle:pye9wQPTA3TM0W33@cluster0.xmqqxbk.mongodb.net/',
  {
    connectionFactory: (connection) => {
      connection.on('connected', () => {
        Logger.verbose('MongoDB connected');
      });
      connection._events.connected();
      return connection;
    }
  }
  ), VerzamelingModule, LpModule, GebruikerModule, ArtiestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
