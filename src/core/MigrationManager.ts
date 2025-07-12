import { generateChecksum } from "../utils";
import { DatabaseAdapter } from "../databases/DatabaseAdapter";
import { FileSystemHandler } from "./FileSystemHandler";
import { ParserAdapter } from "./parser/ParserAdapter";

/**
 * Handles the core logic for managing database migrations.
 * 
 * This class is responsible for executing the main migration commands
 * such as creating (committing) new migration files and managing related resources.
 */
export class MigrationManager {
    private timeline: any;

    /**
     * Creates a new instance of MigrationManager.
     * 
     * @param database The database adapter to use for migrations.
     * @param parser The parser adapter to use for SQL introspection.
     * @param fsHandler The file system handler (optional, defaults to a new instance).
     */
    constructor(
        private database: DatabaseAdapter,
        private parser: ParserAdapter,
        private fsHandler: FileSystemHandler = new FileSystemHandler()
    ) { }

    /**
     * Retrieves the migration timeline for a specific environment.
     * 
     * This method reads the metadata file and returns the list of migrations
     * associated with the given environment. If no migrations exist for the environment,
     * it returns an empty array.
     * 
     * @param out The output directory containing the metadata.
     * @param env The environment tag to retrieve the migration timeline for.
     * @returns An array of migration metadata objects for the specified environment.
     */
    private getTimeline(out: string, env: string) {
        const metadataDirPath = out + '/_metadata';
        const metadataFilePath = metadataDirPath + '/_.json';
        this.timeline = this.fsHandler.readJson(metadataFilePath);
        return this.timeline[env] || [];
    }

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
            const timestampInSeconds = Math.floor(timestamp / 1000);
            const sqlFileName = timestampInSeconds + ' - ' + name + '.sql';
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
     * Handles the logic for the `push` command.
     * 
     * This method applies all pending migrations to the database for the specified environment.
     * It ensures the migration table exists, retrieves applied migrations, and executes
     * each new migration in order. After applying, it updates the metadata with introspection data.
     * 
     * @param source The directory containing migration files.
     * @param env The database environment tag to apply migrations to.
     */
    async push(source: string, env: string) {
        try {
            await this.database.generateMigrationTable();
            const dbMigrations = await this.database.getMigrations();
            const currentIndexDB = dbMigrations.length;
            const timeline = this.getTimeline(source, env);

            for (let i = currentIndexDB; i < timeline.length; i++) {
                const { name, checksum } = timeline[i];
                const path = source + '/' + name;
                const sql = this.fsHandler.readFile(path);
                await this.database.push(sql, name, checksum);
                const atsQuery = this.parser.toJson(sql);
                timeline[i]['introspect'] = atsQuery;
                console.log(`Migration ${name} applied successfully.`);
            }

            const metadataDirPath = source + '/_metadata';
            const metadataFilePath = metadataDirPath + '/_.json';
            const newTimeline = { ...this.timeline };
            newTimeline[env] = timeline;

            this.fsHandler.createJson(metadataFilePath, newTimeline);

        } catch (err) {
            console.log(err)
        }
    }
}