import { CLIKey } from '@terra-money/terra.js/dist/key/CLIKey';
import {
  createExecMenu,
  createQueryMenu,
  getLCDClient,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';
import {
  fabricatebEthClaimRewards,
  querybEthRewardConfig,
  querybEthRewardHolder,
  querybEthRewardHolders,
  querybEthRewardState,
  querybEthRewardAccrued,
} from '@anchor-protocol/anchor.js';
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from '../../addresses/from-json';

import * as Parse from '../../util/parse-input';
import accAddress = Parse.accAddress;
import int = Parse.int;

const menu = createExecMenu(
  'beth-reward',
  'Anchor bEth reward contract functions',
);

interface Claim {
  recipient: string;
}
const claim = menu
  .command('claim-rewards')
  .description("Claims bEth holder's accrued rewards")
  .option('--recipient <AccAddress>', 'Address of the receiver')
  .action(async ({ recipient }: Claim) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msg = fabricatebEthClaimRewards({
      address: userAddress,
      recipient: accAddress(recipient),
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

const query = createQueryMenu(
  'beth-reward',
  'Anchor bEth reward contract queries',
);

const getConfig = query
  .command('config')
  .description('Get the contract configuration of bEth Reward')
  .action(async () => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const config_query = await querybEthRewardConfig({ lcd: lcd })(
      addressProvider,
    );
    await handleQueryCommand(query, config_query);
  });

const getState = query
  .command('state')
  .description('Get information about the current state')
  .action(async () => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const config_query = await querybEthRewardState({ lcd: lcd })(
      addressProvider,
    );
    await handleQueryCommand(query, config_query);
  });

interface AccruedRewards {
  address: string;
}

const getAccruedRewards = query
  .command('accrued-rewards')
  .description('Get the amount of rewards accrued to the specified bEth holder')
  .requiredOption('--address <AccAddress>', 'Address of user')
  .action(async ({ address }: AccruedRewards) => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const batch_query = await querybEthRewardAccrued({
      lcd: lcd,
      address: accAddress(address),
    })(addressProvider);
    await handleQueryCommand(query, batch_query);
  });

const getHolder = query
  .command('holder')
  .description('Get information about the specified bEth holder')
  .requiredOption('--address <AccAddress>', 'Address of user')
  .action(async ({ address }: AccruedRewards) => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const batch_query = await querybEthRewardHolder({
      lcd: lcd,
      address: accAddress(address),
    })(addressProvider);
    await handleQueryCommand(query, batch_query);
  });

interface AllHistory {
  startAfter?: string;
  limit?: string;
}

const getHolders = query
  .command('holders')
  .description('Get information about all bEth holders')
  .option('--start-after <int>', 'Address of bEth holder to start query')
  .option('--limit <int>', 'Maximum number of query entries')
  .action(async ({ startAfter, limit }: AllHistory) => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const batch_query = await querybEthRewardHolders({
      lcd: lcd,
      start_after: accAddress(startAfter),
      limit: int(limit),
    })(addressProvider);
    await handleQueryCommand(query, batch_query);
  });

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  query,
  menu,
};
