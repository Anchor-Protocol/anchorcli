import { CLIKey } from '@terra-money/terra.js/dist/key/CLIKey';
import {
  createExecMenu,
  createQueryMenu,
  getLCDClient,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';
import {
  fabricatebEthSend,
  fabricatebEthBurnFrom,
  fabricatebEthDecreaseAllowance,
  fabricatebEthIncreaseAllowance,
  fabricatebEthSendFrom,
  fabricatebEthTransferFrom,
  queryTokenAllAccounts,
  queryTokenBalance,
  queryTokenMinter,
  queryTokenAllowances,
  queryTokenInfo,
  fabricatebEthBurn,
  fabricatebEthTransfer,
} from '@anchor-protocol/anchor.js';
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from '../../addresses/from-json';
import * as Parse from '../../util/parse-input';
import { queryTokenAllowance } from '@anchor-protocol/anchor.js/dist/queries/cw20/token-allowance';
import accAddress = Parse.accAddress;
import int = Parse.int;

const menu = createExecMenu(
  'beth-token',
  'Anchor bEth token contract functions',
);

interface Transfer {
  amount: string;
  recipient: string;
}

const transfer = menu
  .command('transfer')
  .description('Transfer bEth to other users')
  .requiredOption('--amount <string>', 'Amount to send to recipient')
  .requiredOption('--recipient <AccAddress>', 'Recipient address')
  .action(async ({ amount, recipient }: Transfer) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msg = fabricatebEthTransfer({
      address: userAddress,
      amount: amount,
      recipient: accAddress(recipient),
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

interface TransferFrom {
  amount: string;
  recipient: string;
  owner: string;
}
const transferFrom = menu
  .command('transfer-from')
  .description("Transfer bEth to other users from the user's allowance")
  .requiredOption('--owner <AccAddress>', 'Address of the owner of allowance')
  .requiredOption('--amount <string>', 'Amount to transfer')
  .requiredOption('--recipient <AccAddress>', 'Recipient address')
  .action(async ({ amount, recipient, owner }: TransferFrom) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msg = fabricatebEthTransferFrom({
      address: userAddress,
      amount: amount,
      recipient: accAddress(recipient),
      owner: accAddress(owner),
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

interface Send {
  amount: string;
  contract: string;
  msg?: string;
}

const send = menu
  .command('send')
  .description('Send bEth to a contract')
  .requiredOption('--amount <string>', 'Amount of asset to send')
  .requiredOption('--contract <AccAddress>', 'contract recipient')
  .option('--msg <json>', 'string of JSON Receive hook to run')
  .action(async ({ amount, contract, msg }: Send) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const message = fabricatebEthSend({
      address: userAddress,
      amount: amount,
      contract: accAddress(contract),
      msg: JSON.parse(msg),
    })(addressProvider);
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
  .description("Send bEth to a contract from the user's allowance")
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
    const message = fabricatebEthSendFrom({
      address: userAddress,
      amount: amount,
      contract: accAddress(contract),
      owner: accAddress(owner),
      msg: JSON.parse(msg),
    })(addressProvider);
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
    const msg = fabricatebEthBurn({
      address: userAddress,
      amount: amount,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

interface BurnFrom {
  amount: string;
  owner: string;
}

const burnFrom = menu
  .command('burn-from')
  .description("burn bEth from the user's allowance")
  .requiredOption('--owner <AccAddress>', 'Account to burn from')
  .requiredOption('--amount <string>', 'Amount of asset to burn')
  .action(async ({ amount, owner }: BurnFrom) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msg = fabricatebEthBurnFrom({
      address: userAddress,
      amount: amount,
      owner: accAddress(owner),
    })(addressProvider);
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
  .description("burn bEth from the user's allowance")
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

      const msg = fabricatebEthIncreaseAllowance({
        address: userAddress,
        amount: amount,
        spender: accAddress(spender),
        expires: expiry,
      })(addressProvider);
      await handleExecCommand(menu, msg);
    },
  );

const decreaseAllowance = menu
  .command('decrease-allowance')
  .description("burn bEth from the user's allowance")
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

      const msg = fabricatebEthDecreaseAllowance({
        address: userAddress,
        amount: amount,
        spender: spender,
        expires: expiry,
      })(addressProvider);
      await handleExecCommand(menu, msg);
    },
  );

const query = createQueryMenu(
  'beth-token',
  'Anchor bEth token  contract queries',
);

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
      token_address: addressProvider.addressesMap.bEthToken,
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
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const balance_query = await queryTokenBalance({
      lcd: lcd,
      token_address: addressProvider.addressesMap.bEthToken,
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
      token_address: addressProvider.addressesMap.bEthToken,
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
      token_address: addressProvider.addressesMap.bEthToken,
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
  .option('--start-after <int>', 'Address of bEth holder to start query')
  .option('--limit <int>', 'Maximum number of query entries')
  .action(async ({ owner, startAfter, limit }: AllAllowances) => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const batch_query = await queryTokenAllowances({
      lcd: lcd,
      token_address: addressProvider.addressesMap.bEthToken,
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
  .option(
    '--start-after <AccAddress>',
    'Address of bEth holder to start query',
  )
  .option('--limit <int>', 'Maximum number of query entries')
  .action(async ({ startAfter, limit }: AllAccounts) => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const batch_query = await queryTokenAllAccounts({
      lcd: lcd,
      token_address: addressProvider.addressesMap.bEthToken,
      start_after: accAddress(startAfter),
      limit: int(limit),
    })(addressProvider);
    await handleQueryCommand(query, batch_query);
  });

export default {
  query,
  menu,
};
