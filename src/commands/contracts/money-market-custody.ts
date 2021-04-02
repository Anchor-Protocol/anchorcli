import {
  createExecMenu,
  createQueryMenu,
  getLCDClient,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';
import { CLIKey } from '@terra-money/terra.js/dist/key/CLIKey';
import {
  COLLATERAL_DENOMS,
  fabricateCustodyDepositCollateral,
  fabricateCustodyUpdateConfig,
  fabricateCustodyWithdrawCollateral,
  MARKET_DENOMS,
  queryCustodyBorrower,
  queryCustodyBorrowers,
  queryCustodyConfig,
} from '@anchor-protocol/anchor.js';
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from '../../addresses/from-json';
import * as Parse from '../../util/parse-input';
import accAddress = Parse.accAddress;
import int = Parse.int;

const menu = createExecMenu(
  'custody-bluna',
  'Anchor MoneyMarket Custody contract functions',
);

interface Config {
  liquidationContract?: string;
  owner?: string;
}

const updateConfig = menu
  .command('update-config')
  .description('Updates the configuration of the Custody contract')
  .option(
    '--liquidation-contract <AccAddress>',
    'New contract address of Liquidation Contract',
  )
  .option('--owner <AccAddress>', 'New Owner of the contract')
  .action(async ({ liquidationContract, owner }: Config) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msg = fabricateCustodyUpdateConfig({
      address: userAddress,
      market: MARKET_DENOMS.UUSD,
      collateral: COLLATERAL_DENOMS.UBLUNA,
      liquidation_contract: accAddress(liquidationContract),
      owner: accAddress(owner),
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

interface Withdraw {
  amount?: string;
}

const withdraw_collateral = menu
  .command('withdraw-collateral')
  .description('Withdraw specified amount of spendable collateral')
  .requiredOption('--amount <string>', 'Amount of collateral to withdraw')
  .action(async ({ amount }: Withdraw) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );

    const msg = fabricateCustodyWithdrawCollateral({
      address: userAddress,
      market: MARKET_DENOMS.UUSD,
      collateral: COLLATERAL_DENOMS.UBLUNA,
      amount: amount,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

interface Deposit {
  amount: string;
}

const deposit_collateral = menu
  .command('deposit-collateral')
  .requiredOption('--amount <string>', 'Amount of collateral to deposit')
  .action(async ({ amount }: Deposit) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    const msg = fabricateCustodyDepositCollateral({
      address: userAddress,
      market: MARKET_DENOMS.UUSD,
      collateral: COLLATERAL_DENOMS.UBLUNA,
      amount: amount,
    })(addressProvider);

    await handleExecCommand(menu, msg);
  });

const query = createQueryMenu(
  'custody-bluna',
  'Anchor custody contract queries',
);

interface Borrower {
  address: string;
}

const getBorrower = query
  .command('borrower')
  .description('Get the collateral balance of the specified borrower')
  .requiredOption(
    '--address <AccAddress>',
    'Address of borrower that deposited collateral',
  )
  .action(async ({ address }: Borrower) => {
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const lcd = getLCDClient(query.chainId);
    const queryBorrower = await queryCustodyBorrower({
      lcd,
      market: MARKET_DENOMS.UUSD,
      custody: COLLATERAL_DENOMS.UBLUNA,
      address: accAddress(address),
    })(addressProvider);
    await handleQueryCommand(query, queryBorrower);
  });

interface Borrowers {
  startAfter?: string;
  limit?: string;
}

const getBorrowers = query
  .command('borrowers')
  .description('Get the collateral balance of all borrowers')
  .option('--start-after <AccAddress>', 'Borrower address to start query')
  .option('--limit <int>', 'Maximum number of query entries')
  .action(async ({ startAfter, limit }: Borrowers) => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const queryBorrowers = await queryCustodyBorrowers({
      lcd,
      market: MARKET_DENOMS.UUSD,
      collateral: COLLATERAL_DENOMS.UBLUNA,
      start_after: accAddress(startAfter),
      limit: int(limit),
    })(addressProvider);
    await handleQueryCommand(query, queryBorrowers);
  });

const getConfig = query
  .command('config')
  .description('Get the contract configuration of the Custody contract')
  .action(async () => {
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const queryConfig = await queryCustodyConfig({
      lcd,
      market: MARKET_DENOMS.UUSD,
      collateral: COLLATERAL_DENOMS.UBLUNA,
    })(addressProvider);
    await handleQueryCommand(query, queryConfig);
  });

export default {
  query,
  menu,
};
