import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { ConfigModule } from '@nestjs/config';
import emojiServiceConfig from './config/emoji-service.config';
import votingServiceConfig from './config/voting-service.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [emojiServiceConfig, votingServiceConfig],
      isGlobal: true,
    }),
    ApiModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
