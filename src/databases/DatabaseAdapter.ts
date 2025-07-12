

/**
 * Defines the contract for database adapters used in migration management.
 * 
 * Implementations of this interface should provide methods for creating migration tables,
 * retrieving migrations, applying migrations, initializing connections, and pulling migrations.
 */
export interface DatabaseAdapter {
    /**
     * Ensures the migration table exists in the database.
     */
    generateMigrationTable(): Promise<void>;

    /**
     * Retrieves all migrations from the database.
     * 
     * @returns An array of migration records.
     */
    getMigrations(): Promise<any[]>;

    /**
     * Applies a migration to the database and records it.
     * 
     * @param statement The SQL migration to apply.
     * @param name The name of the migration.
     * @param checksum The checksum of the migration.
     */
    push(statement: string, name: string, checksum: string): Promise<void>;

    init(): void;

    /**
     * Pulls migrations from the database.
     */
    pull(): void;
}