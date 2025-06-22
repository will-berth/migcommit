#!/usr/bin/env node

import { Command, Option } from "commander";
import { initCommand } from "./commands/init";
import { pushCommand } from "./commands/push";
import { pullCommand } from "./commands/pull";
import { commitCommand } from "./commands/commit";

const program = new Command('migcommit');
const option = new Option('--env <environment>', 'Set database environment')
option.default('dev', 'Use dev environment as default value.')

initCommand(program);
pushCommand(program);
pullCommand(program);
commitCommand(program, option);

program.parse()