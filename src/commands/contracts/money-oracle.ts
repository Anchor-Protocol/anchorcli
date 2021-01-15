import { CLIKey } from "@terra-money/terra.js/dist/key/CLIKey";
import { AddressProviderFromEnvVar } from "../../anchor-js/address-provider";

import {
  createExecMenu,
  createQueryMenu,
  handleExecCommand,
} from "../../util/contract-menu";
import { Dec } from "@terra-money/terra.js";
import {
  fabricatebOracleConfig,
  fabricatebOracleFeedPrice,
} from "../../anchor-js/fabricators";
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from "../../addresses/from-json";

const menu = createExecMenu(
  "oracle",
  "Anchor MoneyMarket Liquidation contract functions"
);

type Price = [string, Dec];

interface FeedPrice {
  prices: [Price];
}

const feedPrice = menu
  .command("feed_price")
  .description("Feeds new price data")
  .requiredOption("--prices <json>", "Vector of assets and their prices")
  .action(async ({ prices }: FeedPrice) => {
    const key = new CLIKey({ keyName: feedPrice.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const msg = fabricatebOracleFeedPrice({
      address: userAddress,
      prices: prices,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

interface Config {
  owner?: string;
}
const updateConfig = menu
  .command("update-config")
  .description("Updates the configuration of the contract")
  .option("--owner <AccAddress>", "Address of new owner")
  .action(async ({ owner }: Config) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const msg = fabricatebOracleConfig({
      address: userAddress,
      owner: owner,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

const query = createQueryMenu("oracle", "Anchor oracle contract queries");

//TODO: Add queries
export default {
  query,
  menu,
};
