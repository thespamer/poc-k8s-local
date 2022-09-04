import { URLSearchParams } from "url";
import Axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { LeaderboardRequest, LeaderboardResponse, VoteRequest, VoteResponse} from './types';

export class VotingWebService {
  private readonly client: AxiosInstance;

  constructor(baseUrl: string) {
    this.client = Axios.create({ baseURL: baseUrl });
  }

  public async vote(request: VoteRequest): Promise<VoteResponse> {
    let response: AxiosResponse<VoteResponse>;
    try {
      response = await this.client.post(`/votes/${request.emojiName}`);
    } catch (err) {
      if ((err as AxiosError).isAxiosError && (err as AxiosError).response?.status === 404) {
        return null;
      }

      throw err;
    }
    
    return response.data;
  }

  public async leaderboard(request: LeaderboardRequest): Promise<LeaderboardResponse> {
    const query = new URLSearchParams({ limit: request.limit });
    const response = await this.client.get<LeaderboardResponse>(`/votes/leaderboard?${query.toString()}`);

    return response.data;
  }
}