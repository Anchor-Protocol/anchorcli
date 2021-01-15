import { CLIKey } from "@terra-money/terra.js/dist/key/CLIKey";
import { AddressProviderFromEnvVar } from "../../anchor-js/address-provider";
import {
  createExecMenu,
  createQueryMenu,
  handleExecCommand,
} from "../../util/contract-menu";
import { fabricatebAssetClaim } from "../../anchor-js/fabricators";
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from "../../addresses/from-json";

const menu = createExecMenu(
  "basset-reward",
  "Anchor bAsset reward contract functions"
);

interface Claim {
  recipient: string;
}
const claim = menu
  .command("claim-rewards")
  .description("Claims basset holder's accrued rewards")
  .requiredOption("--recipient <AccAddress>", "Address of the receiver")
  .action(async ({ recipient }: Claim) => {
    const key = new CLIKey({ keyName: claim.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const msg = fabricatebAssetClaim({
      address: userAddress,
      recipient: recipient,
      bAsset: "bluna",
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

const query = createQueryMenu(
  "basset-reward",
  "Anchor bAsset reward contract queries"
);

//TODO: Add queries
export default {
  query,
  menu,
};
