import { DatabaseAdapter } from "./DatabaseAdapter";
import { Client } from 'pg';

/**
 * PostgreSQLAdapter provides methods to interact with a PostgreSQL database for migrations.
 * 
 * This class implements the DatabaseAdapter interface and handles migration table creation,
 * migration retrieval, applying migrations, and basic connection management.
 */
export class PostgreSQLAdapter implements DatabaseAdapter {
    private connection: string;
    
    /**
     * Creates a new instance of PostgreSQLAdapter.
     * 
     * @param connection The PostgreSQL connection string.
     */
    constructor(connection: string) {
        this.connection = connection;
    }

    /**
     * Creates a new PostgreSQL client instance.
     * 
     * @returns A new pg.Client configured with the connection string.
     */
    private getClient() {
        return new Client({ connectionString: this.connection });
    }

    /**
     * Ensures the migration schema and table exist in the database.
     * 
     * Creates the 'migcommit' schema and 'migrations' table if they do not exist.
     * @throws If the query fails.
     */
    async generateMigrationTable(): Promise<void> {
        const client = this.getClient();
        try {
            await client.connect();

            await client.query(`
                CREATE SCHEMA IF NOT EXISTS migcommit;
                CREATE TABLE IF NOT EXISTS migcommit.migrations (
                    id SERIAL PRIMARY KEY,
                    name TEXT NOT NULL,
                    checksum TEXT NOT NULL,
                    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);

        } catch (err: any) {
            throw new Error(err.message)
        } finally {
            await client.end()
        }
    }

    /**
     * Retrieves all migrations from the database, ordered by application time descending.
     * 
     * @returns An array of migration records.
     * @throws If the query fails.
     */
    async getMigrations(): Promise<any[]> {
        const client = this.getClient();
        try {
            await client.connect();
            const res = await client.query(`
                SELECT * FROM migcommit.migrations ORDER BY applied_at DESC;
            `);
            return res.rows;
        } catch (err: any) {
            throw new Error(err.message);
        } finally {
            await client.end();
        }

    }

    async init() {
        const client = this.getClient();
        try {
            await client.connect();
            await client.end()
        } catch (err) {
            // handle error
        }
    }

    /**
     * Placeholder for pulling migrations from the database.
     * 
     * Not implemented.
     */
    pull(): void {
        // Not implemented
    }

    /**
     * Applies a migration to the database and records it in the migrations table.
     * 
     * Executes the provided SQL statement and inserts a record into migcommit.migrations.
     * @param statement The SQL migration to apply.
     * @param name The name of the migration.
     * @param checksum The checksum of the migration.
     * @throws If the query fails.
     */
    async push(statement: string, name: string, checksum: string): Promise<void> {
        const client = this.getClient();
        try {
            await client.connect();
            await Promise.all([
                client.query(`
                    INSERT INTO migcommit.migrations (name, checksum) VALUES($1, $2)
                `, [name, checksum]),
                client.query(statement)
            ])
        } catch (err: any) {
            throw new Error(err.message)
        } finally {
            await client.end()
        }
    }
}