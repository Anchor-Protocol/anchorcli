import { CLIKey } from '@terra-money/terra.js/dist/key/CLIKey';

import {
  createExecMenu,
  createQueryMenu,
  getLCDClient,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';
import {
  fabricateMarketBorrow,
  fabricateMarketDepositStableCoin,
  fabricateMarketRedeemStable,
  fabricateMarketRepay,
  fabricateMarketUpdateConfig,
  MARKET_DENOMS,
  queryMarketBorrowerInfo,
  queryMarketBorrowerInfos,
  queryMarketConfig,
  queryMarketEpochState,
  queryMarketState,
} from '@anchor-protocol/anchor.js';
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from '../../addresses/from-json';
import * as Parse from '../../util/parse-input';
import accAddress = Parse.accAddress;
import int = Parse.int;

const menu = createExecMenu(
  'market',
  'Anchor MoneyMarket Market contract functions',
);

interface BorrowStable {
  amount: string;
  to?: string;
}
const borrowStable = menu
  .command('borrow-stable')
  .description('Borrow stable coins from Anchor')
  .requiredOption('--amount <string>', 'Amount of stablecoins to borrow')
  .option('--to <string>', 'Withdrawal address for borrowed stablecoins')
  .action(async ({ amount, to }: BorrowStable) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msg = fabricateMarketBorrow({
      address: userAddress,
      market: MARKET_DENOMS.UUSD,
      amount: amount,
      to: to,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

const depositStable = menu
  .command('deposit-stable')
  .description('Deposits stable coins to Anchor')
  .requiredOption('--amount <string>', 'Amount of stable coins to borrow')
  .action(async () => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msg = fabricateMarketDepositStableCoin({
      address: userAddress,
      market: MARKET_DENOMS.UUSD,
      amount: depositStable.amount,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

const redeemStable = menu
  .command('redeem-stable')
  .description('Redeems aTokens to their underlying stable coins')
  .requiredOption('--amount <string>', 'Amount for redeem')
  .action(async ({ amount }) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msg = fabricateMarketRedeemStable({
      address: userAddress,
      market: MARKET_DENOMS.UUSD,
      amount: amount,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

const repay = menu
  .command('repay-stable')
  .description('Repay previous stable coin liability')
  .requiredOption('--amount <string>', 'Amount stable coin to send beforehand')
  .action(async ({ amount }) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msg = fabricateMarketRepay({
      address: userAddress,
      market: MARKET_DENOMS.UUSD,
      amount: amount,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

interface Config {
  ownerAddress?: string;
  interestModel?: string;
  reserveFactor?: string;
  distributionModel?: string;
  maxBorrowFactor?: string;
}

const updateConfig = menu
  .command('update-config')
  .description('Update the configuration of the contract')
  .option('--owner-address <AccAddress>', 'Address of new owner')
  .option(
    '--reserve-factor <Dec>',
    'New portion of borrower interest set aside as reserves',
  )
  .option('--interest-model <string>', 'New interest model contract address')
  .option(
    'distribution-model <AccAddress>',
    'New contract address of Distribution Model',
  )
  .option(
    'max_borrow_factor <Dec>',
    'New maximum portion of stablecoin liquidity available for borrows',
  )
  .action(
    async ({
      ownerAddress,
      interestModel,
      reserveFactor,
      distributionModel,
      maxBorrowFactor,
    }: Config) => {
      const key = new CLIKey({ keyName: menu.from });
      const userAddress = key.accAddress;
      const addressProvider = new AddressProviderFromJSON(
        resolveChainIDToNetworkName(menu.chainId),
      );
      const msg = fabricateMarketUpdateConfig({
        address: userAddress,
        owner_addr: ownerAddress,
        interest_model: interestModel,
        distribution_model: distributionModel,
        reserve_factor: reserveFactor,
        max_borrow_factor: maxBorrowFactor,
        market: MARKET_DENOMS.UUSD,
      })(addressProvider);
      await handleExecCommand(menu, msg);
    },
  );

const query = createQueryMenu('market', 'Anchor market contract queries');

const getConfig = query
  .command('config')
  .description('Get the Market contract configuration')
  .action(async () => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const queryConfig = await queryMarketConfig({
      lcd,
      market: MARKET_DENOMS.UUSD,
    })(addressProvider);
    await handleQueryCommand(query, queryConfig);
  });

const getEpochState = query
  .command('epoch-state')
  .description(
    'Get state information related to epoch operations. Returns the interest-accrued block_height field is filled. Returns the stored (no interest accrued) state if not filled',
  )
  .action(async () => {
    const lcd = getLCDClient(query.chainId);
    const { block } = await lcd.tendermint.blockInfo();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const queryEpochState = await queryMarketEpochState({
      lcd,
      market: MARKET_DENOMS.UUSD,
      block_height: int(block.header.height),
    })(addressProvider);
    await handleQueryCommand(query, queryEpochState);
  });

interface Liabilities {
  startAfter?: string;
  limit?: string;
}

const getLiabilities = query
  .command('liabilities')
  .description('Get liability information for all borrowers')
  .option('--start-after <AccAddress>', 'Borrower address to start query')
  .option('--limit <int>', 'Maximum number of entries to query')
  .action(async ({ startAfter, limit }: Liabilities) => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const queryLiabilities = await queryMarketBorrowerInfos({
      lcd,
      market: MARKET_DENOMS.UUSD,
      start_after: accAddress(startAfter),
      limit: int(limit),
    })(addressProvider);
    await handleQueryCommand(query, queryLiabilities);
  });

interface Liability {
  borrower: string;
}

const getLiability = query
  .command('liability')
  .description(
    'Get liability information for the specified borrower for the current block height',
  )
  .requiredOption('--borrower <AccAddress>', 'Address of borrower')
  .action(async ({ borrower }: Liability) => {
    const lcd = getLCDClient(query.chainId);
    const { block } = await lcd.tendermint.blockInfo();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const queryLiability = await queryMarketBorrowerInfo({
      lcd,
      market: MARKET_DENOMS.UUSD,
      borrower: accAddress(borrower),
      block_height: +block.header.height,
    })(addressProvider);
    await handleQueryCommand(query, queryLiability);
  });

const getState = query
  .command('state')
  .description(
    'Get information related to the overall state of Market for the current block height',
  )
  .action(async () => {
    const lcd = getLCDClient(query.chainId);
    const { block } = await lcd.tendermint.blockInfo();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const queryState = await queryMarketState({
      lcd,
      market: MARKET_DENOMS.UUSD,
      block_height: +block.header.height,
    })(addressProvider);
    await handleQueryCommand(query, queryState);
  });

export default {
  query,
  menu,
};
