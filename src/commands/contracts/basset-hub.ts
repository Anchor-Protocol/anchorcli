import { CLIKey } from '@terra-money/terra.js/dist/key/CLIKey';
import {
    fabricatebAssetBond,
    fabricatebAssetUpdateGlobalIndex,
    fabricatebAssetCheckSlashing,
    fabricatebAssetBurn,
    fabricatebAssetUpdateConfig,
    fabricatebAssetUpdateParams,
    fabricatebAssetWithdrawUnbonded,
    fabricatebAssetRegisterValidator,
    queryHubConfig,
    queryHubCurrentBatch,
    queryHubHistory,
    queryHubParams,
    queryHubState,
    queryHubUnbond,
    queryHubWhiteVals,
    queryHubWithdrawable,
    fabricatebAssetDeregisterValidator, fabricatebAssetUnbond,
} from '@anchor-protocol/anchor.js';
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
import * as Parse from '../../util/parse-input';
import accAddress = Parse.accAddress;
import int = Parse.int;

const menu = createExecMenu(
  'basset-hub',
  'Anchor bAsset Hub contract functions',
);

const lcd = getLCDClient();

interface BondArgs {
  amount: string;
  validator: string;
}

const bond = menu
  .command('bond')
  .description('Bond asset and mint basset')
  .requiredOption(
    '--amount <string>',
    'Amount of Asset to be bonded and minted',
  )
  .requiredOption('--validator <AccAddress>', 'Validator to delegate to')
  .action(async ({ amount, validator }: BondArgs) => {
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const msgs = fabricatebAssetBond({
      address: userAddress,
      amount: amount,
      validator: validator,
    })(addressProvider);

    await handleExecCommand(menu, msgs);
  });

const global_index = menu
  .command('update-global-index')
  .description('Update global index for reward distribution')
  .action(async () => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msgs = fabricatebAssetUpdateGlobalIndex({
      address: userAddress,
    })(addressProvider);
    await handleExecCommand(menu, msgs);
  });

const checkSlashing = menu
  .command('check-slashing')
  .description('Check if a slashing event occurred')
  .action(async () => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msgs = fabricatebAssetCheckSlashing({
      address: userAddress,
    })(addressProvider);
    await handleExecCommand(menu, msgs);
  });

interface RegisterValidator {
  validator: string;
}

const registerValidator = menu
  .command('register-validator')
  .description('Register a new validator to the validator whitelist')
  .requiredOption('--validator <AccAddress>', 'Address of validator')
  .action(async ({ validator }: RegisterValidator) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msgs = fabricatebAssetRegisterValidator({
      address: userAddress,
      validator: validator,
    })(addressProvider);
    await handleExecCommand(menu, msgs);
  });

const deregisterValidator = menu
  .command('deregister-validator')
  .description('Deregister the validator from the validator whitelist')
  .requiredOption('--validator <AccAddress>', 'Address of validator')
  .action(async ({ validator }: RegisterValidator) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msgs = fabricatebAssetDeregisterValidator({
      address: userAddress,
      validator: validator,
    })(addressProvider);
    await handleExecCommand(menu, msgs);
  });

interface UpdateConfig {
  owner?: string;
  rewardAddress?: string;
  tokenAddress?: string;
  airdropRegistryAddress?: string;
}
const updateConfig = menu
  .command('update-config')
  .description('Update the config of hub contract')
  .option('--owner <AccAddress>', 'Address of the new owner')
  .option('--reward-address <AccAddress>', 'The new address of reward contract')
  .option('--token-address <AccAddress>', 'The new address of token contract')
  .option(
    '--airdrop-registry-address <AccAddress>',
    'The new address of airdrop registry',
  )
  .action(
    async ({
      owner,
      rewardAddress,
      tokenAddress,
      airdropRegistryAddress,
    }: UpdateConfig) => {
      const key = new CLIKey({ keyName: menu.from });
      const userAddress = key.accAddress;
      const addressProvider = new AddressProviderFromJSON(
        resolveChainIDToNetworkName(menu.chainId),
      );
      const msg = fabricatebAssetUpdateConfig({
        address: userAddress,
        owner: owner,
        reward_contract: rewardAddress,
        token_contract: tokenAddress,
        airdrop_registry_contract: airdropRegistryAddress,
      })(addressProvider);
      await handleExecCommand(menu, msg);
    },
  );

interface Params {
  epochPeriod?: string;
  unbondingPeriod?: string;
  pegRecoveryFee?: string;
  erThreshold?: string;
}

