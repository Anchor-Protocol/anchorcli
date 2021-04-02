import { CLIKey } from '@terra-money/terra.js/dist/key/CLIKey';

import {
  createExecMenu,
  createQueryMenu,
  getLCDClient,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';
import {
  fabricateOracleUpdateConfig,
  fabricateOracleFeedPrice,
  queryOracleConfig,
  queryOraclePrice,
  queryOraclePrices,
  Pair,
} from '@anchor-protocol/anchor.js';
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from '../../addresses/from-json';

import * as Parse from '../../util/parse-input';
import int = Parse.int;

const menu = createExecMenu(
  'oracle',
  'Anchor Money Market Liquidation contract functions',
);

interface FeedPrice {
  prices: [Pair];
}

const feedPrice = menu
  .command('feed-price')
  .description('Feeds new price data')
  .requiredOption('--prices <json>', 'Vector of assets and their prices')
  .action(async ({ prices }: FeedPrice) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msg = fabricateOracleFeedPrice({
      address: userAddress,
      prices: prices,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

interface Config {
  owner?: string;
}
const updateConfig = menu
  .command('update-config')
  .description('Updates the configuration of the contract')
  .option('--owner <AccAddress>', 'Address of new owner')
  .action(async ({ owner }: Config) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msg = fabricateOracleUpdateConfig({
      address: userAddress,
      owner: owner,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

const query = createQueryMenu('oracle', 'Anchor Oracle contract queries');

const getConfig = query
  .command('config')
  .description('Get the Oracle contract configuration')
  .action(async () => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const queryConfig = await queryOracleConfig({
      lcd,
    })(addressProvider);
    await handleQueryCommand(query, queryConfig);
  });

interface QueryPrice {
  base: string;
  quote: string;
}

const getPrice = query
  .command('price')
  .description(
    'Get price information for the specified base asset denominated in the quote asset',
  )
  .requiredOption('--base <String>', 'Asset for which to get price')
  .requiredOption(
    '--quote <String>',
    'Asset in which calculated price will be denominated',
  )
  .action(async ({ base, quote }: QueryPrice) => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const queryPrice = await queryOraclePrice({
      lcd,
      base,
      quote,
    })(addressProvider);
    await handleQueryCommand(query, queryPrice);
  });

interface Prices {
  startAfter?: string;
  limit?: string;
}

const getPrices = query
  .command('prices')
  .description('Get price information for all assets')
  .option('--start-after <String>', 'Asset to start query')
  .option('--limit <int>', 'Maximum number of query entries')
  .action(async ({ startAfter, limit }: Prices) => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const queryPrices = await queryOraclePrices({
      lcd,
      start_after: startAfter,
      limit: int(limit),
    })(addressProvider);
    await handleQueryCommand(query, queryPrices);
  });

export default {
  query,
  menu,
};
