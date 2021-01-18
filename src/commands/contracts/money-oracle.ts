import { CLIKey } from "@terra-money/terra.js/dist/key/CLIKey";
import { AddressProviderFromEnvVar } from "../../anchor-js/address-provider";

import {
  createExecMenu,
  createQueryMenu,
  getLCDClient,
  handleExecCommand,
  handleQueryCommand,
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
import { queryMarketConfig } from "../../anchor-js/queries/money-market/market-config";
import { queryOracleConfig } from "../../anchor-js/queries/money-market/oracle-config";
import { queryOraclePrice } from "../../anchor-js/queries/money-market/oracle-price";
import { queryOraclePrices } from "../../anchor-js/queries/money-market/oracle-prices";

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

const getConfig = query.command("config").action(async ({}: Config) => {
  const lcd = getLCDClient();
  const addressProvider = new AddressProviderFromJSON(
    resolveChainIDToNetworkName(menu.chainId)
  );
  const queryConfig = await queryOracleConfig({
    lcd,
  })(addressProvider);
  await handleQueryCommand(menu, queryConfig);
});

interface QueryPrice {
  base: string;
  quote: string;
}

const getPrice = query
  .command("price")
  .requiredOption("--base <String>", "Asset for which to get price")
  .requiredOption(
    "--quote <String>",
    "Asset in which calculated price will be denominated"
  )
  .action(async ({ base, quote }: QueryPrice) => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const queryPrice = await queryOraclePrice({
      lcd,
      base,
      quote,
    })(addressProvider);
    await handleQueryCommand(menu, queryPrice);
  });

interface Prices {
  startAfter?: string;
  limit?: number;
}

const getPrices = query
  .command("prices")
  .option("--start-after <String>", "Asset to start query")
  .option("--limit <int>", "Maximum number of query entries")
  .action(async ({ startAfter, limit }: Prices) => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const queryPrices = await queryOraclePrices({
      lcd,
      startAfter,
      limit,
    })(addressProvider);
    await handleQueryCommand(menu, queryPrices);
  });

export default {
  query,
  menu,
};