const updateParams = menu
  .command('update-params')
  .description('Update parameters for the hub contract')
  .option('epoch-period <int>', 'The period of time for each epoch in second')
  .option(
    'unbonding-period <int>',
    'Unbonding time, slightly more than unbonding period of sdk',
  )
  .option('peg-recovery-fee <Dec>', 'Recovery fee')
  .option('er-threshold<Dec>', 'Exchange rate threshold')
  .action(
    async ({
      epochPeriod,
      unbondingPeriod,
      pegRecoveryFee,
      erThreshold,
    }: Params) => {
      const key = new CLIKey({ keyName: menu.from });
      const userAddress = key.accAddress;
      const addressProvider = new AddressProviderFromJSON(
        resolveChainIDToNetworkName(menu.chainId),
      );
      const msg = fabricatebAssetUpdateParams({
        address: userAddress,
        epoch_period: int(epochPeriod),
        unbonding_period: int(unbondingPeriod),
        peg_recovery_fee: pegRecoveryFee,
        er_threshold: erThreshold,
      })(addressProvider);
      await handleExecCommand(menu, msg);
    },
  );

const withdrawUnbond = menu
  .command('withdraw-unbonded')
  .description('Send withdraw unbonded message')
  .action(async () => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msg = fabricatebAssetWithdrawUnbonded({
      address: userAddress,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

interface Unbond {
  amount: string;
}
const unbond = menu
  .command('unbond')
  .description('Burn and unbond a corresponding amount of asset')
  .requiredOption('--amount <string>', 'The amount for unbonding')
  .action(async ({ amount }: Unbond) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msg = fabricatebAssetUnbond({
      address: userAddress,
      amount: amount,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

const query = createQueryMenu(
  'basset-hub',
  'Anchor bAsset hub contract queries',
);
const getConfig = query
  .command('config')
  .description("Get the Hub contract's configuration")
  .action(async () => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const config_query = await queryHubConfig({ lcd: lcd })(addressProvider);
    await handleQueryCommand(query, config_query);
  });

const getCurrentBatch = query
  .command('current-batch')
  .description('Get information about the current undelegation batch')
  .action(async () => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const batch_query = await queryHubCurrentBatch({
      lcd: lcd,
    })(addressProvider);
    await handleQueryCommand(query, batch_query);
  });

interface AllHistory {
  startFrom?: string;
  limit?: string;
}

const getAllHistory = query
  .command('all-history')
  .description('Get the historical list of undelegation batch entries')
  .option('--start-from <int>', 'Batch ID to start query')
  .option('--limit <int>', 'Maximum number of query entries')
  .action(async ({ startFrom, limit }: AllHistory) => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const batch_query = await queryHubHistory({
      lcd: lcd,
      start_from: int(startFrom),
      limit: int(limit),
    })(addressProvider);
    await handleQueryCommand(query, batch_query);
  });

const getParams = query
  .command('params')
  .description('Get parameter information')
  .action(async () => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const batch_query = await queryHubParams({ lcd: lcd })(addressProvider);
    await handleQueryCommand(query, batch_query);
  });

const getWhitelistedValidators = query
  .command('whitelisted-validators')
  .description('Get the list of whitelisted validators')
  .action(async () => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const batch_query = await queryHubWhiteVals({ lcd: lcd })(addressProvider);
    await handleQueryCommand(query, batch_query);
  });

interface UnbondRequest {
  address: string;
}

const getUnbondRequest = query
  .command('unbond-requests')
  .description(
    'Get the list of Luna unbonding amounts being unbonded for the specified user',
  )
  .requiredOption('--address <AccAddress>', 'Address of user')
  .action(async ({ address }: UnbondRequest) => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const batch_query = await queryHubUnbond({
      lcd: lcd,
      address: accAddress(address),
    })(addressProvider);
    await handleQueryCommand(query, batch_query);
  });

interface Whitdrawable {
  address: string;
  blockTime: string;
}

const getWhitdrawable = query
  .command('withdrawable-unbonded')
  .description(
    'Get the amount of undelegated Luna that is available for withdrawal',
  )
  .requiredOption('--address <AccAddress>', 'Address of user')
  .requiredOption('--block-time <int>', 'Current block timestamp')
  .action(async ({ address, blockTime }: Whitdrawable) => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const batch_query = await queryHubWithdrawable({
      lcd: lcd,
      address: accAddress(address),
      block_time: int(blockTime),
    })(addressProvider);
    await handleQueryCommand(query, batch_query);
  });

const getState = query
  .command('state')
  .description('Get information about the current state')
  .action(async () => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const config_query = await queryHubState({ lcd: lcd, bAsset: 'bluna' })(
      addressProvider,
    );
    await handleQueryCommand(query, config_query);
  });

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  query,
  menu,
};
