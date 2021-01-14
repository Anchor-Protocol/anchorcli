import { createExecMenu, handleExecCommand } from "../../util/contract-menu";
import { AddressProviderFromEnvVar } from "../../anchor-js/address-provider";
import { CLIKey } from "@terra-money/terra.js/dist/key/CLIKey";
import { fabricatebCustodyConfig } from "../../anchor-js/fabricators";
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from "../../addresses/from-json";

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

//TODO: add queries

export default {
  menu,
};
