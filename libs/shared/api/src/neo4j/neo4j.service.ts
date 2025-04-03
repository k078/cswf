import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as neo4j from 'neo4j-driver';

@Injectable()
export class Neo4jService implements OnModuleInit, OnModuleDestroy {
    private driver: neo4j.Driver;

    constructor() {
        // Initialize the Neo4j driver (gebruik je eigen credentials)
        this.driver = neo4j.driver(
            'bolt://localhost:7687', // of je remote Neo4j URL
            neo4j.auth.basic('neo4j', 'suggesties'), // vervang 'password' door je wachtwoord
            {
                disableLosslessIntegers: true // voorkomt problemen met grote integers
            }
        );
    }

    async onModuleInit() {
        // Optioneel: Test de verbinding bij startup
        await this.testConnection();
    }

    async onModuleDestroy() {
        // Sluit de driver wanneer de module stopt
        await this.driver.close();
    }

    private async testConnection() {
        try {
            await this.driver.verifyConnectivity();
            console.log('✅ Neo4j verbinding succesvol!');
        } catch (error) {
            console.error('❌ Neo4j verbinding mislukt:', error);
            throw error;
        }
    }

    /**
     * Voer een Cypher-query uit en retourneer de records.
     * @param query Cypher-query (bijv. "MATCH (n) RETURN n")
     * @param parameters Optionele parameters (bijv. { id: 123 })
     * @returns Resultaatrecords of null bij een leeg resultaat
     */
    async runQuery(
        query: string,
        parameters?: Record<string, any>,
    ): Promise<neo4j.Record[] | null> {
        const session = this.driver.session();
        try {
            const result = await session.run(query, parameters);
            return result.records.length > 0 ? result.records : null;
        } catch (error) {
            console.error('Neo4j query error:', error);
            const error2 = error as Error;
            throw new Error(`Neo4j query failed: ${error2.message}`);
        } finally {
            await session.close();
        }
    }

    /**
     * Voer een query uit en retourneer een enkele waarde (bijv. voor COUNT).
     * @param query Cypher-query
     * @param parameters Optionele parameters
     * @returns Eerste waarde van het eerste record (of null)
     */
    async runReadQuery<T = any>(
        query: string,
        parameters?: Record<string, any>,
    ): Promise<T | null> {
        const records = await this.runQuery(query, parameters);
        return records?.[0]?.get(0) ?? null;
    }
}
