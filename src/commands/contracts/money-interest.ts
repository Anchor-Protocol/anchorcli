import { CLIKey } from "@terra-money/terra.js/dist/key/CLIKey";
import { AddressProviderFromEnvVar } from "../../anchor-js/address-provider";

import { createExecMenu, handleExecCommand } from "../../util/contract-menu";
import { Dec } from "@terra-money/terra.js";
import { fabricatebInterestConfig } from "../../anchor-js/fabricators/money-market/interest-update-config";
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from "../../addresses/from-json";

const menu = createExecMenu(
  "interest",
  "Anchor MoneyMarket Interest contract functions"
);

interface Config {
  owner?: string;
  baseRate?: Dec;
  interestMultiplier?: Dec;
}

const updateConfig = menu
  .description("update config")
  .option(
    "--owner <AccAddress>",
    "Address of contract owner that can update model parameters"
  )
  .option(
    "--base-rate <Dec>",
    "Minimum per-block interest rate applied to borrows"
  )
  .option(
    "interes-multiplier <Dec>",
    "Multiplier between utilization ratio and per-block borrow rate"
  )
  .action(async ({ owner, baseRate, interestMultiplier }: Config) => {
    const key = new CLIKey({ keyName: updateConfig.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const msg = fabricatebInterestConfig({
      address: userAddress,
      owner: owner,
      base_rate: baseRate,
      interest_multiplier: interestMultiplier,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });
