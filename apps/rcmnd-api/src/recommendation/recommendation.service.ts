import { Injectable } from '@nestjs/common';
import { Neo4jService } from '@cswf/shared/api';

@Injectable()
export class RecommendationService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async getLPsByGenre(genre: string, excludeId?: string) {
    let query = `
      MATCH (similar:LP)-[:HAS_GENRE]->(g:Genre {name: $genre})
    `;

    if (excludeId) {
      query += `
        WHERE similar.id <> toInteger($excludeId)
      `;
    }

    query += `
      RETURN similar.id as id, similar.titel as titel, similar.artiest as artiest
      LIMIT 5
    `;

    const params: any = { genre };
    if (excludeId) {
      params.excludeId = excludeId;
    }

    const result = await this.neo4jService.runQuery(query, params);

    return (
      result?.map((record) => ({
        id: record.get('id'),
        titel: record.get('titel'),
        artiest: record.get('artiest'),
      })) || []
    );
  }

  async getLPsByArtist(artiest: string, excludeId?: string) {
    const query = `
        MATCH (similar:LP)-[:HAS_ARTIST]->(a:Artist {name: $artiest})
        ${excludeId ? 'WHERE similar.id <> toString($excludeId)' : ''}
        RETURN similar.id as id,
               similar.titel as titel,
               a.name as artiest  // Voeg artiestnaam expliciet toe
        LIMIT 5
    `;
    const result = await this.neo4jService.runQuery(query, { artiest, excludeId });
    return result?.map(record => ({
        id: record.get('id'),
        titel: record.get('titel'),
        artiest: record.get('artiest')
    })) || [];
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
