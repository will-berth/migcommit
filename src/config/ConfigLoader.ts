import { FileSystemHandler } from '../core/FileSystemHandler';

type Dialects = 'postgres' | 'mysql'

interface Config{
    dialect: Dialects
    out: string
    environments: {
        [key: string]: string;
    }
}

/**
 * Loads and validates the migcommit configuration file.
 * 
 * This class is responsible for reading and verifying the structure
 * of the configuration file required to perform database migrations.
 */
export class ConfigLoader {

    /**
     * Creates a new instance of ConfigLoader.
     * 
     * @param fsHandler File system handler instance.
     * @param env Target environment to validate (default is 'dev').
     * @param path Path to the migcommit configuration file.
     */
    constructor(
        private fsHandler: FileSystemHandler,
        private env: string = 'dev',
        private path: string = 'migcommit.config.json',
    ){}
    
    /**
     * Reads and returns the migcommit configuration object.
     * 
     * This method parses the configuration file and verifies
     * that all required properties are valid.
     * 
     * @returns A valid configuration object.
     * @throws Error if the file is unreadable or invalid.
     */
    getConfig(): Config {
        try{
            const config = this.fsHandler.readJson(this.path)
            this.verifyProperties(config);
            return config;
        } catch(err: any) {
            throw new Error(`ERROR IN READ CONFIG FILE: ${err.message}`);
        }
    }

    /**
     * Validates the required properties in the configuration object.
     * 
     * This method checks that the configuration contains the expected
     * structure and values required to operate properly.
     * 
     * @param config The configuration object to validate.
     * @throws Error if required fields are missing or invalid.
     */
    verifyProperties(config: any) {
        const dialectsAvailables: Dialects[] = ['postgres']

        if (!config || typeof config !== 'object') {
            throw new Error('Config must be a valid JSON object');
        }

        const { dialect, out, environments } = config;

        if(!dialectsAvailables.includes(dialect)) throw new Error('dialect config is required with only: postgres, mysql')
    
        if (!out || typeof out !== 'string') throw new Error('Invalid or missing "out" path');

        if (!environments || typeof environments !== 'object') throw new Error('Invalid or missing "environments"');
        
        if (!environments[this.env] || environments[this.env] === '') throw new Error('At the moment the environment is using dev but this isnt configured');
    }
}