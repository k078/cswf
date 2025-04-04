import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RecommendationClientService {
  constructor(private readonly httpService: HttpService) {}

  async getRecommendationsByArtistAndGenre(
    artist: string,
    genre: string,
    excludeId?: string
  ) {
    const url = `http://localhost:3100/api/recommendations/artist-genre/${artist}/${genre}?excludeId=${excludeId}`;
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data;
  }

  async getRecommendationsByGenre(genre: string, excludeId?: string) {
    const url = `http://localhost:3100/api/recommendations/genre/${genre}?excludeId=${excludeId}`;
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data;
  }

  async getRecommendationsByArtist(artist: string, excludeId?: string) {
    const url = `http://localhost:3100/api/recommendations/artist/${artist}?excludeId=${excludeId}`;
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data;
  }
}
