export interface EmojiVotingSchema {
  emojiName: string;
  votes: number;
}

export interface VoteRequest {
  emojiName: string;
}

export type VoteResponse = EmojiVotingSchema | null;

export interface LeaderboardRequest {
  limit?: string;
}

export type LeaderboardResponse = EmojiVotingSchema[];
