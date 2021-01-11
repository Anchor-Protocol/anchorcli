import { Command } from "commander";
import * as contracts from "./contracts";
import * as _ from "lodash";

export const command = new Command("exec");

// short form
command.alias("x");
command.description("Execute a function on a smart contract");

_.each(contracts.anchor, (contract) => {
  command.addCommand(contract.menu);
});

export default command;
