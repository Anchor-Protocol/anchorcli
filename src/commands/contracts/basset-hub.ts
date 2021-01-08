import { Int } from "@terra-money/terra.js";
import { CLIKey } from "@terra-money/terra.js/dist/key/CLIKey";
import { AddressProviderFromEnvVar } from "../../anchor-js/address-provider";
import { fabricatebAssetBond } from "../../anchor-js/fabricators/basset/basset-bond";
import { fabricatebAssetUpdateGlobalIndex } from "../../anchor-js/fabricators/basset/basset-update-global-index";
import {
  fabricateRegisterValidator,
  fabricatebAssetConfig,
  fabricatebAssetParams,
  fabricatebAssetWithdrawUnbonded,
  fabricatebAssetBurn,
} from "../../anchor-js/fabricators";
import { createExecMenu, handleExecCommand } from "../../util/contract-menu";

const mockAddressProvider = new AddressProviderFromEnvVar();
const menu = createExecMenu(
  "basset-hub",
  "Anchor bAsset Hub contract functions"
);

interface BondArgs {
  amount: string;
  validator: string;
}

const bond = menu
  .description("Bond asset and mint basset")
  .requiredOption("--amount <string>", "*Asset to be bonded and minted")
  .requiredOption("--validator <AccAddress>", "validator to delegate to")
  .action(async ({ amount, validator }: BondArgs) => {
    const key = new CLIKey({ keyName: bond.from });
    const userAddress = key.accAddress;
    const msgs = fabricatebAssetBond({
      address: userAddress,
      amount: +amount,
      validator: validator,
      bAsset: "bluna",
    })(mockAddressProvider);
    await handleExecCommand(menu, msgs);
  });

const global_index = menu
  .description("Update global index")
  .action(async () => {
    const key = new CLIKey({ keyName: global_index.from });
    const userAddress = key.accAddress;
    const msgs = fabricatebAssetUpdateGlobalIndex({
      address: userAddress,
      bAsset: "bluna",
    })(mockAddressProvider);
    await handleExecCommand(menu, msgs);
  });

interface RegisterValidator {
  validator: string;
}

const registerValidator = menu
  .description("Register a validator")
  .requiredOption("--validator <AccAddress>", "Address of vlidator")
  .action(async ({ validator }: RegisterValidator) => {
    const key = new CLIKey({ keyName: registerValidator.from });
    const userAddress = key.accAddress;
    const msgs = fabricateRegisterValidator({
      address: userAddress,
      validatorAddress: validator,
    })(mockAddressProvider);
    handleExecCommand(menu, msgs);
  });

//TODO: Deregister Validator must be included

interface UpdateConfig {
  owner?: string;
  rewardAddress?: string;
  tokenAddress?: string;
}
const updateConfig = menu
  .description("Update the config of hub contract")
  .option("--owner <AccAddress>", "Address of the new owner")
  .option("--reward-address <AccAddress>", "The new address of reward contract")
  .option("--token-address <AccAddress>", "The new address of token contract")
  .action(async ({ owner, rewardAddress, tokenAddress }: UpdateConfig) => {
    const key = new CLIKey({ keyName: updateConfig.from });
    const userAddress = key.accAddress;
    const msg = fabricatebAssetConfig({
      address: userAddress,
      owner: owner,
      reward_contract: rewardAddress,
      token_contract: tokenAddress,
      bAsset: "bluna",
    })(mockAddressProvider);
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
      const key = new CLIKey({ keyName: updateParams.from });
      const userAddress = key.accAddress;
      const msg = fabricatebAssetParams({
        address: userAddress,
        epoch_period: epochPeriod,
        underlying_coin_denom: underlyingCoinDenom,
        unbonding_period: unbondingPeriod,
        peg_recovery_fee: pegRecoveryFee,
        er_threshold: erThreshold,
        reward_denom: rewardDenom,
        bAsset: "bluna",
      })(mockAddressProvider);
      await handleExecCommand(menu, msg);
    }
  );

const withdrawUnbond = menu
  .description("Send withdraw unbonded message")
  .action(async () => {
    const key = new CLIKey({ keyName: withdrawUnbond.from });
    const userAddress = key.accAddress;
    const msg = fabricatebAssetWithdrawUnbonded({
      address: userAddress,
      bAsset: "bluna",
    })(mockAddressProvider);
    await handleExecCommand(menu, msg);
  });

interface Unbond {
  string;
}
const unbond = menu
  .description("")
  .requiredOption("--amount <string>", "The amount for unbonding")
  .action(async ({ amount }) => {
    const key = new CLIKey({ keyName: unbond.from });
    const userAddress = key.accAddress;
    const msg = fabricatebAssetBurn({
      address: userAddress,
      amount: amount,
      bAsset: `bluna`,
    })(mockAddressProvider);
    await handleExecCommand(menu, msg);
  });

//TODO: Add queries

export default {
  menu,
};
