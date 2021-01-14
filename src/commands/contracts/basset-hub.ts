import { CLIKey } from "@terra-money/terra.js/dist/key/CLIKey";
import { fabricatebAssetBond } from "../../anchor-js/fabricators/basset/basset-bond";
import { fabricatebAssetUpdateGlobalIndex } from "../../anchor-js/fabricators/basset/basset-update-global-index";
import {
  fabricatebAssetBurn,
  fabricatebAssetConfig,
  fabricatebAssetParams,
  fabricatebAssetWithdrawUnbonded,
  fabricateRegisterValidator,
} from "../../anchor-js/fabricators";
import { createExecMenu, handleExecCommand } from "../../util/contract-menu";
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from "../../addresses/from-json";

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

//TODO: Deregister Validator must be included

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
  epochPeriod?: number;
  underlyingCoinDenom?: string;
  unbondingPeriod?: number;
  pegRecoveryFee?: number;
  erThreshold?: number;
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
        epoch_period: epochPeriod,
        underlying_coin_denom: underlyingCoinDenom,
        unbonding_period: unbondingPeriod,
        peg_recovery_fee: pegRecoveryFee,
        er_threshold: erThreshold,
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
    const key = new CLIKey({ keyName: unbond.from });
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

//TODO:
// 1- Add deregister validator
// 2- Add check slashing
// 3- Add queries

export default {
  menu,
};
