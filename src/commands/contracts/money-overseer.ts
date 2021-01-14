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
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from "../../addresses/from-json";

const menu = createExecMenu(
  "overseer",
  "Anchor MoneyMarket Overseer contract functions"
);

const excecuteEpochOperattion = menu
  .command("execute_epoch_operations")
  .description("Execute epoch operations")
  .action(async () => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const msg = fabricatebOverseerEpoch({
      address: userAddress,
      overseer: "overseer",
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

interface Config {
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
  .command("update-config")
  .description("Update the configuration of the contract")
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
    }: Config) => {
      const key = new CLIKey({ keyName: menu.from });
      const userAddress = key.accAddress;
      const addressProvider = new AddressProviderFromJSON(
        resolveChainIDToNetworkName(menu.chainId)
      );
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
      })(addressProvider);
      await handleExecCommand(menu, msg);
    }
  );

interface WhiteList {
  collateralToken: string;
  custodyContract: string;
  ltv?: Dec;
}

const whiteList = menu
  .command("whitelist")
  .description("Whitelist a new collateral accepted in the money market")
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
  .action(async ({ collateralToken, custodyContract, ltv }: WhiteList) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const msg = fabricatebOverseerWhiteList({
      address: userAddress,
      overseer: "overseer",
      collateral_token: collateralToken,
      custody_contract: custodyContract,
      ltv: ltv,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

interface UpdateWhiteList {
  collateralToken: string;
  custodyContract?: string;
  ltv?: Dec;
}

const updateWhiteList = menu
  .command("update_whitelist")
  .description('Update information for an already whitelisted collateral"')
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
      const addressProvider = new AddressProviderFromJSON(
        resolveChainIDToNetworkName(menu.chainId)
      );
      const msg = fabricatebOverseerUpWhiteList({
        address: userAddress,
        overseer: "overseer",
        collateral_token: collateralToken,
        custody_contract: custodyContract,
        ltv: ltv,
      })(addressProvider);
      await handleExecCommand(menu, msg);
    }
  );

//TODO: add queries

export default {
  menu,
};
