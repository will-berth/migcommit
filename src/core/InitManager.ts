import { FileSystemHandler } from "./FileSystemHandler";

/**
 * Handles the initial setup of the migration system.
 * 
 * This class is responsible for performing the setup actions required
 * to initialize the configuration file and prepare the system for use.
 */
export class InitManager {
    constructor(private fsHandler: FileSystemHandler) { }

    /**
     * Executes the setup process by creating the initial configuration file.
     * 
     * This method generates the default configuration for the system and ensures
     * the config file is added to `.gitignore` to avoid committing sensitive data.
     */
    execute() {
        const config = {
            database: "[db]",
            dialect: "[dialect]",
            out: "./migrations",
            environments: {
                dev: '',
                prod: ''
            }
        }

        this.fsHandler.ensureGitIgnoreHas('migcommit.config.json');
        this.fsHandler.writeConfig('migcommit.config.json', config);

        console.log('Migcommit config initialized');
    }
}
