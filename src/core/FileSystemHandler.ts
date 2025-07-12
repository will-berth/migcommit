import fs from 'fs';

/**
 * File system handler utility.
 * 
 * This class provides helper methods to interact with the file system,
 * including reading and writing configuration files, creating directories,
 * and managing migration-related files.
 */
export class FileSystemHandler {

    /**
     * Ensures that a given entry exists in the `.gitignore` file.
     * If it doesn't exist, the entry is appended to the file.
     * 
     * @param entry The value to ensure is present in `.gitignore`.
     */
    ensureGitIgnoreHas(entry: string) {
        const path = '.gitignore';
        if (fs.existsSync(path)) {
            const current = fs.readFileSync(path, 'utf-8');
            if (!current.includes(entry)) {
                fs.appendFileSync(path, `\n${entry}`);
            }
        } else {
            fs.writeFileSync(path, `${entry}\n`);
        }
    }

    /**
     * Writes or overwrites the migcommit configuration file.
     * 
     * @param path The path to the config file.
     * @param config The configuration object to write.
     */
    writeConfig(path: string, config: object) {
        fs.writeFileSync(path, JSON.stringify(config, null, 2));
    }

    /**
     * Reads a JSON file and parses its content.
     * 
     * @param path The path to the JSON file.
     * @returns The parsed object.
     */
    readJson(path: string){
        const json = fs.readFileSync(path, 'utf-8');
        return JSON.parse(json);
    }

    /**
     * Creates a new JSON file with the provided data.
     * 
     * @param path The path where the JSON file will be created.
     * @param data The object to serialize and write.
     */
    createJson(path: string, data: object) {
        fs.writeFileSync(path, JSON.stringify(data, null, 2));
    }

    /**
     * Writes a new migration SQL file.
     * 
     * @param path The path where the migration file will be created.
     * @param data The content to write into the migration file.
     */
    writeNewMigration(path: string, data: string){
        fs.writeFileSync(path, data);
    }

    /**
     * Checks if a path exists in the file system.
     * 
     * @param path The file or directory path to check.
     * @returns `true` if the path exists, `false` otherwise.
     */
    exist(path: string){
        return fs.existsSync(path)
    }

    /**
     * Creates a new directory at the specified path.
     * 
     * @param path The directory path to create.
     */
    buildDir(path: string){
        fs.mkdirSync(path);
    }

    /**
     * Reads the contents of a directory and returns a list of `.sql` files.
     * 
     * @param path The directory path to read.
     * @returns An array of file names ending with `.sql` in the specified directory.
     * @throws If the directory does not exist.
     */
    readDir(path: string): string[] {
        if (!this.exist(path)) {
            throw new Error(`Directory does not exist: ${path}`);
        }
        return fs.readdirSync(path).filter(file => file.endsWith('.sql'));
    }

    /**
     * Reads the contents of a file as a UTF-8 string.
     * 
     * @param path The file path to read.
     * @returns The file contents as a string.
     * @throws If the file does not exist.
     */
    readFile(path: string): string {
        if (!this.exist(path)) {
            throw new Error(`File does not exist: ${path}`);
        }
        return fs.readFileSync(path, 'utf-8');
    }
}