import { Controller, Get, NotFoundException, Param, Query, Req } from '@nestjs/common';
import { EmojiService, Pagination } from './emoji.service';
import { Emoji } from './entities/emoji.entity';

function parsePagination(skip: string | undefined, limit: string | undefined): Pagination {
  return {
    skip: Number(skip) || 0,
    limit: Number(limit) || 25
  }
}

@Controller('emojis')
export class EmojiController {
  constructor(private readonly emojiService: EmojiService) {}

  @Get()
  findAll(@Query('limit') limit: string | undefined, @Query('skip') skip: string | undefined, @Query('name') names: string): Emoji[] {
    const pagination = parsePagination(skip, limit);
    const nameList = names?.split(',') || []

    return this.emojiService.findAll(nameList, pagination);
  }

  @Get(':name')
  findOne(@Param('name') name: string): Emoji {
    const emoji = this.emojiService.findOne(name);

    if (!emoji) {
      throw new NotFoundException('Emoji not found');
    }

    return emoji
  }
}
