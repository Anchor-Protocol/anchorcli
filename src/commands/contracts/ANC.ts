import { CLIKey } from '@terra-money/terra.js/dist/key/CLIKey';
import {
  createExecMenu,
  createQueryMenu,
  getLCDClient,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';
import {
  fabricateCw20Burn,
  fabricateCw20BurnFrom,
  fabricateCw20DecreaseAllowance,
  fabricateCw20IncreaseAllowance,
  fabricateCw20Send,
  fabricateCw20SendFrom,
  fabricateCw20Transfer,
  fabricateCw20TransferFrom,
  queryTokenAllAccounts,
  queryTokenAllowances,
  queryTokenBalance,
  queryTokenInfo,
  queryTokenMinter,
} from '@anchor-protocol/anchor.js';
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from '../../addresses/from-json';
import * as Parse from '../../util/parse-input';
import { queryTokenAllowance } from '@anchor-protocol/anchor.js/dist/queries/cw20/token-allowance';
import accAddress = Parse.accAddress;
import int = Parse.int;

const menu = createExecMenu('anc', 'Anchor ANC token contract functions');

interface Transfer {
  amount: string;
  recipient: string;
}

const transfer = menu
  .command('transfer')
  .description('Transfer ANC to other users')
  .requiredOption('--amount <string>', 'Amount to send to recipient')
  .requiredOption('--recipient <AccAddress>', 'Recipient address')
  .action(async ({ amount, recipient }: Transfer) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msg = fabricateCw20Transfer({
      address: userAddress,
      contract_address: addressProvider.addressesMap.ANC,
      amount: amount,
      recipient: accAddress(recipient),
    });

    await handleExecCommand(menu, msg);
  });

interface TransferFrom {
  amount: string;
  recipient: string;
  owner: string;
}
const transferFrom = menu
  .command('transfer-from')
  .description("Transfer ANC to other users from the user's allowance")
  .requiredOption('--owner <AccAddress>', 'Address of the owner of allowance')
  .requiredOption('--amount <string>', 'Amount to transfer')
  .requiredOption('--recipient <AccAddress>', 'Recipient address')
  .action(async ({ amount, recipient, owner }: TransferFrom) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msg = fabricateCw20TransferFrom({
      address: userAddress,
      contract_address: addressProvider.addressesMap.ANC,
      amount: amount,
      recipient: accAddress(recipient),
      owner: accAddress(owner),
    });
    await handleExecCommand(menu, msg);
  });

interface Send {
  amount: string;
  contract: string;
  msg?: string;
}

const send = menu
  .command('send')
  .description('Send ANC to a contract')
  .requiredOption('--amount <string>', 'Amount of asset to send')
  .requiredOption('--contract <AccAddress>', 'contract recipient')
  .option('--msg <json>', 'string of JSON Receive hook to run')
  .action(async ({ amount, contract, msg }: Send) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const message = fabricateCw20Send({
      address: userAddress,
      contract_address: addressProvider.addressesMap.ANC,
      amount: amount,
      contract: accAddress(contract),
      msg: msg ? JSON.parse(msg) : msg,
    });
    await handleExecCommand(menu, message);
  });

interface SendFrom {
  amount: string;
  owner: string;
  contract: string;
  msg?: string;
}
const sendFrom = menu
  .command('send-from')
  .description("Send ANC to a contract from the user's allowance")
  .requiredOption('--owner <AccAddress>', 'owner to spend from')
  .requiredOption('--amount <string>', 'Amount of asset to send')
  .requiredOption('--contract <AccAddress>', 'contract recipient')
  .option('--msg <json>', 'string of JSON Receive hook to run')
  .action(async ({ amount, owner, contract, msg }: SendFrom) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const message = fabricateCw20SendFrom({
      address: userAddress,
      contract_address: addressProvider.addressesMap.ANC,
      amount: amount,
      contract: accAddress(contract),
      owner: accAddress(owner),
      msg: msg ? JSON.parse(msg) : msg,
    });
    await handleExecCommand(menu, message);
  });

