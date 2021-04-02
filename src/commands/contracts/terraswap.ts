import {
  createExecMenu,
  createQueryMenu,
  getLCDClient,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';
import {
  fabricateTerraswapSwapbLuna,
  fabricateTerraswapSwapLuna,
  fabricateTerraswapProvideLiquidityANC,
  fabricateTerraswapProvideLiquiditybLuna,
  fabricateTerraswapSwapANC,
  fabricateTerraswapSwapUSTANC,
  fabricateTerraswapWithdrawLiquidityANC,
  fabricateTerraswapWithdrawLiquiditybLuna,
} from '@anchor-protocol/anchor.js';
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from '../../addresses/from-json';
import { CLIKey } from '@terra-money/terra.js/dist/key/CLIKey';
import * as Parse from '../../util/parse-input';
import { queryTerraswapPool } from '@anchor-protocol/anchor.js/dist/queries/terraswap/pool';
import { queryTerrasawpPair } from '@anchor-protocol/anchor.js/dist/queries/terraswap/pairs';

const menu = createExecMenu(
  'terraswap',
  'terraswap, anchor related contract functions',
);

type Expire = { at_height: number } | { at_time: number } | { never: {} };

interface provideLiquidityArgs {
  tokenAmount: string;
  nativeAmount: string;
  slippageTolerance?: string;
  quote: string;
  expiryHeight?: string;
  expiryTime?: string;
  expiryNever?: string;
}

const provideLiquiditybLuna = menu
  .command('provide-liquidity-bluna')
  .description('Provide liquidity to a Terraswap pool')
  .requiredOption(
    '--token-amount <string>',
    'first side of liquidity pool (bLuna) e.g. 1000',
  )
  .requiredOption(
    '--native-amount <string>',
    'second side of liquidity pool (LUNA) e.g. 1000',
  )
  .option(
    '--slippage-tolerance <Dec>',
    'Maximum difference between market and estimated price to execute transaction',
  )
  .option('--expiry-height <int>', 'block height expiration of allowance')
  .option('--expiry-time <int>', 'time expiration of allowance (seconds)')
  .option('--expiry-never', 'never expires')
  .action(
    async ({
      slippageTolerance,
      tokenAmount,
      nativeAmount,
      expiryHeight,
      expiryTime,
      expiryNever,
    }: provideLiquidityArgs) => {
      let expiry: Expire;
      if (
        +!!provideLiquiditybLuna.expiryHeight +
          +!!provideLiquiditybLuna.expiryTime +
          +!!provideLiquiditybLuna.expiryNever >=
        2
      ) {
        throw new Error(
          `can only use one option of --expiry-height, --expiry-time, --expiry-never`,
        );
      }

      if (provideLiquiditybLuna.expiryHeight) {
        expiry = {
          at_height: Parse.int(expiryHeight),
        };
      }

      if (provideLiquiditybLuna.expiryTime) {
        expiry = {
          at_time: Parse.int(expiryTime),
        };
      }

      if (expiryNever) {
        expiry = {
          never: {},
        };
      }

      const addressProvider = new AddressProviderFromJSON(
        resolveChainIDToNetworkName(menu.chainId),
      );
      const key = new CLIKey({ keyName: menu.from });
      const userAddress = key.accAddress;
      const message = fabricateTerraswapProvideLiquiditybLuna({
        address: userAddress,
        slippage_tolerance: slippageTolerance,
        quote: 'uluna',
        token_amount: tokenAmount,
        native_amount: nativeAmount,
        expires: expiry,
      })(addressProvider);
      await handleExecCommand(menu, message);
    },
  );

interface provideLiquidityArgs {
  tokenAmount: string;
  nativeAmount: string;
  slippageTolerance?: string;
  quote: string;
  expiryHeight?: string;
  expiryTime?: string;
  expiryNever?: string;
}

const provideLiquidityANC = menu
  .command('provide-liquidity-anc')
  .description('Provide liquidity to a Terraswap pool')
  .requiredOption(
    '--token-amount <string>',
    'first side of liquidity pool (ANC) e.g. 1000',
  )
  .requiredOption(
    '--native-amount <string>',
    'second side of liquidity pool (USD) e.g. 1000',
  )
  .option(
    '--slippage-tolerance <Dec>',
    'Maximum difference between market and estimated price to execute transaction',
  )
  .option('--expiry-height <int>', 'block height expiration of allowance')
  .option('--expiry-time <int>', 'time expiration of allowance (seconds)')
  .option('--expiry-never', 'never expires')
  .action(
    async ({
      slippageTolerance,
      tokenAmount,
      nativeAmount,
      expiryHeight,
      expiryTime,
      expiryNever,
    }: provideLiquidityArgs) => {
      let expiry: Expire;
      if (
        +!!provideLiquidityANC.expiryHeight +
          +!!provideLiquidityANC.expiryTime +
          +!!provideLiquidityANC.expiryNever >=
        2
      ) {
        throw new Error(
          `can only use one option of --expiry-height, --expiry-time, --expiry-never`,
        );
      }

      if (provideLiquidityANC.expiryHeight) {
        expiry = {
          at_height: Parse.int(expiryHeight),
        };
      }

      if (provideLiquidityANC.expiryTime) {
        expiry = {
          at_time: Parse.int(expiryTime),
        };
      }

      if (expiryNever) {
        expiry = {
          never: {},
        };
      }
      const addressProvider = new AddressProviderFromJSON(
        resolveChainIDToNetworkName(menu.chainId),
      );
      const key = new CLIKey({ keyName: menu.from });
      const userAddress = key.accAddress;
      const message = fabricateTerraswapProvideLiquidityANC({
        address: userAddress,
        slippage_tolerance: slippageTolerance,
        quote: 'uusd',
        token_amount: tokenAmount,
        native_amount: nativeAmount,
        expires: expiry,
      })(addressProvider);

      await handleExecCommand(menu, message);
    },
  );

interface swapArgs {
  to?: string;
  beliefPrice?: string;
  maxSpread?: string;
  amount: string;
}
const swapLuna = menu
  .command('swap-luna')
  .description('Swap Luna asset to bLuna using Terraswap')
  .requiredOption('--amount <string>', 'Luna amount to swap')
  .option('--to <AccAddress>', 'Account to send swapped funds to')
  .option(
    '--max-spread <Dec>',
    'Maximum difference between market and estimated price to execute transaction',
  )
  .option('--belief-price <Dec>', 'Price submitted at the time of the swap')
  .action(async ({ to, beliefPrice, maxSpread, amount }: swapArgs) => {
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const pair_message = fabricateTerraswapSwapLuna({
      denom: 'uluna',
      address: userAddress,
      amount: amount,
      to: to,
      belief_price: beliefPrice,
      max_spread: maxSpread,
    })(addressProvider);
    await handleExecCommand(menu, pair_message);
  });

const swapUst = menu
  .command('swap-ust-anc')
  .description('Swap UST asset to ANC using Terraswap')
  .requiredOption('--amount <string>', 'Ust amount to swap')
  .option('--to <AccAddress>', 'Account to send swapped funds to')
  .option(
    '--max-spread <Dec>',
    'Maximum difference between market and estimated price to execute transaction',
  )
  .option('--belief-price <Dec>', 'Price submitted at the time of the swap')
  .action(async ({ to, beliefPrice, maxSpread, amount }: swapArgs) => {
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const pair_message = fabricateTerraswapSwapUSTANC({
      denom: 'uusd',
      address: userAddress,
      amount: amount,
      to: to,
      belief_price: beliefPrice,
      max_spread: maxSpread,
    })(addressProvider);
    await handleExecCommand(menu, pair_message);
  });

interface swapArgs {
  to?: string;
  beliefPrice?: string;
  maxSpread?: string;
  amount: string;
}
const swapbLuna = menu
  .command('swap-bLuna')
  .description('Swap bluna asset to luna asset using Terraswap')
  .requiredOption('--amount <string>', 'bAsset amount to swap')
  .option('--to <AccAddress>', 'Account to send swapped funds to')
  .option(
    '--max-spread <Dec>',
    'Maximum difference between market and estimated price to execute transaction',
  )
  .option('--belief-price <Dec>', 'Price submitted at the time of the swap')
  .action(async ({ to, beliefPrice, maxSpread, amount }: swapArgs) => {
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );

    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const pair_message = fabricateTerraswapSwapbLuna({
      address: userAddress,
      amount: amount,
      to: to,
      belief_price: beliefPrice,
      max_spread: maxSpread,
    })(addressProvider);
    await handleExecCommand(menu, pair_message);
  });

