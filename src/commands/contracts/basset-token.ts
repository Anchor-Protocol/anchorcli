import { CLIKey } from "@terra-money/terra.js/dist/key/CLIKey";
import {
  createExecMenu,
  createQueryMenu,
  getLCDClient,
  handleExecCommand,
  handleQueryCommand,
} from "../../util/contract-menu";
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
import {
  queryTokenAllAccounts,
  queryTokenAllAllowance,
  queryTokenBalance,
  queryTokenMinter,
} from "../../anchor-js/queries";
import { queryTokenInfo } from "../../anchor-js/queries";
import { queryTokenAllowance } from "../../anchor-js/queries/basset/token-allowance";
import { Parse } from "../../util/parse-input";
import accAddress = Parse.accAddress;

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
  .requiredOption("--spender <AccAddress>", "Spender address")
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

const query = createQueryMenu(
  "basset-token",
  "Anchor bAsset token  contract queries"
);

const getTokenInfo = query
  .command("token-info")
  .description("Get information about the token")
  .action(async () => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId)
    );
    const query_token = await queryTokenInfo({ lcd: lcd, bAsset: "bluna" })(
      addressProvider
    );
    await handleQueryCommand(query, query_token);
  });

interface Balance {
  address: string;
}

const getBalance = query
  .command("balance")
  .description("Get the current balance of the address")
  .option("--address <AccAddress>", "Address of user")
  .action(async ({ address }: Balance) => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const balance_query = await queryTokenBalance({
      lcd: lcd,
      bAsset: "bluna",
      address: accAddress(address),
    })(addressProvider);
    await handleQueryCommand(query, balance_query);
  });

const getMinter = query
  .command("minter")
  .description("Get who can mint and how much")
  .action(async () => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const query_minter = await queryTokenMinter({ lcd: lcd, bAsset: "bluna" })(
      addressProvider
    );
    await handleQueryCommand(query, query_minter);
  });

interface AllowanceArgs {
  owner: string;
  spender: string;
}
const getAllowance = query
  .command("allowance")
  .description("Get how much spender can use from owner account")
  .option("--owner <AccAddress>", "Address of owner")
  .option("--spender <AccAddress>", "Address of spender")
  .action(async ({ owner, spender }: AllowanceArgs) => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId)
    );
    const allowance_query = await queryTokenAllowance({
      lcd: lcd,
      bAsset: "bluna",
      owner: accAddress(owner),
      spender: accAddress(spender),
    })(addressProvider);
    await handleQueryCommand(query, allowance_query);
  });

interface AllAllowances {
  owner: string;
  startAfter?: string;
  limit?: number;
}

const getAllowances = query
  .command("all-allowances")
  .description("Get all allowances this owner has approved")
  .option("--owner <AccAddress>", "Address of the owner")
  .option("--start-after <int>", "Address of bLuna holder to start query")
  .option("--limit <int>", "Maximum number of query entries")
  .action(async ({ owner, startAfter, limit }: AllAllowances) => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId)
    );
    const batch_query = await queryTokenAllAllowance({
      lcd: lcd,
      bAsset: "bluna",
      owner: accAddress(owner),
      startAfter: startAfter,
      lim: +limit,
    })(addressProvider);
    await handleQueryCommand(query, batch_query);
  });

interface AllAccounts {
  startAfter?: string;
  limit?: number;
}

const getAccounts = query
  .command("all-accounts")
  .description("Get all accounts that have balances")
  .option(
    "--start-after <AccAddress>",
    "Address of bLuna holder to start query"
  )
  .option("--limit <int>", "Maximum number of query entries")
  .action(async ({ startAfter, limit }: AllAccounts) => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId)
    );
    const batch_query = await queryTokenAllAccounts({
      lcd: lcd,
      bAsset: "bluna",
      startAfter: accAddress(startAfter),
      lim: +limit,
    })(addressProvider);
    await handleQueryCommand(query, batch_query);
  });

export default {
  query,
  menu,
};
