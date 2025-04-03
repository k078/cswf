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

    return result?.map(record => ({
      id: record.get('id'),
      titel: record.get('titel'),
      artiest: record.get('artiest'),
    })) || [];
  }
}
