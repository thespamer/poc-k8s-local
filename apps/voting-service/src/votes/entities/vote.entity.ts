import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class EmojiVotes {
  @PrimaryKey()
  readonly emojiName: string;

  @Property()
  votes: number;

  constructor(emojiName: string, votes?: number) {
    this.emojiName = emojiName;
    this.votes = votes || 0;
  }
}
