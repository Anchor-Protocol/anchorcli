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
} from '@anchor-protocol/anchor.js';
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from '../../addresses/from-json';
import { CLIKey } from '@terra-money/terra.js/dist/key/CLIKey';
import * as Parse from '../../util/parse-input';
import { queryTerraswapNativeSimulation } from '@anchor-protocol/anchor.js/dist/queries/terraswap/native-simulation';
import { queryTerraswapReverseNativeSimulation } from '@anchor-protocol/anchor.js/dist/queries/terraswap/reverse-native-simulation';

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
    'first side of liquidity pool e.g. 1000bluna',
  )
  .requiredOption(
    '--native-amount <string>',
    'second side of liquidity pool e.g. 1000uusd',
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
      quote,
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
        quote: quote,
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
  .command('provide-liquidity-bluna')
  .description('Provide liquidity to a Terraswap pool')
  .requiredOption(
    '--token-amount <string>',
    'first side of liquidity pool e.g. 1000bluna',
  )
  .requiredOption(
    '--native-amount <string>',
    'second side of liquidity pool e.g. 1000uusd',
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
      quote,
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
        quote: quote,
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
  denom: string;
}
const swapLuna = menu
  .command('swap-luna')
  .description('Swap native asset to  asset another using Terraswap')
  .requiredOption('--denom <string>', 'Native denom')
  .requiredOption('--amount <string>', 'Native amount to swap')
  .option('--to <AccAddress>', 'Account to send swapped funds to')
  .option(
    '--max-spread <Dec>',
    'Maximum difference between market and estimated price to execute transaction',
  )
  .option('--belief-price <Dec>', 'Price submitted at the time of the swap')
  .action(async ({ to, beliefPrice, maxSpread, amount, denom }: swapArgs) => {
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const pair_message = fabricateTerraswapSwapLuna({
      denom,
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
    console.log(amount);
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

const query = createQueryMenu('terraswap', 'Terraswap contract queries');

// interface TokenSimulation {
//   contractAddr: string;
//   amount: string;
//   denom: string
// }
// const getRevTokenSimulation = query
//   .command('token-reverse-simulation')
//   .description('Simulate and determine swap price')
//   .requiredOption(
//     '--contract-addr <AccAddress>',
//     'Contract address of the asset to swap into',
//   )
//   .requiredOption('--amount <string>', 'Amount of the asset to swap from')
//   .action(async ({ contractAddr, amount, denom }: TokenSimulation) => {
//     const lcd = getLCDClient();
//     const addressProvider = new AddressProviderFromJSON(
//       resolveChainIDToNetworkName(query.chainId),
//     );
//     const reverse_sim_query = await queryTerraswapNativeSimulation({
//       lcd,
//       pair_contract_address: contractAddr,
//       denom,
//       amount,
//     })(addressProvider);
//     await handleQueryCommand(query, reverse_sim_query);
//   });
//
// interface NativeSimulation {
//   denom: string;
//   amount: string;
// }
// const getRevNativeTokenSimulation = query
//   .command('native-reverse-simulation')
//   .description('Simulate and determine swap price')
//   .requiredOption('--denom <string>', 'Native asset denom to swap into')
//   .requiredOption('--amount <string>', 'Amount of the asset to swap into')
//   .action(async ({ denom, amount }: NativeSimulation) => {
//     const lcd = getLCDClient();
//     const addressProvider = new AddressProviderFromJSON(
//       resolveChainIDToNetworkName(query.chainId),
//     );
//     const reverse_sim_query = await queryTerraswapReverseNativeSimulation({
//       lcd,
//       denom,
//       amount,
//     })(addressProvider);
//     await handleQueryCommand(query, reverse_sim_query);
//   });
//
// const getPool = query
//   .command('pool')
//   .description('Get pool information on pair')
//   .action(async () => {
//     const lcd = getLCDClient();
//     const addressProvider = new AddressProviderFromJSON(
//       resolveChainIDToNetworkName(query.chainId),
//     );
//     const pool_query = await queryPool({ lcd })(addressProvider);
//     await handleQueryCommand(query, pool_query);
//   });
//
// const getPair = query
//   .command('pair')
//   .description('Get terraswap pair')
//   .action(async () => {
//     const lcd = getLCDClient();
//     const addressProvider = new AddressProviderFromJSON(
//       resolveChainIDToNetworkName(query.chainId),
//     );
//     const pair_query = await queryPair({ lcd })(addressProvider);
//     await handleQueryCommand(query, pair_query);
//   });

export default {
  menu,
  query,
};
