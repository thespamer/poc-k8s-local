import { Controller,  Post, Param, NotFoundException, Get, Query } from '@nestjs/common';
import { VotesService } from './votes.service';
import { EmojiVotes } from './entities/vote.entity';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post(':emojiName')
  public async voteForEmoji(@Param('emojiName') emojiName: string): Promise<EmojiVotes> {
    const votes = await this.votesService.vote(emojiName);

    if (!votes) throw new NotFoundException("Emoji does not exist");
    return votes;
  }

  @Get('leaderboard')
  public async getLeaderboard(@Query('limit') limit: string | undefined): Promise<EmojiVotes[]> {
    return this.votesService.leaderboard(Number(limit) || 10);
  }
}
