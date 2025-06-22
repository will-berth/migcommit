import { generateChecksum } from "../utils";
import { DatabaseAdapter } from "../databases/DatabaseAdapter";
import { FileSystemHandler } from "./FileSystemHandler";

/**
 * Handles the core logic for managing database migrations.
 * 
 * This class is responsible for executing the main migration commands
 * such as creating (committing) new migration files and managing related resources.
 */
export class MigrationManager {

    /**
     * Creates a new instance of MigrationManager.
     * 
     * @param database The database adapter to use for migrations.
     * @param fsHandler The file system handler (optional, defaults to a new instance).
     */
    constructor(
        private database: DatabaseAdapter,
        private fsHandler: FileSystemHandler = new FileSystemHandler()
    ) { }

    /**
     * Handles the logic for the `commit` command.
     * 
     * This method prepares the necessary directories and metadata for migrations.
     * It then generates a new SQL file with a unique timestamp and checksum.
     * 
     * @param name The name of the commit/migration.
     * @param out The output directory where the migration file should be saved.
     * @param envTag The tag for the current database environment.
     */
    commit(name: string, out: string, envTag: string) {
        try {
            const metadataDirPath = out + '/_metadata';
            const metadataFilePath = metadataDirPath + '/_.json'

            if (!this.fsHandler.exist(out)) {
                this.fsHandler.buildDir(out)
                this.fsHandler.buildDir(metadataDirPath)
                this.fsHandler.createJson(metadataFilePath, {})
            }

            const history = this.fsHandler.readJson(metadataFilePath)
            const historyByEnv: any[] = history[envTag] || []
            
            const timestamp = Date.now();
            const checksum = generateChecksum(name + timestamp.toString())
            const sqlFileName = checksum + ' - ' + name + '.sql';
            const path = out + '/' + sqlFileName
            
            historyByEnv.forEach(log => log.head = false);
            
            historyByEnv.push({
                name: sqlFileName,
                head: true,
                checksum,
            })
            history[envTag] = historyByEnv

            
            this.fsHandler.writeNewMigration(path, '-- add your migration here!!!')
            this.fsHandler.createJson(metadataFilePath, history)

        } catch (err) {
            console.log(err)
        }
    }

    /**
     * Placeholder for future implementation of the `push` command.
     * Intended to apply pending migrations to the database.
     */
    push() {
        // TODO: Implement logic to apply migrations
    }
}