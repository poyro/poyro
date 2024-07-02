#!/usr/bin/env node

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import * as init from "./commands/init";

void yargs(hideBin(process.argv))
  .command(init.command, init.desc, init.builder, init.handler)
  .strictCommands()
  .demandCommand(1)
  .help()
  .parse();
