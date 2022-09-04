import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import emojiServiceConfig from './config/emoji-service.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VotesModule } from './votes/votes.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig, emojiServiceConfig],
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
        autoLoadEntities: true,
      }),
    }),
    VotesModule,
  ],
})
export class AppModule {}
