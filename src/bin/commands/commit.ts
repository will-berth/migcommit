import { Command, Option } from "commander";
import { ConfigLoader } from "../../config/ConfigLoader";
import { Migrator } from "../../core/Migrator";
import { FileSystemHandler } from "../../core/FileSystemHandler";

export function commitCommand(program: Command, option: Option) {
    program
        .command('commit')
        .argument('name')
        .addOption(option)
        .description('Command for create new migration')
        .action((name, options) => {
            const configLoader = new ConfigLoader(new FileSystemHandler(), options.env)
            const migratior = new Migrator(configLoader, options.env);
            migratior.commit(name)
        })
}