interface Unbond {
  amount: string;
}
const burn = menu
  .command('burn')
  .description('Burn corresponding amount of asset')
  .requiredOption('--amount <string>', 'The amount for burn')
  .action(async ({ amount }: Unbond) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msg = fabricateCw20Burn({
      address: userAddress,
      contract_address: addressProvider.addressesMap.ANC,
      amount: amount,
    });
    await handleExecCommand(menu, msg);
  });

interface BurnFrom {
  amount: string;
  owner: string;
}

const burnFrom = menu
  .command('burn-from')
  .description("Burn ANC from the user's allowance")
  .requiredOption('--owner <AccAddress>', 'Account to burn from')
  .requiredOption('--amount <string>', 'Amount of asset to burn')
  .action(async ({ amount, owner }: BurnFrom) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msg = fabricateCw20BurnFrom({
      address: userAddress,
      contract_address: addressProvider.addressesMap.ANC,
      amount: amount,
      owner: accAddress(owner),
    });
    await handleExecCommand(menu, msg);
  });

type Expire = { at_height: number } | { at_time: number } | { never: {} };

interface Allowance {
  amount: string;
  spender: string;
  expiryHeight?: string;
  expiryTime?: string;
  expiryNever?: string;
}

const increaseAllowance = menu
  .command('increase-allowance')
  .description("Burn ANC from the user's allowance")
  .requiredOption('--spender <AccAddress>', 'Spender address')
  .requiredOption('--amount <string>', 'Amount to increase')
  .option('--expiry-height <int>', 'block height expiration of allowance')
  .option('--expiry-time <int>', 'time expiration of allowance (seconds)')
  .option('--expiry-never', 'never expires')
  .action(
    async ({
      amount,
      spender,
      expiryHeight,
      expiryTime,
      expiryNever,
    }: Allowance) => {
      const key = new CLIKey({ keyName: menu.from });
      const userAddress = key.accAddress;
      const addressProvider = new AddressProviderFromJSON(
        resolveChainIDToNetworkName(menu.chainId),
      );
      let expiry: Expire;
      if (
        +!!increaseAllowance.expiryHeight +
          +!!increaseAllowance.expiryTime +
          +!!increaseAllowance.expiryNever >=
        2
      ) {
        throw new Error(
          `can only use one option of --expiry-height, --expiry-time, --expiry-never`,
        );
      }

      if (increaseAllowance.expiryHeight) {
        expiry = {
          at_height: Parse.int(expiryHeight),
        };
      }

      if (increaseAllowance.expiryTime) {
        expiry = {
          at_time: Parse.int(expiryTime),
        };
      }

      if (expiryNever) {
        expiry = {
          never: {},
        };
      }

      const msg = fabricateCw20IncreaseAllowance({
        address: userAddress,
        contract_address: addressProvider.addressesMap.ANC,
        amount: amount,
        spender: accAddress(spender),
        expires: expiry,
      });
      await handleExecCommand(menu, msg);
    },
  );

const decreaseAllowance = menu
  .command('decrease-allowance')
  .description("burn ANC from the user's allowance")
  .requiredOption('--spender <AccAddress>', 'Spender address')
  .requiredOption('--amount <string>', 'Amount to increase')
  .option('--expiry-height <int>', 'block height expiration of allowance')
  .option('--expiry-time <int>', 'time expiration of allowance (seconds)')
  .option('--expiry-never', 'never expires')
  .action(
    async ({
      amount,
      spender,
      expiryHeight,
      expiryTime,
      expiryNever,
    }: Allowance) => {
      const key = new CLIKey({ keyName: menu.from });
      const userAddress = key.accAddress;
      const addressProvider = new AddressProviderFromJSON(
        resolveChainIDToNetworkName(menu.chainId),
      );

      let expiry: Expire;
      if (
        +!!decreaseAllowance.expiryHeight +
          +!!decreaseAllowance.expiryTime +
          +!!decreaseAllowance.expiryNever >=
        2
      ) {
        throw new Error(
          `can only use one option of --expiry-height, --expiry-time, --expiry-never`,
        );
      }

      if (decreaseAllowance.expiryHeight) {
        expiry = {
          at_height: Parse.int(expiryHeight),
        };
      }

      if (decreaseAllowance.expiryTime) {
        expiry = {
          at_time: Parse.int(expiryTime),
        };
      }

      if (expiryNever) {
        expiry = {
          never: {},
        };
      }

      const msg = fabricateCw20DecreaseAllowance({
        address: userAddress,
        contract_address: addressProvider.addressesMap.ANC,
        amount: amount,
        spender: accAddress(spender),
        expires: expiry,
      });
      await handleExecCommand(menu, msg);
    },
  );

