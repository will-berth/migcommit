import { ConfigLoader } from "../config/ConfigLoader";
import { DatabaseAdapter } from "../databases/DatabaseAdapter";
import { PostgreSQLAdapter } from "../databases/PostgreSQLAdapter";
import { FileSystemHandler } from "./FileSystemHandler";
import { InitManager } from "./InitManager";
import { MigrationManager } from "./MigrationManager";
import { NSParser } from "./parser/NSParser";


/**
 * Factory class for handling database migrations.
 * 
 * This class follows the Factory Method pattern to instantiate and configure
 * the MigrationManager. It also defines the main entry-point commands for managing migrations.
 */
export class Migrator {

    /**
     * Creates a new instance of the Migrator.
     * 
     * @param configLoader An object responsible for loading configuration.
     * @param environment The database environment to use (default is 'dev').
     */
    constructor(
        private configLoader: ConfigLoader,
        private environment: string = 'dev'
    ) { }

    /**
     * Initializes the migration system by delegating the execution to InitManager.
     */
    init() {
        const initManager = new InitManager(new FileSystemHandler());
        initManager.execute();
    }

    /**
     * Commits a new migration with the specified name.
     * 
     * This method loads the configuration, retrieves the appropriate database adapter,
     * and delegates the commit operation to the MigrationManager.
     * 
     * @param name The name of the new migration.
     */
    commit(name: string) {
        const config = this.configLoader?.getConfig();

        const { dialect, out, environments } = config;

        const dbAdapter = this.getAdapter(dialect, environments[this.environment]);
        const parser = this.getParser(dialect);
        const manager = new MigrationManager(dbAdapter, parser);
        manager.commit(name, out, this.environment);
    }
    
    /**
     * Applies all pending migrations to the database for the current environment.
     * 
     * This method loads the configuration, retrieves the appropriate database adapter,
     * and delegates the push operation to the MigrationManager.
     */
    push() {
        const config = this.configLoader?.getConfig();
        
        const { dialect, out, environments } = config;
        
        const dbAdapter = this.getAdapter(dialect, environments[this.environment]);
        const parser = this.getParser(dialect);
        const manager = new MigrationManager(dbAdapter, parser);

        manager.push(out, this.environment);
    }

    /**
     * Returns a database adapter instance for the specified dialect and connection string.
     * 
     * @param dialect The database dialect (e.g., 'postgres').
     * @param connection The connection string for the database.
     * @returns An instance of DatabaseAdapter.
     * @throws If the dialect is unsupported.
     */
    private getAdapter(dialect: string, connection: string): DatabaseAdapter {
        switch (dialect) {
            case 'postgres':
                return new PostgreSQLAdapter(connection)
            default:
                throw new Error(`Unsupported dialect: ${dialect}`);
        }
    }
    
    /**
     * Returns a parser adapter instance for the specified dialect.
     * 
     * @param dialect The database dialect (e.g., 'postgres').
     * @returns An instance of ParserAdapter.
     * @throws If the dialect is unsupported.
     */
    private getParser(dialect: string){
        switch (dialect) {
            case 'postgres':
                return new NSParser('PostgresQL');
            default:
                throw new Error(`Unsupported dialect: ${dialect}`);
        }

    }
}