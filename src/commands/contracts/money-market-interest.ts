import { CLIKey } from '@terra-money/terra.js/dist/key/CLIKey';

import {
  createExecMenu,
  createQueryMenu,
  getLCDClient,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from '../../addresses/from-json';
import {
  queryInterestModelBorrowRate,
  queryInterestModelConfig,
} from '@anchor-protocol/anchor.js/dist/queries';
import * as Parse from '../../util/parse-input';
import { fabricateInterestUpdateConfig } from '@anchor-protocol/anchor.js';
import dec = Parse.dec;

const menu = createExecMenu(
  'interest',
  'Anchor Money Market Interest contract functions',
);

interface Config {
  owner?: string;
  baseRate?: string;
  interestMultiplier?: string;
}

const updateConfig = menu
  .command('update-config')
  .description('Update the configuration of the interest model contract')
  .option(
    '--owner <AccAddress>',
    'Address of contract owner that can update model parameters',
  )
  .option(
    '--base-rate <string>',
    'Minimum per-block interest rate applied to borrows',
  )
  .option(
    '--interest-multiplier <string>',
    'Multiplier between utilization ratio and per-block borrow rate',
  )
  .action(async ({ owner, baseRate, interestMultiplier }: Config) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msg = fabricateInterestUpdateConfig({
      address: userAddress,
      owner: owner,
      base_rate: dec(baseRate).toString(),
      interest_multiplier: dec(interestMultiplier).toString(),
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

const query = createQueryMenu('interest', 'Anchor Interest contract queries');

interface BorrowRate {
  marketBalance: string;
  totalLiabilities: string;
  totalReserves: string;
}

const getBorrowRate = query
  .command('borrow-rate')
  .description(
    'Get the calculated per-block borrow rate, based on fed in market conditions',
  )
  .requiredOption('--market-balance <int>', 'Stablecoin balance of Market')
  .requiredOption(
    '--total-liabilities <Dec>',
    'Total amount of borrower liabilities',
  )
  .requiredOption(
    '--total-reserves <Dec>',
    'Amount of Market contract reserves',
  )
  .action(
    async ({ marketBalance, totalLiabilities, totalReserves }: BorrowRate) => {
      const lcd = getLCDClient(query.chainId);
      const addressProvider = new AddressProviderFromJSON(
        resolveChainIDToNetworkName(query.chainId),
      );
      const queryBorrowRate = await queryInterestModelBorrowRate({
        lcd,
        market_balance: marketBalance,
        total_liabilities: totalLiabilities,
        total_reserves: totalReserves,
      })(addressProvider);
      await handleQueryCommand(query, queryBorrowRate);
    },
  );

const getConfig = query
  .command('config')
  .description('Get the interest model contract configuration')
  .action(async () => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const queryConfig = await queryInterestModelConfig({ lcd })(
      addressProvider,
    );
    await handleQueryCommand(query, queryConfig);
  });

export default {
  query,
  menu,
};
