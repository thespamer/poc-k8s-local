import { GetEmojiByNameRequest, GetEmojiResponse, ListEmojiRequest, ListEmojiResponse } from './types';
import Axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { URLSearchParams } from 'url';

export class EmojiWebService {
  private readonly client: AxiosInstance;

  constructor(baseUrl: string) {
    this.client = Axios.create({ baseURL: baseUrl });
  }

  public async listEmojis(request: ListEmojiRequest): Promise<ListEmojiResponse> {
    const name = request.filters.names ? request.filters.names.join(',') : undefined;
    const query = new URLSearchParams({ name, ...request.pagination });

    const response = await this.client.get<ListEmojiResponse>(`/emojis?${query.toString()}`);
    return response.data;
  }

  public async getEmojiByName(request: GetEmojiByNameRequest): Promise<GetEmojiResponse> {
    const { name } = request;

    let response: AxiosResponse<GetEmojiResponse>;
    try {
      response = await this.client.get<GetEmojiResponse>(`/emojis/${name}`);
    } catch (err) {
      if ((err as AxiosError).isAxiosError && (err as AxiosError).response?.status === 404) {
        return null
      } else {
        throw err;
      }
    }

    return response.data;
  }
}