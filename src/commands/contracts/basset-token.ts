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

const mockAddressProvider = new AddressProviderFromEnvVar();
const menu = createExecMenu(
  "basset-token",
  "Anchor bAsset token contract functions"
);

interface Transfer {
  amount: string;
  recipient: string;
}

const transfer = menu
  .description("Transfer bAsset to other users")
  .requiredOption("--amount <amount>")
  .requiredOption("--recipient <recipient>")
  .action(async ({ amount, recipient }: Transfer) => {
    const key = new CLIKey({ keyName: transfer.from });
    const userAddress = key.accAddress;
    const msg = fabricatebAssetTransfer({
      address: userAddress,
      amount: amount,
      recipient: recipient,
      bAsset: "bluna",
    })(mockAddressProvider);
    await handleExecCommand(menu, msg);
  });

interface TransferFrom {
  amount: string;
  recipient: string;
  owner: string;
}
const transferFrom = menu
  .description("Transfer bAsset to other users from the user's allowance")
  .requiredOption("--owner <owner>")
  .requiredOption("--amount <amount>")
  .requiredOption("--recipient <recipient>")
  .action(async ({ amount, recipient, owner }: TransferFrom) => {
    const key = new CLIKey({ keyName: transferFrom.from });
    const userAddress = key.accAddress;
    const msg = fabricatebAssetTransferFrom({
      address: userAddress,
      amount: amount,
      recipient: recipient,
      bAsset: "bluna",
      owner: owner,
    })(mockAddressProvider);
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
  .description("Send bAsset to a contract from the user's allowance")
  .requiredOption("--owner <owner>")
  .requiredOption("--amount <amount>")
  .requiredOption("--recipient <recipient>")
  .action(async ({ amount, owner, contract, msg }: SendFrom) => {
    const key = new CLIKey({ keyName: sendFrom.from });
    const userAddress = key.accAddress;
    const message = fabricatebAssetSendFrom({
      address: userAddress,
      amount: amount,
      bAsset: "bluna",
      contract: contract,
      owner: owner,
      msg: msg,
    })(mockAddressProvider);
    await handleExecCommand(menu, message);
  });

interface BurnFrom {
  amount: string;
  owner: string;
}

const burnFrom = menu
  .description("burn bAsset from the user's allowance")
  .requiredOption("--owner <owner>")
  .requiredOption("--amount <amount>")
  .action(async ({ amount, owner }: BurnFrom) => {
    const key = new CLIKey({ keyName: burnFrom.from });
    const userAddress = key.accAddress;
    const msg = fabricatebAssetBurnFrom({
      address: userAddress,
      amount: amount,
      bAsset: "bluna",
      owner: owner,
    })(mockAddressProvider);
    await handleExecCommand(menu, msg);
  });

type Expire = { at_height: number } | { at_time: number } | { never: {} };

interface Allowance {
  amount: string;
  spender: string;
  expires?: Expire;
}

const increaseAllowance = menu
  .description("burn bAsset from the user's allowance")
  .requiredOption("--sepender <owner>", "Spender address")
  .requiredOption("--amount <amount>", "Amount to increase")
  .option("--expires <expires>", "Expires at")
  .action(async ({ amount, spender, expires }: Allowance) => {
    const key = new CLIKey({ keyName: increaseAllowance.from });
    const userAddress = key.accAddress;
    const msg = fabricatebAssetIncreaseAllowance({
      address: userAddress,
      amount: amount,
      bAsset: "bluna",
      spender: spender,
      expires: expires,
    })(mockAddressProvider);
    await handleExecCommand(menu, msg);
  });

const decreaseAllowance = menu
  .description("burn bAsset from the user's allowance")
  .requiredOption("--sepender <owner>", "Spender address")
  .requiredOption("--amount <amount>", "Amount to increase")
  .option("--expires <expires>", "Expires at")
  .action(async ({ amount, spender, expires }: Allowance) => {
    const key = new CLIKey({ keyName: decreaseAllowance.from });
    const userAddress = key.accAddress;
    const msg = fabricatebAssetdDecreaseAllowance({
      address: userAddress,
      amount: amount,
      bAsset: "bluna",
      spender: spender,
      expires: expires,
    })(mockAddressProvider);
    await handleExecCommand(menu, msg);
  });

//TODO: add queries

export default {
  menu,
};
