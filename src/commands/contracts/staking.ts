import {
  createExecMenu,
  createQueryMenu,
  getLCDClient,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';
import {
  fabricateStakingBond,
  fabricateStakingUnbond,
  fabricateStakingWithdraw,
  queryStakingConfig,
  queryStakingStaker,
  queryStakingState,
} from '@anchor-protocol/anchor.js';
import { CLIKey } from '@terra-money/terra.js/dist/key/CLIKey';
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from '../../addresses/from-json';
import * as Parse from '../../util/parse-input';
import accAddress = Parse.accAddress;
import int = Parse.int;

const menu = createExecMenu('staking', 'Anchor Staking contract functions');

const addressProvider = new AddressProviderFromJSON(
  resolveChainIDToNetworkName(menu.chainId),
);

interface Unbond {
  amount: string;
}

const unbond = menu
  .command('unbond')
  .description(`Unbond specified amount of ANC-UST Terraswap LP tokens`)
  .requiredOption('--amount <string>', 'Amount of LP tokens to unbond')
  .action(async ({ amount }: Unbond) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    await handleExecCommand(
      menu,
      await fabricateStakingUnbond({
        address: userAddress,
        amount: amount,
      })(addressProvider),
    );
  });

const withdraw = menu
  .command('withdraw')
  .description(`Withdraw user's accrued LP token staking rewards`)
  .action(async () => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    await handleExecCommand(
      menu,
      await fabricateStakingWithdraw({
        address: userAddress,
      })(addressProvider),
    );
  });

interface Bond {
  amount: string;
}

const bond = menu
  .command('bond')
  .description(`Bond LP tokens of the ANC-UST Terraswap pair`)
  .requiredOption('--amount <string>', 'Amount of LP tokens to unbond')
  .action(async ({ amount }: Bond) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    await handleExecCommand(
      menu,
      await fabricateStakingBond({
        address: userAddress,
        amount: amount,
      })(addressProvider),
    );
  });

const query = createQueryMenu('staking', 'Anchor Staking contract queries');

const getConfig = query
  .command('config')
  .description('Get the contract configuration of the Staking contract')
  .action(async () => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const queryConfig = await queryStakingConfig({
      lcd,
    })(addressProvider);
    await handleQueryCommand(query, queryConfig);
  });

const getState = query
  .command('state')
  .description('Get state information for the current block number')
  .action(async () => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const queryConfig = await queryStakingState({
      lcd,
    })(addressProvider);
    await handleQueryCommand(query, queryConfig);
  });

const getStakerInfo = query
  .command('reward-info <staker>')
  .description('Get reward information for the specified LP token staker', {
    staker: '(AccAddress) staker for whom to query rewards',
  })
  .action(async (staker: string) => {
    const lcd = getLCDClient(query.chainId);
    const { block } = await lcd.tendermint.blockInfo();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const queryConfig = await queryStakingStaker({
      lcd,
      staker: accAddress(staker),
      block_height: int(block.header.height),
    })(addressProvider);
    await handleQueryCommand(query, queryConfig);
  });

export default {
  menu,
  query,
};