const swapANC = menu
  .command('swap-anc')
  .description('Swap ANC asset to uusd asset using Terraswap')
  .requiredOption('--amount <string>', 'ANC amount to swap')
  .option('--to <AccAddress>', 'Account to send swapped funds to')
  .option(
    '--max-spread <Dec>',
    'Maximum difference between market and estimated price to execute transaction',
  )
  .option('--belief-price <Dec>', 'Price submitted at the time of the swap')
  .action(async ({ to, beliefPrice, maxSpread, amount }: swapArgs) => {
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );

    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const pair_message = fabricateTerraswapSwapANC({
      address: userAddress,
      amount: amount,
      to: to,
      belief_price: beliefPrice,
      max_spread: maxSpread,
    })(addressProvider);
    await handleExecCommand(menu, pair_message);
  });

interface swapArgs {
  amount: string;
}

const withdrawAnc = menu
  .command('withdraw-anc')
  .description('Withdraw ANC asset from Terraswap')
  .requiredOption('--amount <string>', 'ANC amount to withdraw')
  .action(async ({ amount }: swapArgs) => {
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );

    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const pair_message = fabricateTerraswapWithdrawLiquidityANC({
      address: userAddress,
      amount: amount,
    })(addressProvider);
    await handleExecCommand(menu, pair_message);
  });

