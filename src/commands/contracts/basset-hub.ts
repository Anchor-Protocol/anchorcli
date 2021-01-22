import { CLIKey } from "@terra-money/terra.js/dist/key/CLIKey";
import {
  fabricatebAssetBond,
  fabricatebCheckSlashing,
} from "../../anchor-js/fabricators";
import { fabricatebAssetUpdateGlobalIndex } from "../../anchor-js/fabricators/basset/basset-update-global-index";
import {
  fabricatebAssetBurn,
  fabricatebAssetConfig,
  fabricatebAssetParams,
  fabricatebAssetWithdrawUnbonded,
  fabricateRegisterValidator,
} from "../../anchor-js/fabricators";
import {
  createExecMenu,
  createQueryMenu,
  getLCDClient,
  handleExecCommand,
  handleQueryCommand,
} from "../../util/contract-menu";
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from "../../addresses/from-json";
import {
  queryHubConfig,
  queryHubCurrentBatch,
  queryHubHistory,
  queryHubParams,
  queryHubState,
  queryHubUnbond,
  queryHubWhiteVals,
  queryHubWithdrawable,
} from "../../anchor-js/queries";
import { Parse } from "../../util/parse-input";
import accAddress = Parse.accAddress;
import { fabricateDeRegisterValidator } from "../../anchor-js/fabricators/basset/basset-deregister-validator";
import int = Parse.int;

const menu = createExecMenu(
  "basset-hub",
  "Anchor bAsset Hub contract functions"
);

interface BondArgs {
  amount: string;
  validator: string;
}

const bond = menu
  .command("bond")
  .description("Bond asset and mint basset")
  .requiredOption("--amount <string>", "*Asset to be bonded and minted")
  .requiredOption("--validator <AccAddress>", "validator to delegate to")
  .action(async ({ amount, validator }: BondArgs) => {
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const msgs = fabricatebAssetBond({
      address: userAddress,
      amount: +amount,
      validator: validator,
      bAsset: "bluna",
    })(addressProvider);

    await handleExecCommand(menu, msgs);
  });

const global_index = menu
  .command("update-global-index")
  .description("Update global index for reward distribution")
  .action(async () => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const msgs = fabricatebAssetUpdateGlobalIndex({
      address: userAddress,
      bAsset: "bluna",
    })(addressProvider);
    await handleExecCommand(menu, msgs);
  });

const checkSlashing = menu
  .command("check-slashing")
  .description("Check if a slashing event occurred ")
  .action(async () => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const msgs = fabricatebCheckSlashing({
      address: userAddress,
      bAsset: "bluna",
    })(addressProvider);
    await handleExecCommand(menu, msgs);
  });

interface RegisterValidator {
  validator: string;
}

const registerValidator = menu
  .command("register-validator")
  .description("Register a new validator to the validator whitelist")
  .requiredOption("--validator <AccAddress>", "Address of validator")
  .action(async ({ validator }: RegisterValidator) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const msgs = fabricateRegisterValidator({
      address: userAddress,
      validatorAddress: validator,
    })(addressProvider);
    await handleExecCommand(menu, msgs);
  });

const deregisterValidator = menu
  .command("deregister-validator")
  .description("Deregister the validator from the validator whitelist")
  .requiredOption("--validator <AccAddress>", "Address of validator")
  .action(async ({ validator }: RegisterValidator) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const msgs = fabricateDeRegisterValidator({
      address: userAddress,
      validatorAddress: validator,
    })(addressProvider);
    await handleExecCommand(menu, msgs);
  });

