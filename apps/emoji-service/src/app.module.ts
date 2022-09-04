import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmojiModule } from './emoji/emoji.module';

@Module({
  imports: [EmojiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
