import { Injectable } from '@nestjs/common';
import { Neo4jService } from '@cswf/shared/api';
import { Recommendation } from '@cswf/shared/api';
@Injectable()
export class RecommendationService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async getLPsByGenre(
    genre: string,
    excludeId?: string
  ): Promise<Recommendation[]> {
    const query = `
      MATCH (similar:LP)-[:HAS_GENRE]->(g:Genre {name: $genre})
      WHERE similar.id <> $excludeId
      RETURN similar.id as id,
             similar.titel as titel,
             similar.artiest as artiest,
             g.name as genre
  `;
    const result = await this.neo4jService.runQuery(query, {
      genre,
      excludeId,
    });
    return (
      result?.map((record) => ({
        id: record.get('id'),
        titel: record.get('titel'),
        artiest: record.get('artiest'),
        genre: record.get('genre'),
        recommendationType: 'genre',
      })) || []
    );
  }

  async getLPsByArtist(
    artiest: string,
    excludeId?: string
  ): Promise<Recommendation[]> {
    const query = `
      MATCH (similar:LP)-[:HAS_ARTIST]->(a:Artist {name: $artiest})
      WHERE similar.id <> $excludeId
      RETURN similar.id as id,
             similar.titel as titel,
             similar.artiest as artiest,
             [(similar)-[:HAS_GENRE]->(g) | g.name][0] as genre
  `;
    const result = await this.neo4jService.runQuery(query, {
      artiest,
      excludeId,
    });
    return (
      result?.map((record) => ({
        id: record.get('id'),
        titel: record.get('titel'),
        artiest: record.get('artiest'),
        genre: record.get('genre'),
        recommendationType: 'artist', // Markeer als artiest-suggestie
      })) || []
    );
  }

  async getAllArtistsFromNeo4j() {
    const query = `
        MATCH (a:Artist)
        RETURN a.name as name, a.beschrijving as beschrijving
        ORDER BY a.name
    `;
    const result = await this.neo4jService.runQuery(query);
    return result?.map((record) => record.toObject()) || [];
  }

  async getArtistDetails(name: string) {
    const query = `
        MATCH (a:Artist {name: $name})
        OPTIONAL MATCH (a)<-[:HAS_ARTIST]-(l:LP)
        RETURN a.name as name,
               a.beschrijving as beschrijving,
               collect(l.id) as lpIds,
               count(l) as lpCount
    `;
    const result = await this.neo4jService.runQuery(query, { name });
    return result?.[0]?.toObject() || null;
  }
}
