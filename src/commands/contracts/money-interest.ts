import { CLIKey } from '@terra-money/terra.js/dist/key/CLIKey';

import {
  createExecMenu,
  createQueryMenu,
  getLCDClient,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';
import { Dec } from '@terra-money/terra.js';
import { fabricatebInterestConfig } from '../../anchor-js/fabricators/money-market/interest-update-config';
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from '../../addresses/from-json';
import {
  queryInterestModelBorrowRate,
  queryInterestModelConfig,
} from '../../anchor-js/queries';
import { Parse } from '../../util/parse-input';
import accAddress = Parse.accAddress;

const menu = createExecMenu(
  'interest',
  'Anchor MoneyMarket Interest contract functions',
);

interface Config {
  owner?: string;
  baseRate?: Dec;
  interestMultiplier?: Dec;
}

const updateConfig = menu
  .command('update-config')
  .description('Updates the configuration of the interest model contract')
  .option(
    '--owner <AccAddress>',
    'Address of contract owner that can update model parameters',
  )
  .option(
    '--base-rate <Dec>',
    'Minimum per-block interest rate applied to borrows',
  )
  .option(
    'interest-multiplier <Dec>',
    'Multiplier between utilization ratio and per-block borrow rate',
  )
  .action(async ({ owner, baseRate, interestMultiplier }: Config) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msg = fabricatebInterestConfig({
      address: userAddress,
      owner: owner,
      base_rate: baseRate,
      interest_multiplier: interestMultiplier,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

const query = createQueryMenu('interest', 'Anchor interest contract queries');

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
      const lcd = getLCDClient();
      const addressProvider = new AddressProviderFromJSON(
        resolveChainIDToNetworkName(query.chainId),
      );
      const queryBorrowRate = await queryInterestModelBorrowRate({
        lcd,
        marketBalance,
        totalLiabilities,
        totalReserves,
      })(addressProvider);
      await handleQueryCommand(query, queryBorrowRate);
    },
  );

const getConfig = query
  .command('config')
  .description('Get the interest model contract configuration')
  .action(async ({}: Config) => {
    const lcd = getLCDClient();
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
