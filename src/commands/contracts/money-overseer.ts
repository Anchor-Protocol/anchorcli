import { CLIKey } from "@terra-money/terra.js/dist/key/CLIKey";
import { AddressProviderFromEnvVar } from "../../anchor-js/address-provider";

import { createExecMenu, handleExecCommand } from "../../util/contract-menu";
import {
  fabricatebOverseerConfig,
  fabricatebOverseerEpoch,
  fabricatebOverseerUpWhiteList,
  fabricatebOverseerWhiteList,
} from "../../anchor-js/fabricators";
import { Dec } from "@terra-money/terra.js";

const mockAddressProvider = new AddressProviderFromEnvVar();
const menu = createExecMenu(
  "overseer",
  "Anchor MoneyMarket Overseer contract functions"
);

const excecuteEpochOperattion = menu
  .description("execute epoch operations")
  .action(async () => {
    const key = new CLIKey({ keyName: excecuteEpochOperattion.from });
    const userAddress = key.accAddress;
    const msg = fabricatebOverseerEpoch({
      address: userAddress,
      overseer: "overseer",
    })(mockAddressProvider);
    await handleExecCommand(menu, msg);
  });

interface Option {
  ownerAddress?: string;
  oracleContract?: string;
  liquidationContract?: string;
  distributionThreshold?: Dec;
  targetDepositRate?: Dec;
  bufferDistributionRate?: Dec;
  epochPeriod?: number;
  priceTimeframe?: number;
}
const updateConfig = menu
  .description("update config")
  .option("--owner-address <AccAddress>", "Address of new contract owner")
  .option("--oracle-contract <AccAddress>", "Contract address of new Oracle")
  .option(
    "--liquidation-contract <AccAddress>",
    "Contract address of new Liquidation Contract"
  )
  .option(
    "--distribution-threshold <Dec>",
    "New threshold per-block deposit rate to trigger interest buffer distribution"
  )
  .option(
    "--target-deposit-rate <Dec>",
    "New maximum per-block deposit rate before a portion of rewards are set aside as interest buffer"
  )
  .option(
    "--buffer-distribution-rate <Dec>",
    "New maximum portion of interest buffer that can be distributed in an epoch"
  )
  .option(
    "--epoch-period <int>",
    "New minimum time delay between epoch operations"
  )
  .option(
    "--price-time-frame <int>",
    "New window of time before price data is considered outdated"
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
    }) => {
      const key = new CLIKey({ keyName: updateConfig.from });
      const userAddress = key.accAddress;
      const msg = fabricatebOverseerConfig({
        address: userAddress,
        overseer: "overseer",
        owner_addr: ownerAddress,
        oracle_contract: oracleContract,
        liquidation_contract: liquidationContract,
        distribution_threshold: distributionThreshold,
        target_deposit_rate: targetDepositRate,
        buffer_distribution_rate: bufferDistributionRate,
        epoch_period: epochPeriod,
        price_timeframe: priceTimeframe,
      })(mockAddressProvider);
      await handleExecCommand(menu, msg);
    }
  );

interface WhiteList {
  collateralToken: string;
  custodyContract: string;
  ltv?: Dec;
}

const whiteList = menu
  .description("update white list")
  .requiredOption(
    "--collateral-token <AccAddress>",
    "Cw20 token contract address of collateral"
  )
  .option(
    "--custody-contract <AccAddress>",
    "New Custody contract address of collateral"
  )
  .option(
    "--ltv <Dec>",
    "New maximum loan-to-value ratio allowed for collateral"
  )
  .action(
    async ({ collateralToken, custodyContract, ltv }: UpdateWhiteList) => {
      const key = new CLIKey({ keyName: whiteList.from });
      const userAddress = key.accAddress;
      const msg = fabricatebOverseerWhiteList({
        address: userAddress,
        overseer: "overseer",
        collateral_token: collateralToken,
        custody_contract: custodyContract,
        ltv: ltv,
      })(mockAddressProvider);
      await handleExecCommand(menu, msg);
    }
  );

interface UpdateWhiteList {
  collateralToken: string;
  custodyContract?: string;
  ltv?: Dec;
}

const updateWhiteList = menu
  .description("update white list")
  .requiredOption(
    "--collateral-token <AccAddress>",
    "Cw20 token contract address of collateral"
  )
  .option(
    "--custody-contract <AccAddress>",
    "New Custody contract address of collateral"
  )
  .option(
    "--ltv <Dec>",
    "New maximum loan-to-value ratio allowed for collateral"
  )
  .action(
    async ({ collateralToken, custodyContract, ltv }: UpdateWhiteList) => {
      const key = new CLIKey({ keyName: updateWhiteList.from });
      const userAddress = key.accAddress;
      const msg = fabricatebOverseerUpWhiteList({
        address: userAddress,
        overseer: "overseer",
        collateral_token: collateralToken,
        custody_contract: custodyContract,
        ltv: ltv,
      })(mockAddressProvider);
      await handleExecCommand(menu, msg);
    }
  );

//TODO: add queries

export default {
  menu,
};
