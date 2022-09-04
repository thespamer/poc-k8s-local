import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { groupBy } from 'lodash';
import { EmojiWebService, GetEmojiByNameRequest, GetEmojiResponse, ListEmojiRequest, ListEmojiResponse } from '@lib/emoji-svc-sdk';
import { EmojiVotingSchema, LeaderboardRequest, VoteRequest, VotingWebService } from '@lib/voting-svc-sdk';

export interface AugmentedVoteResponse extends EmojiVotingSchema {
  glyph: string;
} 

export type AugmentedLeaderboardResponse = AugmentedVoteResponse[];

@Injectable()
export class ApiService {
  private readonly emojiService: EmojiWebService;

  private readonly votingService: VotingWebService;

  constructor(config: ConfigService) {
    this.emojiService = new EmojiWebService(config.get('emojiService.baseUrl'));
    this.votingService = new VotingWebService(config.get('votingService.baseUrl'));
  }

  public listEmojis(request: ListEmojiRequest): Promise<ListEmojiResponse> {
    return this.emojiService.listEmojis(request);
  }

  public getEmoji(request: GetEmojiByNameRequest): Promise<GetEmojiResponse> {
    return this.emojiService.getEmojiByName(request);
  }

  public async vote(request: VoteRequest): Promise<AugmentedVoteResponse | null> {
    const voteResponse = await this.votingService.vote(request);
    if (!voteResponse) return null;

    const emoji = await this.emojiService.getEmojiByName({ name: request.emojiName });
    return {
      ...voteResponse,
      glyph: emoji.glyph,
    };
  }

  public async leaderboard(request: LeaderboardRequest): Promise<AugmentedLeaderboardResponse> {
    const leaderboard = await this.votingService.leaderboard(request);
    const names = leaderboard.map(voting => voting.emojiName);

    const emojis = await this.emojiService.listEmojis({ filters: { names }, pagination: {}});
    const emojisByName = groupBy(emojis, emoji => emoji.name);

    return leaderboard.map(emojiVoting => ({
      ...emojiVoting,
      glyph: emojisByName[emojiVoting.emojiName][0].glyph // names are unique
    }));
  }
}
