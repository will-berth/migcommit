import { Command } from "commander";

export function pullCommand(program: Command) {
    program
        .command('pull')
        .description('Command for get remote changes in any database')
        .action((str, options) => {
            // logic to pull
        })
}