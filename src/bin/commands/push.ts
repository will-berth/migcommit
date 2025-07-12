import { Command } from "commander";
import { ConfigLoader } from "../../config/ConfigLoader";
import { FileSystemHandler } from "../../core/FileSystemHandler";
import { Migrator } from "../../core/Migrator";

export function pushCommand(program: Command) {
    program
        .command('push')
        .description('Command for apply changes in database')
        .action((str, options) => {
            const configLoader = new ConfigLoader(new FileSystemHandler(), options.env)
            const migratior = new Migrator(configLoader, options.env);
            migratior.push();
        })
}