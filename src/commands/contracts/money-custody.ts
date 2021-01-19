import {
  createExecMenu,
  createQueryMenu,
  getLCDClient,
  handleExecCommand,
  handleQueryCommand,
} from "../../util/contract-menu";
import { AddressProviderFromEnvVar } from "../../anchor-js/address-provider";
import { CLIKey } from "@terra-money/terra.js/dist/key/CLIKey";
import { fabricatebCustodyConfig } from "../../anchor-js/fabricators";
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from "../../addresses/from-json";
import { queryInterestModelBorrowRate } from "../../anchor-js/queries/money-market/interest-model-borrow-rate";
import { AccAddress } from "@terra-money/terra.js";
import { queryCustodyBorrower } from "../../anchor-js/queries/money-market/custody-borrower";
import { queryCustodyBorrowers } from "../../anchor-js/queries/money-market/custody-borrowers";
import { queryCustodyConfig } from "../../anchor-js/queries/money-market/custody-config";

const menu = createExecMenu(
  "custody",
  "Anchor MoneyMarket Custody contract functions"
);

interface Config {
  liquidationContract?: string;
}

const updateConfig = menu
  .command("update-config")
  .description("Updates the configuration of the Custody contract")
  .option(
    "--liquidation-contract <AccAddress>",
    "New contract address of Liquidation Contract"
  )
  .action(async ({ liquidationContract }: Config) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const msg = fabricatebCustodyConfig({
      address: userAddress,
      custody: "custody",
      liquidation_contract: liquidationContract,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

const query = createQueryMenu("custody", "Anchor custody contract queries");

interface Borrower {
  address: string;
}

const getBorrower = query
  .command("borrower")
  .requiredOption(
    "--address <AccAddress>",
    "Address of borrower that deposited collateral"
  )
  .action(async ({ address }: Borrower) => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const queryBorrower = await queryCustodyBorrower({
      lcd,
      custody: "custody",
      address,
    })(addressProvider);
    await handleQueryCommand(menu, queryBorrower);
  });

interface Borrowers {
  startAfter?: string;
  limit?: number;
}

const getBorrowers = query
  .command("borrowers")
  .option("--start-after <AccAddress>", "Borrower address to start query")
  .option("--limit <int>", "Maximum number of query entries")
  .action(async ({ startAfter, limit }: Borrowers) => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const queryBorrowers = await queryCustodyBorrowers({
      lcd,
      custody: "custody",
      startAfter,
      limit,
    })(addressProvider);
    await handleQueryCommand(menu, queryBorrowers);
  });

const getConfig = query.command("config").action(async ({}: Config) => {
  const lcd = getLCDClient();
  const addressProvider = new AddressProviderFromJSON(
    resolveChainIDToNetworkName(menu.chainId)
  );
  const queryConfig = await queryCustodyConfig({
    lcd,
    custody: "custody",
  })(addressProvider);
  await handleQueryCommand(menu, queryConfig);
});

export default {
  query,
  menu,
};
