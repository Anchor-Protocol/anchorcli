import {
  createExecMenu,
  createQueryMenu,
  getLCDClient,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';
import {
  fabricatebSwapbLuna,
  fabricatebTerraSwapCreatePair,
  fabricateTerraSwapProvideLiquidity,
} from '../../anchor-js/fabricators';
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from '../../addresses/from-json';
import { CLIKey } from '@terra-money/terra.js/dist/key/CLIKey';
import { querySimulation } from '../../anchor-js/queries/terraswap/simulation';
import { queryNativeSimulation } from '../../anchor-js/queries/terraswap/native-simulation';
import { queryPool } from '../../anchor-js/queries/terraswap/pool';
import { queryPair } from '../../anchor-js/queries/terraswap/pairs';
import { queryReverseNativeSimulation } from '../../anchor-js/queries/terraswap/reverse-native-simulation';
import { queryReverseTokenSimulation } from '../../anchor-js/queries/terraswap/reverse-token-simulation';
import { fabricatebSwapLuna } from '../../anchor-js/fabricators/terraswap/swap-native';

const menu = createExecMenu(
  'terraswap',
  'terraswap, anchor related contract functions',
);

interface CreatePair {
  denom: string;
}

const create_pair = menu
  .command('create-pair')
  .description('Create LP token contract')
  .requiredOption('--denom <string>', 'Supported native token')
  .action(async ({ denom }: CreatePair) => {
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const pair_message = fabricatebTerraSwapCreatePair({
      address: userAddress,
      bAsset: 'bluna',
      nativeToken: denom,
    })(addressProvider);
    await handleExecCommand(menu, pair_message);
  });

interface provideLiquidityArgs {
  tokenAmount: string;
  nativeAmount: string;
  slippageTolerance?: string;
  quote: string;
}

const provideLiquidity = menu
  .command('provide-liquidity')
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
  .action(
    async ({
      slippageTolerance,
      tokenAmount,
      nativeAmount,
      quote,
    }: provideLiquidityArgs) => {
      const addressProvider = new AddressProviderFromJSON(
        resolveChainIDToNetworkName(menu.chainId),
      );
      const key = new CLIKey({ keyName: menu.from });
      const userAddress = key.accAddress;
      const message = fabricateTerraSwapProvideLiquidity({
        address: userAddress,
        slippageTolerance: slippageTolerance,
        quote: quote,
        bAsset: 'bluna',
        tokenAmount: tokenAmount,
        nativeAmount: nativeAmount,
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
const swapNative = menu
  .command('swap-native')
  .description('Swap native asset to cw20 asset another using Terraswap')
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
    const pair_message = fabricatebSwapLuna({
      denom,
      address: userAddress,
      amount: amount,
      to: to,
      beliefPrice: beliefPrice,
      maxSpread: maxSpread,
    })(addressProvider);
    await handleExecCommand(menu, pair_message);
  });

interface swapArgs {
  to?: string;
  beliefPrice?: string;
  maxSpread?: string;
  amount: string;
}
const swap = menu
  .command('swap-cw20')
  .description('Swap cw20 asset to native asset using Terraswap')
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
    const pair_message = fabricatebSwapbLuna({
      address: userAddress,
      amount: amount,
      bAsset: 'bluna',
      to: to,
      beliefPrice: beliefPrice,
      maxSpread: maxSpread,
    })(addressProvider);
    await handleExecCommand(menu, pair_message);
  });

const query = createQueryMenu('terraswap', 'Terraswap contract queries');

interface TokenSimulation {
  contractAddr: string;
  amount: string;
}
const getRevTokenSimulation = query
  .command('token-reverse-imulation')
  .description('Simulate and determine swap price')
  .requiredOption(
    '--contract-addr <AccAddress>',
    'Contract address of the asset to swap into',
  )
  .requiredOption('--amount <string>', 'Amount of the asset to swap from')
  .action(async ({ contractAddr, amount }: TokenSimulation) => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const reverse_sim_query = await queryReverseTokenSimulation({
      lcd,
      contractAddr,
      amount,
    })(addressProvider);
    await handleQueryCommand(query, reverse_sim_query);
  });

interface NativeSimulation {
  denom: string;
  amount: string;
}
const getRevNativeTokenSimulation = query
  .command('native-reverse-simulation')
  .description('Simulate and determine swap price')
  .requiredOption('--denom <string>', 'Native asset denom to swap into')
  .requiredOption('--amount <string>', 'Amount of the asset to swap into')
  .action(async ({ denom, amount }: NativeSimulation) => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const reverse_sim_query = await queryReverseNativeSimulation({
      lcd,
      denom,
      amount,
    })(addressProvider);
    await handleQueryCommand(query, reverse_sim_query);
  });

const getPool = query
  .command('pool')
  .description('Get pool information on pair')
  .action(async () => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const pool_query = await queryPool({ lcd })(addressProvider);
    await handleQueryCommand(query, pool_query);
  });

const getPair = query
  .command('pair')
  .description('Get terraswap pair')
  .action(async () => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const pair_query = await queryPair({ lcd })(addressProvider);
    await handleQueryCommand(query, pair_query);
  });

export default {
  menu,
  query,
};
