import { Command } from "commander";
import { ConfigLoader } from "../../config/ConfigLoader";
import { Migrator } from "../../core/Migrator";
import { FileSystemHandler } from "../../core/FileSystemHandler";

export function initCommand(program: Command) {
    program
        .command('init')
        .description('Init create to initial config project')
        .action((str, options) => {
            try{
                const configLoader = new ConfigLoader( new FileSystemHandler())
                const migrator = new Migrator(configLoader)
                migrator.init()
            } catch (err){
                console.log(err)
            }
        })
}