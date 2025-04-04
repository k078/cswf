import { Injectable } from '@nestjs/common';
import { Neo4jService } from '@cswf/shared/api';
import { Recommendation } from '@cswf/shared/api';

@Injectable()
export class RecommendationService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async getRecommendations(
    artist: string,
    genre: string,
    excludeId?: string
  ): Promise<Recommendation[]> {
    // Debug: Eerst controleren of de huidige LP bestaat in Neo4j
    const currentLP = await this.neo4jService.runQuery(
      'MATCH (l:LP {id: $id}) RETURN l',
      { id: excludeId }
    );
    console.log('Current LP from Neo4j:', currentLP?.[0]?.get('l')?.properties);

    const query = `
MATCH (current:LP {id: $excludeId})

MATCH (similar:LP)-[:HAS_ARTIST]->(a:Artist {name: $artist}),
      (similar)-[:HAS_GENRE]->(g:Genre {name: $genre})
WHERE similar.id <> $excludeId
RETURN similar.id as id,
       similar.titel as titel,
       similar.artiest as artiest,
       g.name as genre,
       toInteger(similar.releaseJaar) as releaseJaar
ORDER BY similar.releaseJaar DESC
LIMIT 5
    `;

    console.log('Executing query:', query.replace(/\s+/g, ' '));

    const result = await this.neo4jService.runQuery(query, {
      artist,
      genre,
      excludeId,
    });

    console.log('Query results:', result);

    return (
      result?.map((record) => ({
        id: record.get('id'),
        titel: record.get('titel'),
        artiest: record.get('artiest'),
        genre: record.get('genre'),
        releaseJaar: record.get('releaseJaar'),
        recommendationType: 'artistAndGenre',
      })) || []
    );
  }

  async getLPsByGenre(
    genre: string,
    excludeId?: string
  ): Promise<Recommendation[]> {
    const query = `
      MATCH (current:LP {id: $excludeId})
      MATCH (similar:LP)-[:HAS_GENRE]->(g:Genre {name: $genre})
      WHERE similar.id <> $excludeId
        AND similar.releaseJaar >= current.releaseJaar
      RETURN similar.id as id,
             similar.titel as titel,
             similar.artiest as artiest,
             g.name as genre,
             similar.releaseJaar as releaseJaar
      ORDER BY similar.releaseJaar DESC
      LIMIT 5
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
        releaseJaar: record.get('releaseJaar'),
        recommendationType: 'genre',
      })) || []
    );
  }

  async getLPsByArtist(
    artiest: string,
    excludeId?: string
  ): Promise<Recommendation[]> {
    const query = `
      MATCH (current:LP {id: $excludeId})
      MATCH (similar:LP)-[:HAS_ARTIST]->(a:Artist {name: $artiest})
      WHERE similar.id <> $excludeId
        AND similar.releaseJaar >= current.releaseJaar
      RETURN similar.id as id,
             similar.titel as titel,
             similar.artiest as artiest,
             [(similar)-[:HAS_GENRE]->(g) | g.name][0] as genre,
             similar.releaseJaar as releaseJaar
      ORDER BY similar.releaseJaar DESC
      LIMIT 3
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
        releaseJaar: record.get('releaseJaar'),
        recommendationType: 'artist',
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
