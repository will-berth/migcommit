import { Command } from "commander";

export function pushCommand(program: Command) {
    program
        .command('push')
        .description('Command for apply changes in database')
        .action((str, options) => {
            // logic to push
        })
}