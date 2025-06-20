import { Command } from "commander";
import fs from "fs";

export function initCommand(program: Command) {
    program
        .command('init')
        .description('Init create to initial config project')
        .action((str, options) => {
            try{
                const existGitIgnore = fs.existsSync('.gitignore');

                if(existGitIgnore){
                    fs.appendFileSync('.gitignore', '\nmigcommit.config.json')
                }else{
                    fs.writeFileSync('.gitignore', '\nmigcommit.config.json')
                }
                const initConfig = {
                    database: "[db]",
                    dialect: "[dialect]",
                    out: "./migrations",
                    enviroments: {}
                }
                fs.writeFileSync("migcommit.config.json", JSON.stringify(initConfig, null, 2))
                console.log('Migcommit config initialized');
            } catch (err){
                console.log(err)
            }
        })
}