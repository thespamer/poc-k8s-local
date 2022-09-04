export interface EmojiSchema {
  name: string;
  glyph: string;
}

export interface PaginationOptions {
  skip?: string;
  limit?: string;
}

export interface ListEmojiRequest {
  filters: { names?: string[] },
  pagination: PaginationOptions,
}

export interface GetEmojiByNameRequest {
  name: string;
}

export type ListEmojiResponse = EmojiSchema[];

export type GetEmojiResponse = EmojiSchema | null;