import { CLIKey } from "@terra-money/terra.js/dist/key/CLIKey";
import { AddressProviderFromEnvVar } from "../../anchor-js/address-provider";

import { createExecMenu, handleExecCommand } from "../../util/contract-menu";
import { Dec } from "@terra-money/terra.js";
import {
  fabricatebOracleConfig,
  fabricatebOracleFeedPrice,
} from "../../anchor-js/fabricators";

const mockAddressProvider = new AddressProviderFromEnvVar();
const menu = createExecMenu(
  "oracle",
  "Anchor MoneyMarket Liquidation contract functions"
);

type Price = [string, Dec];

interface FeedPrice {
  prices: [Price];
}

const feedPrice = menu
  .description("Feed price")
  .requiredOption("--prices <json>", "Vector of assets and their prices")
  .action(async ({ prices }: FeedPrice) => {
    const key = new CLIKey({ keyName: feedPrice.from });
    const userAddress = key.accAddress;
    const msg = fabricatebOracleFeedPrice({
      address: userAddress,
      prices: prices,
    })(mockAddressProvider);
    await handleExecCommand(menu, msg);
  });

interface Config {
  owner?: string;
}
const updateConfig = menu
  .description("Update config")
  .option("--owner <AccAddress>", "Address of new owner")
  .action(async ({ owner }) => {
    const key = new CLIKey({ keyName: updateConfig.from });
    const userAddress = key.accAddress;
    const msg = fabricatebOracleConfig({
      address: userAddress,
      owner: owner,
    })(mockAddressProvider);
    await handleExecCommand(menu, msg);
  });

//TODO: add queries

export default {
  menu,
};
