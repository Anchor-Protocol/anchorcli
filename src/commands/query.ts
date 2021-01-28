import { Command } from 'commander';
import * as contracts from './contracts';
import * as _ from 'lodash';

export const command = new Command('query');

// short form
command.alias('q');
command.description('Run a smart contract query function');

_.each(contracts.anchor, (contract) => {
  command.addCommand(contract.query);
});

export default command;