const query = createQueryMenu('anc', 'Anchor ANC token contract queries');

const getTokenInfo = query
  .command('token-info')
  .description('Get information about the token')
  .action(async () => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const query_token = await queryTokenInfo({
      lcd: lcd,
      token_address: addressProvider.addressesMap.ANC,
    })(addressProvider);
    await handleQueryCommand(query, query_token);
  });

interface Balance {
  address: string;
}

const getBalance = query
  .command('balance')
  .description('Get the current balance of the address')
  .requiredOption('--address <AccAddress>', 'Address of user')
  .action(async ({ address }: Balance) => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const balance_query = await queryTokenBalance({
      lcd: lcd,
      token_address: addressProvider.addressesMap.ANC,
      address: accAddress(address),
    })(addressProvider);
    await handleQueryCommand(query, balance_query);
  });

const getMinter = query
  .command('minter')
  .description('Get who can mint and how much')
  .action(async () => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const query_minter = await queryTokenMinter({
      lcd: lcd,
      token_address: addressProvider.addressesMap.ANC,
    })(addressProvider);
    await handleQueryCommand(query, query_minter);
  });

interface AllowanceArgs {
  owner: string;
  spender: string;
}
const getAllowance = query
  .command('allowance')
  .description('Get how much spender can use from owner account')
  .requiredOption('--owner <AccAddress>', 'Address of owner')
  .requiredOption('--spender <AccAddress>', 'Address of spender')
  .action(async ({ owner, spender }: AllowanceArgs) => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const allowance_query = await queryTokenAllowance({
      lcd: lcd,
      token_address: addressProvider.addressesMap.ANC,
      owner: accAddress(owner),
      spender: accAddress(spender),
    })(addressProvider);
    await handleQueryCommand(query, allowance_query);
  });

interface AllAllowances {
  owner: string;
  startAfter?: string;
  limit?: string;
}

const getAllowances = query
  .command('all-allowances')
  .description('Get all allowances this owner has approved')
  .requiredOption('--owner <AccAddress>', 'Address of the owner')
  .option('--start-after <int>', 'Address of ANC holder to start query')
  .option('--limit <int>', 'Maximum number of query entries')
  .action(async ({ owner, startAfter, limit }: AllAllowances) => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const batch_query = await queryTokenAllowances({
      lcd: lcd,
      token_address: addressProvider.addressesMap.ANC,
      owner: accAddress(owner),
      start_after: startAfter,
      lim: int(limit),
    })(addressProvider);
    await handleQueryCommand(query, batch_query);
  });

interface AllAccounts {
  startAfter?: string;
  limit?: string;
}

const getAccounts = query
  .command('all-accounts')
  .description('Get all accounts that have balances')
  .option('--start-after <AccAddress>', 'Address of ANC holder to start query')
  .option('--limit <int>', 'Maximum number of query entries')
  .action(async ({ startAfter, limit }: AllAccounts) => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const batch_query = await queryTokenAllAccounts({
      lcd: lcd,
      token_address: addressProvider.addressesMap.ANC,
      start_after: accAddress(startAfter),
      limit: int(limit),
    })(addressProvider);
    await handleQueryCommand(query, batch_query);
  });

export default {
  query,
  menu,
};
