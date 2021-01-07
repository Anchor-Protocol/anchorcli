import { CLIKey } from "@terra-money/terra.js/dist/key/CLIKey";
import { AddressProviderFromEnvVar } from "../../anchor-js/address-provider";
import { createExecMenu, handleExecCommand } from "../../util/contract-menu";
import { fabricatebAssetClaim } from "../../anchor-js/fabricators";

const mockAddressProvider = new AddressProviderFromEnvVar();
const menu = createExecMenu(
  "basset-reward",
  "Anchor bAsset reward contract functions"
);

interface Claim {
  recipient: string;
}
const claim = menu
  .requiredOption("--recipient <recipient>", "Address of the receiver")
  .action(async ({ recipient }: Claim) => {
    const key = new CLIKey({ keyName: claim.from });
    const userAddress = key.accAddress;
    const msg = fabricatebAssetClaim({
      address: userAddress,
      recipient: recipient,
      bAsset: "bluna",
    })(mockAddressProvider);
      await handleExecCommand(menu, msg)
  });

//TODO: Add queries
export default {
  menu,
};
