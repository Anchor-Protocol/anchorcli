import { CLIKey } from '@terra-money/terra.js/dist/key/CLIKey';

import {
  createExecMenu,
  createQueryMenu,
  getLCDClient,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';
import {
  fabricateOverseerEpochOperations,
  fabricateOverseerLockCollateral,
  fabricateOverseerUnlockCollateral,
  fabricateOverseerUpdateConfig,
  fabricateOverseerUpdateWhitelist,
  fabricateOverseerWhitelist,
  MARKET_DENOMS,
  queryOverseerAllCollaterals,
  queryOverseerBorrowLimit,
  queryOverseerCollaterals,
  queryOverseerConfig,
  queryOverseerDistributionParams,
  queryOverseerEpochState,
  queryOverseerWhitelist,
} from '@anchor-protocol/anchor.js';
import { DistributionParams } from '@terra-money/terra.js';
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from '../../addresses/from-json';

import * as Parse from '../../util/parse-input';
import accAddress = Parse.accAddress;
import int = Parse.int;
import dec = Parse.dec;

const menu = createExecMenu(
  'overseer',
  'Anchor MoneyMarket Overseer contract functions',
);

const executeEpochOperation = menu
  .command('execute-epoch-operations')
  .description('Execute epoch operations')
  .action(async () => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msg = fabricateOverseerEpochOperations({
      address: userAddress,
      overseer: MARKET_DENOMS.UUSD,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

const lockCollateral = menu
  .command('lock-collateral')
  .description('Lock specified amount of collateral deposited')
  .requiredOption('--amount <string>', 'Amount of token')
  .action(async ({ amount }) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msg = fabricateOverseerLockCollateral({
      address: userAddress,
      market: MARKET_DENOMS.UUSD,
      amount: amount,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

const unlockCollateral = menu
  .command('unlock-collateral')
  .description('Unlock specified amount of collateral unlocked')
  .requiredOption('--amount <string>', 'Amount of token')
  .action(async ({ amount }) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msg = fabricateOverseerUnlockCollateral({
      address: userAddress,
      market: MARKET_DENOMS.UUSD,
      amount: amount,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

interface Config {
  ownerAddress?: string;
  oracleContract?: string;
  liquidationContract?: string;
  distributionThreshold?: string;
  targetDepositRate?: string;
  bufferDistributionRate?: string;
  epochPeriod?: string;
  priceTimeframe?: string;
}
const updateConfig = menu
  .command('update-config')
  .description('Update the configuration of the contract')
  .option('--owner-address <AccAddress>', 'Address of new contract owner')
  .option('--oracle-contract <AccAddress>', 'Contract address of new Oracle')
  .option(
    '--liquidation-contract <AccAddress>',
    'Contract address of new Liquidation Contract',
  )
  .option(
    '--distribution-threshold <Dec>',
    'New threshold per-block deposit rate to trigger interest buffer distribution',
  )
  .option(
    '--target-deposit-rate <Dec>',
    'New maximum per-block deposit rate before a portion of rewards are set aside as interest buffer',
  )
  .option(
    '--buffer-distribution-rate <Dec>',
    'New maximum portion of interest buffer that can be distributed in an epoch',
  )
  .option(
    '--epoch-period <int>',
    'New minimum time delay between epoch operations',
  )
  .option(
    '--price-timeframe <int>',
    'New window of time before price data is considered outdated',
  )
  .action(
    async ({
      ownerAddress,
      oracleContract,
      liquidationContract,
      distributionThreshold,
      targetDepositRate,
      bufferDistributionRate,
      epochPeriod,
      priceTimeframe,
    }: Config) => {
      const key = new CLIKey({ keyName: menu.from });
      const userAddress = key.accAddress;
      const addressProvider = new AddressProviderFromJSON(
        resolveChainIDToNetworkName(menu.chainId),
      );
      const msg = fabricateOverseerUpdateConfig({
        address: userAddress,
        overseer: MARKET_DENOMS.UUSD,
        owner_addr: ownerAddress,
        oracle_contract: oracleContract,
        liquidation_contract: liquidationContract,
        threshold_deposit_rate: dec(distributionThreshold).toString(),
        target_deposit_rate: dec(targetDepositRate).toString(),
        buffer_distribution_factor: dec(bufferDistributionRate).toString(),
        epoch_period: int(epochPeriod),
        price_timeframe: int(priceTimeframe),
      })(addressProvider);
      await handleExecCommand(menu, msg);
    },
  );

interface WhiteList {
  collateralName: string;
  symbol: string;
  collateralToken: string;
  custodyContract: string;
  ltv?: string;
}

const whiteList = menu
  .command('whitelist')
  .description('Whitelist a new collateral accepted in the money market')
  .requiredOption('--collateral-name <string>', 'Name of collateral bAsset')
  .requiredOption('--symbol <string>', 'Token symbol of collateral bAsset')
  .requiredOption(
    '--collateral-token <AccAddress>',
    'Cw20 token contract address of collateral',
  )
  .option(
    '--custody-contract <AccAddress>',
    'New Custody contract address of collateral',
  )
  .option(
    '--ltv <Dec>',
    'New maximum loan-to-value ratio allowed for collateral',
  )
  .action(
    async ({
      collateralName,
      symbol,
      collateralToken,
      custodyContract,
      ltv,
    }: WhiteList) => {
      const key = new CLIKey({ keyName: menu.from });
      const userAddress = key.accAddress;
      const addressProvider = new AddressProviderFromJSON(
        resolveChainIDToNetworkName(menu.chainId),
      );
      const msg = fabricateOverseerWhitelist({
        address: userAddress,
        name: collateralName,
        symbol: symbol,
        overseer: MARKET_DENOMS.UUSD,
        collateral_token: collateralToken,
        custody_contract: custodyContract,
        max_ltv: dec(ltv).toString(),
      })(addressProvider);
      await handleExecCommand(menu, msg);
    },
  );

interface UpdateWhiteList {
  collateralToken: string;
  custodyContract?: string;
  ltv?: string;
}

const updateWhiteList = menu
  .command('update-whitelist')
  .description('Update information for an already whitelisted collateral"')
  .requiredOption(
    '--collateral-token <AccAddress>',
    'Cw20 token contract address of collateral',
  )
  .option(
    '--custody-contract <AccAddress>',
    'New Custody contract address of collateral',
  )
  .option(
    '--ltv <Dec>',
    'New maximum loan-to-value ratio allowed for collateral',
  )
  .action(
    async ({ collateralToken, custodyContract, ltv }: UpdateWhiteList) => {
      const key = new CLIKey({ keyName: menu.from });
      const userAddress = key.accAddress;
      const addressProvider = new AddressProviderFromJSON(
        resolveChainIDToNetworkName(menu.chainId),
      );
      const msg = fabricateOverseerUpdateWhitelist({
        address: userAddress,
        overseer: MARKET_DENOMS.UUSD,
        collateral_token: accAddress(collateralToken),
        custody_contract: accAddress(custodyContract),
        max_ltv: dec(ltv).toString(),
      })(addressProvider);
      await handleExecCommand(menu, msg);
    },
  );

const query = createQueryMenu('overseer', 'Anchor overseer contract queries');

interface AllCollaterals {
  startAfter?: string;
  limit?: string;
}

const getAllCollaterals = query
  .command('all-collaterals')
  .description('Get locked collateral information for all borrowers')
  .option('--start-after <AccAddress>', 'Borrower address of start query')
  .option('--limit <int>', 'Maximum number of query entries')
  .action(async ({ startAfter, limit }: AllCollaterals) => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const queryAllCollaterals = await queryOverseerAllCollaterals({
      lcd,
      overseer: MARKET_DENOMS.UUSD,
      start_after: accAddress(startAfter),
      limit: int(limit),
    })(addressProvider);
    await handleQueryCommand(query, queryAllCollaterals);
  });

interface BorrowLimit {
  borrower: string;
  blockTime?: string;
}

const getBorrowLimit = query
  .command('borrow-limit')
  .description(
    'Get the borrow limit for the specified borrower. Fails if the oracle price is expired',
  )
  .requiredOption('--borrower <AccAddress>', 'Address of borrower')
  .option('--block-time <int>', 'Current block timestamp')
  .action(async ({ borrower, blockTime }: BorrowLimit) => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const queryBorrowLimit = await queryOverseerBorrowLimit({
      lcd,
      overseer: MARKET_DENOMS.UUSD,
      borrower: accAddress(borrower),
      block_time: int(blockTime),
    })(addressProvider);
    await handleQueryCommand(query, queryBorrowLimit);
  });

interface Collaterals {
  borrower: string;
}

const getCollaterals = query
  .command('collaterals')
  .description('Get locked collateral information for the specified borrower')
  .requiredOption('--borrower <AccAddress>', 'Address of borrower')
  .action(async ({ borrower }: Collaterals) => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const queryCollaterals = await queryOverseerCollaterals({
      lcd,
      overseer: MARKET_DENOMS.UUSD,
      borrower: accAddress(borrower),
    })(addressProvider);
    await handleQueryCommand(query, queryCollaterals);
  });

const getConfig = query
  .command('config')
  .description('Get the configuration of the Overseer contract')
  .action(async () => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const queryConfig = await queryOverseerConfig({
      lcd,
      overseer: MARKET_DENOMS.UUSD,
    })(addressProvider);
    await handleQueryCommand(query, queryConfig);
  });

const getDistributionParams = query
  .command('distribution-params')
  .description('Get parameter information related to reward distribution')
  .action(async () => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const queryDistributionParams = await queryOverseerDistributionParams({
      lcd,
      overseer: MARKET_DENOMS.UUSD,
    })(addressProvider);
    await handleQueryCommand(query, queryDistributionParams);
  });

const getEpochState = query
  .command('epoch-state')
  .description('Get information related to the current epoch')
  .action(async () => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const queryEpochState = await queryOverseerEpochState({
      lcd,
      market: MARKET_DENOMS.UUSD,
    })(addressProvider);
    await handleQueryCommand(query, queryEpochState);
  });

interface QueryWhitelist {
  collateralToken?: string;
  startAfter?: string;
  limit?: string;
}

const getWhitelist = query
  .command('whitelist')
  .description(
    'Get information about the specified collateral if the collateral_token field is filled. Gets information about all collaterals if the collateral_token field is not filled',
  )
  .option(
    '--collateral-token <AccAddress>',
    'Cw20 Token address of collateral to query information',
  )
  .option(
    '--start-after <AccAddress>',
    'Collateral Cw20 Token address to start query',
  )
  .option('--limit <int>', 'Maximum number of query entries')
  .action(async ({ collateralToken, startAfter, limit }: QueryWhitelist) => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const queryWhitelist = await queryOverseerWhitelist({
      lcd,
      market: MARKET_DENOMS.UUSD,
      collateral_token: accAddress(collateralToken),
      start_after: accAddress(startAfter),
      limit: int(limit),
    })(addressProvider);
    await handleQueryCommand(query, queryWhitelist);
  });

export default {
  query,
  menu,
};
