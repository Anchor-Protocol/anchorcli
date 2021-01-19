import { CLIKey } from "@terra-money/terra.js/dist/key/CLIKey";
import {
  createExecMenu,
  createQueryMenu,
  getLCDClient,
  handleExecCommand,
  handleQueryCommand,
} from "../../util/contract-menu";
import { fabricatebAssetClaim } from "../../anchor-js/fabricators";
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from "../../addresses/from-json";
import {
  queryRewardConfig,
  queryRewardHolder,
  queryRewardHolders,
  queryRewardState,
} from "../../anchor-js/queries";
import { queryRewardAccrued } from "../../anchor-js/queries";

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

const getConfig = query
  .command("config")
  .description("Get the contract configuration of bLuna Reward")
  .action(async () => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const config_query = await queryRewardConfig({ lcd: lcd, bAsset: "bluna" })(
      addressProvider
    );
    await handleQueryCommand(query, config_query);
  });

const getState = query
  .command("state")
  .description("Get information about the current state")
  .action(async () => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const config_query = await queryRewardState({ lcd: lcd, bAsset: "bluna" })(
      addressProvider
    );
    await handleQueryCommand(query, config_query);
  });

interface AccruedRewards {
  address: string;
}

const getAccruedRewards = query
  .command("accrued-rewards")
  .description(
    "Get the amount of rewards accrued to the specified bLuna holder"
  )
  .option("--address <AccAddress>", "Address of user")
  .action(async ({ address }: AccruedRewards) => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const batch_query = await queryRewardAccrued({
      lcd: lcd,
      bAsset: "bluna",
      address: address,
    })(addressProvider);
    await handleQueryCommand(query, batch_query);
  });

const getHolder = query
  .command("holder")
  .description("Get information about the specified bLuna holder")
  .option("--address <AccAddress>", "Address of user")
  .action(async ({ address }: AccruedRewards) => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const batch_query = await queryRewardHolder({
      lcd: lcd,
      bAsset: "bluna",
      address: address,
    })(addressProvider);
    await handleQueryCommand(query, batch_query);
  });

interface AllHistory {
  startAfter?: string;
  limit?: number;
}

const getHolders = query
  .command("holders")
  .description("Get information about all bLuna holders")
  .option("--start-after <int>", "Address of bLuna holder to start query")
  .option("--limit <int>", "Maximum number of query entries")
  .action(async ({ startAfter, limit }: AllHistory) => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const batch_query = await queryRewardHolders({
      lcd: lcd,
      bAsset: "bluna",
      startAfter: startAfter,
      lim: +limit,
    })(addressProvider);
    await handleQueryCommand(query, batch_query);
  });

//TODO: Add queries
export default {
  query,
  menu,
};
