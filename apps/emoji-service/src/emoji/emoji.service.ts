import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Emoji } from './entities/emoji.entity';
import { kEmojisList } from './tokens';

export interface Pagination {
  limit: number;

  skip: number;
}

@Injectable()
export class EmojiService {
  constructor(
    @Inject(kEmojisList)
    private readonly emojisList: Record<string, string>
  ) {}

  public findAll(names: string[], pagination: Pagination): Emoji[] {
    const { skip, limit } = pagination;

    const emojisList = names.length
      ? names.map<[string, string]>(name => [name, this.emojisList[`:${name}:`]])
          .filter(([_, glyph]) => Boolean(glyph))
      : Object.entries(this.emojisList);

    return emojisList
      .slice(skip, skip + limit)
      .map(([name, glyph]) => new Emoji(name.replace(/:/g, ''), glyph));
  }

  findOne(name: string): Emoji | null {
    const emoji = this.emojisList[`:${name}:`];

    if (!emoji) return null;
    return new Emoji(name, emoji);
  }
}
