import { Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { GetEmojiResponse, ListEmojiResponse } from '@lib/emoji-svc-sdk';
import { ApiService, AugmentedLeaderboardResponse, AugmentedVoteResponse } from './api.service';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}


  @Get('emojis')
  listEmojis(@Query('limit') limit: string | undefined, @Query('skip') skip: string | undefined, @Query('name') names: string): Promise<ListEmojiResponse> {
    const nameList = names?.split(',');

    return this.apiService.listEmojis({
      pagination: { skip, limit },
      filters: { names: nameList },
    });
  }

  @Get('emojis/:name')
  async getEmojiByName(@Param('name') name: string): Promise<GetEmojiResponse> {
    const emoji = await this.apiService.getEmoji({ name });

    if (!emoji) {
      throw new NotFoundException('Emoji not found');
    }

    return emoji
  }

  @Post('vote/:name')
  async vote(@Param('name') emojiName: string): Promise<AugmentedVoteResponse> {
    const emoji = await this.apiService.vote({ emojiName });

    if (!emoji) {
      throw new NotFoundException('Emoji not found');
    }

    return emoji
  }

  @Get('leaderboard')
  getLeaderboard(@Query('limit') limit: string): Promise<AugmentedLeaderboardResponse> {
    return this.apiService.leaderboard({ limit });
  }
}
