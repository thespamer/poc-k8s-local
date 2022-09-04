import { Module, ValueProvider } from '@nestjs/common';
import { EmojiService } from './emoji.service';
import { EmojiController } from './emoji.controller';
import { kEmojisList } from './tokens';
import { emojis } from '@lib/emojis';

const EmojisListProvider: ValueProvider = {
  provide: kEmojisList,
  useValue: emojis,
}

@Module({
  controllers: [EmojiController],
  providers: [EmojiService, EmojisListProvider]
})
export class EmojiModule {}
