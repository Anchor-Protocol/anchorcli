import { CLIKey } from "@terra-money/terra.js/dist/key/CLIKey";
import { AddressProviderFromEnvVar } from "../../anchor-js/address-provider";
import { createExecMenu, handleExecCommand } from "../../util/contract-menu";
import {
  fabricatebAssetBurnFrom,
  fabricatebAssetdDecreaseAllowance,
  fabricatebAssetIncreaseAllowance,
  fabricatebAssetSendFrom,
  fabricatebAssetTransfer,
  fabricatebAssetTransferFrom,
} from "../../anchor-js/fabricators";
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from "../../addresses/from-json";

const menu = createExecMenu(
  "basset-token",
  "Anchor bAsset token contract functions"
);

interface Transfer {
  amount: string;
  recipient: string;
}

const transfer = menu
  .command("transfer")
  .description("Transfer bAsset to other users")
  .requiredOption("--amount <string>", "Amount to send to recipient")
  .requiredOption("--recipient <AccAddress>", "Recipient address")
  .action(async ({ amount, recipient }: Transfer) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const msg = fabricatebAssetTransfer({
      address: userAddress,
      amount: amount,
      recipient: recipient,
      bAsset: "bluna",
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

interface TransferFrom {
  amount: string;
  recipient: string;
  owner: string;
}
const transferFrom = menu
  .command("transfer-from")
  .description("Transfer bAsset to other users from the user's allowance")
  .requiredOption("--owner <AccAddress>", "Address of the owner of allowance")
  .requiredOption("--amount <string>", "Amount to transfer")
  .requiredOption("--recipient <AccAddress>", "Recipient address")
  .action(async ({ amount, recipient, owner }: TransferFrom) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const msg = fabricatebAssetTransferFrom({
      address: userAddress,
      amount: amount,
      recipient: recipient,
      bAsset: "bluna",
      owner: owner,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

// TODO: add send
// send depends on send in anchor js

interface SendFrom {
  amount: string;
  owner: string;
  contract: string;
  msg?: string;
}
const sendFrom = menu
  .command("send-from")
  .description("Send bAsset to a contract from the user's allowance")
  .requiredOption("--owner <AccAddress>")
  .requiredOption("--amount <string>")
  .requiredOption("--recipient <AccAddress>")
  .action(async ({ amount, owner, contract, msg }: SendFrom) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const message = fabricatebAssetSendFrom({
      address: userAddress,
      amount: amount,
      bAsset: "bluna",
      contract: contract,
      owner: owner,
      msg: Buffer.from(JSON.stringify(msg)).toString("base64"),
    })(addressProvider);
    await handleExecCommand(menu, message);
  });

interface BurnFrom {
  amount: string;
  owner: string;
}

const burnFrom = menu
  .command("burn-from")
  .description("burn bAsset from the user's allowance")
  .requiredOption("--owner <AccAddress>")
  .requiredOption("--amount <string>")
  .action(async ({ amount, owner }: BurnFrom) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const msg = fabricatebAssetBurnFrom({
      address: userAddress,
      amount: amount,
      bAsset: "bluna",
      owner: owner,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

type Expire = { at_height: number } | { at_time: number } | { never: {} };

interface Allowance {
  amount: string;
  spender: string;
  expires?: Expire;
}

const increaseAllowance = menu
  .command("increase-allowance")
  .description("burn bAsset from the user's allowance")
  .requiredOption("--sepender <AccAddress>", "Spender address")
  .requiredOption("--amount <string>", "Amount to increase")
  .option("--expires <json>", "Expires at")
  .action(async ({ amount, spender, expires }: Allowance) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const msg = fabricatebAssetIncreaseAllowance({
      address: userAddress,
      amount: amount,
      bAsset: "bluna",
      spender: spender,
      expires: expires,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

const decreaseAllowance = menu
  .command("decrease-allowance")
  .description("burn bAsset from the user's allowance")
  .requiredOption("--sepender <AccAddress>", "Spender address")
  .requiredOption("--amount <string>", "Amount to increase")
  .option("--expires <json>", "Expires at")
  .action(async ({ amount, spender, expires }: Allowance) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const msg = fabricatebAssetdDecreaseAllowance({
      address: userAddress,
      amount: amount,
      bAsset: "bluna",
      spender: spender,
      expires: expires,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

//TODO: add queries

export default {
  menu,
};
