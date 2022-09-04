import { QueryOrder } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmojiWebService } from '@lib/emoji-svc-sdk';
import { EmojiVotes } from './entities/vote.entity';

@Injectable()
export class VotesService {
  private readonly emojiService: EmojiWebService;

  constructor(
    private readonly em: EntityManager,
    config: ConfigService
  ) {
    this.emojiService = new EmojiWebService(config.get('emojiService.baseUrl'));
  }

  public async vote(emojiName: string): Promise<EmojiVotes> {
    const emojiExists = await this.emojiService.getEmojiByName({ name: emojiName });
    if (!emojiExists) return null;

    let emoji = await this.em.findOne(EmojiVotes, { emojiName });
    if (!emoji) {
      emoji = new EmojiVotes(emojiName);
      this.em.persist(emoji);
    };

    emoji.votes += 1;

    this.em.flush();
    return emoji;
  }

  public async leaderboard(limit: number): Promise<EmojiVotes[]> {
    return this.em.find(EmojiVotes, {}, {
      orderBy: {
        votes: QueryOrder.DESC,
      },
      limit
    });
  }
}