interface UpdateConfig {
  owner?: string;
  rewardAddress?: string;
  tokenAddress?: string;
}
const updateConfig = menu
  .command("update-config")
  .description("Update the config of hub contract")
  .option("--owner <AccAddress>", "Address of the new owner")
  .option("--reward-address <AccAddress>", "The new address of reward contract")
  .option("--token-address <AccAddress>", "The new address of token contract")
  .action(async ({ owner, rewardAddress, tokenAddress }: UpdateConfig) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const msg = fabricatebAssetConfig({
      address: userAddress,
      owner: owner,
      reward_contract: rewardAddress,
      token_contract: tokenAddress,
      bAsset: "bluna",
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

interface Params {
  epochPeriod?: string;
  underlyingCoinDenom?: string;
  unbondingPeriod?: string;
  pegRecoveryFee?: string;
  erThreshold?: string;
  rewardDenom?: string;
}

const updateParams = menu
  .command("update-params")
  .description("Update parameters for the hub contract")
  .option("epoch-period <int>", "The period of time for each epoch in second")
  .option("underlying-coin-denom <string>", "Supported denominator for basset")
  .option(
    "unbonding-period <int>",
    "Unbonding time, slightly more than unbonding period of sdk"
  )
  .option("peg-recovery-fee <Dec>", "Recovery fee")
  .option("er-threshold<Dec>", "Exchange rate threshold")
  .option("reward-denom <string>", "Denominator for reward calculation")
  .action(
    async ({
      epochPeriod,
      underlyingCoinDenom,
      unbondingPeriod,
      pegRecoveryFee,
      erThreshold,
      rewardDenom,
    }: Params) => {
      const key = new CLIKey({ keyName: menu.from });
      const userAddress = key.accAddress;
      const addressProvider = new AddressProviderFromJSON(
        resolveChainIDToNetworkName(menu.chainId)
      );
      const msg = fabricatebAssetParams({
        address: userAddress,
        epoch_period: int(epochPeriod),
        underlying_coin_denom: underlyingCoinDenom,
        unbonding_period: int(unbondingPeriod),
        peg_recovery_fee: int(pegRecoveryFee),
        er_threshold: int(erThreshold),
        reward_denom: rewardDenom,
        bAsset: "bluna",
      })(addressProvider);
      await handleExecCommand(menu, msg);
    }
  );

const withdrawUnbond = menu
  .command("withdraw-unbonded")
  .description("Send withdraw unbonded message")
  .action(async () => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const msg = fabricatebAssetWithdrawUnbonded({
      address: userAddress,
      bAsset: "bluna",
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

interface Unbond {
  amount: string;
}
const unbond = menu
  .command("unbond")
  .description("Burn and unbond a corresponding amount of asset")
  .requiredOption("--amount <string>", "The amount for unbonding")
  .action(async ({ amount }: Unbond) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const msg = fabricatebAssetBurn({
      address: userAddress,
      amount: amount,
      bAsset: `bluna`,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

const query = createQueryMenu(
  "basset-hub",
  "Anchor bAsset hub contract queries"
);
const getConfig = query
  .command("config")
  .description("Get the Hub contract's configuration")
  .action(async () => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId)
    );
    const config_query = await queryHubConfig({ lcd: lcd, bAsset: "bluna" })(
      addressProvider
    );
    await handleQueryCommand(query, config_query);
  });

const getCurrentBatch = query
  .command("current-batch")
  .description("Get information about the current undelegation batch")
  .action(async () => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId)
    );
    const batch_query = await queryHubCurrentBatch({
      lcd: lcd,
      bAsset: "bluna",
    })(addressProvider);
    await handleQueryCommand(query, batch_query);
  });

interface AllHistory {
  startFrom?: string;
  limit?: string;
}

const getAllHistory = query
  .command("all-history")
  .description("Get the historical list of undelegation batch entries")
  .option("--start-from <int>", "Batch ID to start query")
  .option("--limit <int>", "Maximum number of query entries")
  .action(async ({ startFrom, limit }: AllHistory) => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId)
    );
    const batch_query = await queryHubHistory({
      lcd: lcd,
      bAsset: "bluna",
      startFrom: int(startFrom),
      lim: int(limit),
    })(addressProvider);
    await handleQueryCommand(query, batch_query);
  });

const getParams = query
  .command("params")
  .description("Get parameter information")
  .action(async () => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId)
    );
    const batch_query = await queryHubParams({ lcd: lcd, bAsset: "bluna" })(
      addressProvider
    );
    await handleQueryCommand(query, batch_query);
  });

const getWhitelistedValidators = query
  .command("whitelisted-validators")
  .description("Get the list of whitelisted validators")
  .action(async () => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId)
    );
    const batch_query = await queryHubWhiteVals({ lcd: lcd, bAsset: "bluna" })(
      addressProvider
    );
    await handleQueryCommand(query, batch_query);
  });

interface UnbondRequest {
  address: string;
}

const getUnbondRequest = query
  .command("unbond-requests")
  .description(
    "Get the list of Luna unbonding amounts being unbonded for the specified user"
  )
  .option("--address <AccAddress>", "Address of user")
  .action(async ({ address }: UnbondRequest) => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId)
    );
    const batch_query = await queryHubUnbond({
      lcd: lcd,
      bAsset: "bluna",
      address: accAddress(address),
    })(addressProvider);
    await handleQueryCommand(query, batch_query);
  });

interface Whitdrawable {
  address: string;
  blockTime: string;
}

const getWhitdrawable = query
  .command("withdrawable-unbonded")
  .description(
    "Get the amount of undelegated Luna that is available for withdrawal"
  )
  .option("--address <AccAddress>", "Address of user")
  .option("--block-time <int>", "Current block timestamp")
  .action(async ({ address, blockTime }: Whitdrawable) => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId)
    );
    const batch_query = await queryHubWithdrawable({
      lcd: lcd,
      bAsset: "bluna",
      address: accAddress(address),
      block_time: int(blockTime),
    })(addressProvider);
    await handleQueryCommand(query, batch_query);
  });

const getState = query
  .command("state")
  .description("Get information about the current state")
  .action(async () => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId)
    );
    const config_query = await queryHubState({ lcd: lcd, bAsset: "bluna" })(
      addressProvider
    );
    await handleQueryCommand(query, config_query);
  });

export default {
  query,
  menu,
};
