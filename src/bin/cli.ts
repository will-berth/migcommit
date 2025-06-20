#!/usr/bin/env node

import { Command } from "commander";
import { initCommand } from "./commands/init";
import { pushCommand } from "./commands/push";
import { pullCommand } from "./commands/pull";

const program = new Command('migcommit');

initCommand(program);
pushCommand(program);
pullCommand(program);

program.parse()