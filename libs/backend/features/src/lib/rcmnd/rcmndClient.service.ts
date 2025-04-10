import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RecommendationClientService {
  constructor(private readonly httpService: HttpService) {}

  async getRecommendationsByArtistAndGenreAndReleasejaar(
    artist: string,
    genre: string,
    releaseJaar: string,
    excludeId?: string
  ) {
    try {
      const nummericReleasejaar = parseFloat(releaseJaar);
      let url = `http://localhost:3100/api/recommendations/artist-genre-releasejaar?artist=${artist}&genre=${genre}&releasejaar=${nummericReleasejaar}`;
      if(excludeId) {
        url += `&excludeId=${excludeId}`;
      }
      const response = await firstValueFrom(this.httpService.get(url,
        {timeout: 5000}
      ));
      return response.data;
    }
    catch (error) {
      console.error('Error fetching recommendations:', error);
      throw new Error('Failed to fetch recommendations');
    }
  }

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
