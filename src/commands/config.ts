import { Command } from 'commander';
import { config, saveContractAddresses } from '../util/config';
import * as dotProp from 'dot-prop';
import { AnchorConfig } from '../addresses/types';

export const command = new Command('config');

// short form
command.alias('c');
command.description('Access configuration settings');

const set = command.command('set <path> <value>');
set
  .description(`Sets the configuration for`, {
    path: `(string) config parameter path eg. 'lcd.chainId'`,
    value: '(JSON) value to set',
  })
  .option('--chain-id', 'chain id for changes');
set.action((path: string, value: string, chainId: string) => {
  saveContractAddresses(
    dotProp.set<AnchorConfig>(config, path, JSON.parse(value)),
    chainId,
  );
});

export default command;
