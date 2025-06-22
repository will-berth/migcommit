import { DatabaseAdapter } from "./DatabaseAdapter";
import { Client } from 'pg';

export class PostgreSQLAdapter implements DatabaseAdapter {
    private client: Client;
    constructor(connection: string) {
        this.client = new Client({
            connectionString: connection
        })
    }

    async init() {
        try {
            await this.client.connect();

            await this.client.end()
        } catch (err) {

        }
    }

    pull(): void {

    }

    push(): void {

    }
}