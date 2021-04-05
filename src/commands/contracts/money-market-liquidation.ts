import { CLIKey } from '@terra-money/terra.js/dist/key/CLIKey';
import {
  createExecMenu,
  createQueryMenu,
  getLCDClient,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';
import { Coin } from '@terra-money/terra.js';
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from '../../addresses/from-json';
import * as Parse from '../../util/parse-input';
import {
  fabricateLiquidationRetractBid,
  fabricateLiquidationSubmitBid,
  fabricateLiquidationUpdateConfig,
  MARKET_DENOMS,
  queryLiquidationBid,
  queryLiquidationBidsByCollateral,
  queryLiquidationBidsByUser,
  queryLiquidationConfig,
  queryLiquidationLiquidationAmount,
} from '@anchor-protocol/anchor.js';
import accAddress = Parse.accAddress;
import int = Parse.int;
import dec = Parse.dec;

const menu = createExecMenu(
  'liquidation',
  'Anchor Money Market Liquidation contract functions',
);

interface RetractBid {
  collateralToken: string;
  amount?: string;
}
const liquidationRetractBid = menu
  .command('retract-bid')
  .description('Withdraw specified amount of stablecoins from the bid ')
  .requiredOption(
    '--collateral-token <AccAddress>',
    'Cw20 token contract address of bidding collateral',
  )
  .option('--amount <string>', 'Amount of stablecoins remove from bid')
  .action(async ({ collateralToken, amount }: RetractBid) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msg = fabricateLiquidationRetractBid({
      address: userAddress,
      collateral_token: accAddress(collateralToken),
      amount: amount,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

interface RetractBid {
  collateralToken: string;
  premiumRate: string;
  coin: string;
}
const liquidationSubmitBid = menu
  .command('submit-bid')
  .description('Submit a new bid for the specified Cw20 collateral')
  .requiredOption(
    '--collateral-token <AccAddress>',
    'Cw20 token contract address of bidding collateral',
  )
  .requiredOption(
    '--premium-rate <Dec>',
    'Rate of commission on executing this bid',
  )
  .requiredOption(
    '--coin <coin>',
    'Stablecoins for submitting bid,  e.g. 1000uusd',
  )
  .action(async ({ collateralToken, premiumRate, coin }: RetractBid) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const bidCoin = Coin.fromString(coin);
    if (bidCoin.denom !== 'uusd') {
      throw new Error(`invalid coin '${bidCoin.denom}', MUST be uusd`);
    }
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msg = fabricateLiquidationSubmitBid({
      address: userAddress,
      collateral_token: accAddress(collateralToken),
      premium_rate: dec(premiumRate).toString(),
      amount: bidCoin.amount.toString(),
      denom: MARKET_DENOMS.UUSD,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

interface UpdateConfig {
  owner?: string;
  oracleContract?: string;
  stableDenom?: string;
  safeRatio?: string;
  bidFee?: string;
  maxPremiumRate?: string;
  liquidationThreshold?: string;
  priceTimeframe: string;
}
const liquidationUpdateConfig = menu
  .command('update-config')
  .description("Update the Liquidation Contract's configuration")
  .option('--owner <AccAddress>', 'Address of new owner')
  .option('--oracle-contract <string>', 'New oracle contract address')
  .option('--stable-denom <string>', 'New native token denomination for bids')
  .option(
    '--safe-ratio <Dec>',
    'New liability / borrow limit of a loan deemed safe',
  )
  .option('--bid-fee <Dec>', 'New fee rate applied to executed bids')
  .option(
    '--max-premium-rate <Dec>',
    'New maximum rate of commission given to the bidder of  an executed bid',
  )
  .option(
    '--liquidation-threshold, <int>',
    'New threshold collateral value for triggering partial collateral liquidations',
  )
  .option(
    '--price-timeframe <int>',
    'New window of time before price data is considered outdated',
  )
  .action(
    async ({
      owner,
      oracleContract,
      stableDenom,
      safeRatio,
      bidFee,
      maxPremiumRate,
      liquidationThreshold,
      priceTimeframe,
    }: UpdateConfig) => {
      const key = new CLIKey({ keyName: menu.from });
      const userAddress = key.accAddress;
      const addressProvider = new AddressProviderFromJSON(
        resolveChainIDToNetworkName(menu.chainId),
      );
      const msg = fabricateLiquidationUpdateConfig({
        address: userAddress,
        owner: accAddress(owner),
        oracle_contract: accAddress(oracleContract),
        stable_denom: stableDenom,
        safe_ratio: dec(safeRatio).toString(),
        bid_fee: dec(bidFee).toString(),
        max_premium_rate: dec(maxPremiumRate).toString(),
        liquidation_threshold: dec(liquidationThreshold).toString(),
        price_timeframe: int(priceTimeframe),
      })(addressProvider);
      await handleExecCommand(menu, msg);
    },
  );

const query = createQueryMenu(
  'liquidation',
  'Anchor Liquidation contract queries',
);

interface Bid {
  collateralToken: string;
  bidder: string;
}

const getBid = query
  .command('bid')
  .description(
    "Get information about the specifed bidder's bid for the specified collateral",
  )
  .requiredOption(
    '--collateral-token <AccAddress>',
    'Token contract address of bidding collateral',
  )
  .requiredOption('--bidder <AccAddress>', 'Address of bidder')
  .action(async ({ collateralToken, bidder }: Bid) => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const queryBid = await queryLiquidationBid({
      lcd,
      collateral_token: accAddress(collateralToken),
      bidder: accAddress(bidder),
    })(addressProvider);
    await handleQueryCommand(query, queryBid);
  });

interface BidsByUser {
  bidder: string;
  startAfter?: string;
  limit?: string;
}

const getBidsByUser = query
  .command('bids-by-user')
  .description('Get information for all bids submitted by the specified bidder')
  .requiredOption('--bidder <AccAddress>', 'Address of bidder')
  .option(
    '--start-after <AccAddress>',
    'Token contract address of collateral to start query',
  )
  .option('--limit <int>', 'Maximum number of query entries')
  .action(async ({ bidder, startAfter, limit }: BidsByUser) => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const queryBidsByUser = await queryLiquidationBidsByUser({
      lcd,
      bidder: accAddress(bidder),
      start_after: accAddress(startAfter),
      limit: int(limit),
    })(addressProvider);
    await handleQueryCommand(query, queryBidsByUser);
  });

interface BidsByCollateral {
  collateralToken: string;
  startAfter?: string;
  limit?: string;
}

const getBidsByCollateral = query
  .command('bids-by-collateral')
  .description(
    'Get bid information for all bids submitted for the specified collateral',
  )
  .requiredOption(
    '--collateral-token <AccAddress>',
    'Token contract address of collateral',
  )
  .option(
    '--start-after <AccAddress>',
    'Token contract address of collateral to start query',
  )
  .option('--limit <int>', 'Maximum number of query entries')
  .action(async ({ collateralToken, startAfter, limit }: BidsByCollateral) => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const queryBidsByCollateral = await queryLiquidationBidsByCollateral({
      lcd,
      collateral_token: accAddress(collateralToken),
      start_after: accAddress(startAfter),
      limit: int(limit),
    })(addressProvider);
    await handleQueryCommand(query, queryBidsByCollateral);
  });

const getConfig = query
  .command('config')
  .description("Get the Liquidation Contract's configuration")
  .action(async () => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const queryConfig = await queryLiquidationConfig({
      lcd,
    })(addressProvider);
    await handleQueryCommand(query, queryConfig);
  });

interface LiquidationAmount {
  borrowAmount: string;
  borrowLimit: string;
  collaterals: string;
  collateralPrices: string;
}

//TODO FIX TOKENSHUMAN
const getLiquidationAmount = query
  .command('liquidation-amount')
  .description(
    "Get the amount of collaterals that needs to be liquidated in order for the borrower's loan to reach safe_ratio, based on the fed in borrower's status",
  )
  .requiredOption('--borrow-amount <int>', 'Liability of borrower')
  .requiredOption('--borrow-limit <int>', 'Borrow limit of borrower')
  .requiredOption('--collaterals <json>', 'Held collaterals and locked amounts')
  .requiredOption('--collateral-prices <json>', 'Vector of collateral prices')
  .action(
    async ({
      borrowAmount,
      borrowLimit,
      collaterals,
      collateralPrices,
    }: LiquidationAmount) => {
      const lcd = getLCDClient(query.chainId);
      const addressProvider = new AddressProviderFromJSON(
        resolveChainIDToNetworkName(query.chainId),
      );
      const queryLiquidationAmount = await queryLiquidationLiquidationAmount({
        lcd,
        borrow_amount: borrowAmount,
        borrow_limit: borrowLimit,
        collaterals: JSON.parse(collaterals) as Array<[string, string]>,
        collateral_prices: JSON.parse(collateralPrices) as [string],
      })(addressProvider);
      await handleQueryCommand(query, queryLiquidationAmount);
    },
  );

export default {
  query,
  menu,
};
