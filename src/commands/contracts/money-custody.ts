import { createExecMenu, handleExecCommand } from "../../util/contract-menu";
import { AddressProviderFromEnvVar } from "../../anchor-js/address-provider";
import { CLIKey } from "@terra-money/terra.js/dist/key/CLIKey";
import { fabricatebCustodyConfig } from "../../anchor-js/fabricators";

const mockAddressProvider = new AddressProviderFromEnvVar();
const menu = createExecMenu(
  "custody",
  "Anchor MoneyMarket Custody contract functions"
);

interface Config {
  liquidationContract?: string;
}

const updateConfig = menu
  .description("update config")
  .option(
    "--liquidation-contract <AccAddress>",
    "New contract address of Liquidation Contract"
  )
  .action(async ({ liquidationContract }: Config) => {
    const key = new CLIKey({ keyName: updateConfig.from });
    const userAddress = key.accAddress;
    const msg = fabricatebCustodyConfig({
      address: userAddress,
      custody: "custody",
      liquidation_contract: liquidationContract,
    })(mockAddressProvider);
    await handleExecCommand(menu, msg);
  });

//TODO: add queries

export default {
  menu,
};