const withdrawbLuna = menu
  .command('withdraw-bluna')
  .description('Withdraw bLuna asset from Terraswap')
  .requiredOption('--amount <string>', 'bluna amount to withdraw')
  .action(async ({ amount }: swapArgs) => {
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const pair_message = fabricateTerraswapWithdrawLiquiditybLuna({
      address: userAddress,
      amount: amount,
    })(addressProvider);
    await handleExecCommand(menu, pair_message);
  });

const query = createQueryMenu('terraswap', 'Terraswap contract queries');

interface Pool {
  ancUst?: string;
  blunaLuna?: string;
}

const getPool = query
  .command('pool')
  .description('Get pool information on pair')
  .option('--anc-ust', 'get information related to anc<>ust pool')
  .option('--bluna-luna', 'get information related to bluna<>luna pool')
  .action(async ({ ancUst, blunaLuna }: Pool) => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    let address;
    if (ancUst) {
      address = addressProvider.addressesMap.terraswapAncUstPair;
    }
    if (blunaLuna) {
      address = addressProvider.addressesMap.terraswapblunaLunaPair;
    }
    const pool_query = await queryTerraswapPool({
      lcd,
      pair_contract_address: address,
    })(addressProvider);
    await handleQueryCommand(query, pool_query);
  });

const getPair = query
  .command('pair')
  .description('Get terraswap pair')
  .option('--anc-ust', 'get information related to anc<>ust pool')
  .option('--bluna-luna', 'get information related to bluna<>luna pool')
  .action(async ({ ancUst, blunaLuna }: Pool) => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    let address;
    if (ancUst) {
      address = addressProvider.addressesMap.terraswapAncUstPair;
    }
    if (blunaLuna) {
      address = addressProvider.addressesMap.terraswapblunaLunaPair;
    }
    const pair_query = await queryTerrasawpPair({
      lcd,
      pair_contract_address: address,
    })(addressProvider);
    await handleQueryCommand(query, pair_query);
  });

export default {
  menu,
  query,
};
