import { CLIKey } from "@terra-money/terra.js/dist/key/CLIKey";

import {
  createExecMenu,
  createQueryMenu,
  getLCDClient,
  handleExecCommand,
  handleQueryCommand,
} from "../../util/contract-menu";
import {
  fabricatebMarketConfig,
  fabricateBorrow,
  fabricateDepositStableCoin,
  fabricateRedeemStable,
  fabricateRepay,
} from "../../anchor-js/fabricators";
import { Dec } from "@terra-money/terra.js";
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from "../../addresses/from-json";
import {
  queryMarketConfig,
  queryMarketEpochState,
  queryMarketLiabilities,
  queryMarketLiability,
  queryMarketLoanAmount,
  queryMarketState,
} from "../../anchor-js/queries";
import { Parse } from "../../util/parse-input";
import accAddress = Parse.accAddress;

const menu = createExecMenu(
  "market",
  "Anchor MoneyMarket Market contract functions"
);

interface BorrowStable {
  amount: number;
  to?: string;
}
const borrowStable = menu
  .command("borrow-stable")
  .description("Borrow stable coins from Anchor")
  .requiredOption("--amount <string>", "Amount of stablecoins to borrow")
  .option("--to <string>", "Withdrawal address for borrowed stablecoins")
  .action(async ({ amount, to }: BorrowStable) => {
    const key = new CLIKey({ keyName: borrowStable.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const msg = fabricateBorrow({
      address: userAddress,
      market: "market",
      amount: amount,
      withdrawTo: to,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

const depositStable = menu
  .command("deposit-stable")
  .description("Deposits stable coins to Anchor")
  .requiredOption("--amount <string>", "Amount of stable coins to borrow")
  .action(async () => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const msg = fabricateDepositStableCoin({
      address: userAddress,
      symbol: "market",
      amount: depositStable.amount,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

const redeemStable = menu
  .command("redeem-stable")
  .description("Redeems aTokens to their underlying stable coins")
  .requiredOption("--amount <string>", "Amount for redeem")
  .action(async ({ amount }) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const msg = fabricateRedeemStable({
      address: userAddress,
      symbol: "market",
      amount: amount,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

const repay = menu
  .command("repay-stable")
  .description("Repay previous stable coin liability")
  .requiredOption("--amount <string>", "Amount stable coin to send beforehand")
  .action(async ({ amount }) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const msg = fabricateRepay({
      address: userAddress,
      market: "market",
      amount: amount,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

interface Config {
  ownerAddress?: string;
  interestModel?: string;
  reserveFactor?: Dec;
}
const updateConfig = menu
  .command("update-config")
  .description("Update the configuration of the contract")
  .option("--owner-address <AccAddress>", "Address of new owner")
  .option(
    "--reserve-factor <Dec>",
    "New portion of borrower interest set aside as reserves"
  )
  .option("--interest-model <string>", "New interest model contract address")
  .action(async ({ ownerAddress, interestModel, reserveFactor }: Config) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const msg = fabricatebMarketConfig({
      address: userAddress,
      owner_addr: ownerAddress,
      interest_model: interestModel,
      reserve_factor: reserveFactor,
      market: "market",
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

const query = createQueryMenu("market", "Anchor market contract queries");

const getConfig = query
  .command("config")
  .description("Get the Market contract configuration")
  .action(async ({}: Config) => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId)
    );
    const queryConfig = await queryMarketConfig({
      lcd,
      market: "market",
    })(addressProvider);
    await handleQueryCommand(query, queryConfig);
  });

interface EpochState {
  blockHeight?: number;
}

const getEpochState = query
  .command("epoch-state")
  .description(
    "Get state information related to epoch operations. Returns the interest-accrued block_height field is filled. Returns the stored (no interest accrued) state if not filled"
  )
  .option("--block-height <int>", "Current block number")
  .action(async ({ blockHeight }: EpochState) => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId)
    );
    const queryEpochState = await queryMarketEpochState({
      lcd,
      market: "market",
      blockHeight,
    })(addressProvider);
    await handleQueryCommand(query, queryEpochState);
  });

interface Liabilities {
  startAfter?: string;
  limit?: number;
}

const getLiabilities = query
  .command("liabilities")
  .description("Get liability information for all borrowers")
  .option("--start-after <AccAddress>", "Borrower address to start query")
  .option("--limit <int>", "Maximum number of entries to query")
  .action(async ({ startAfter, limit }: Liabilities) => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId)
    );
    const queryLiabilities = await queryMarketLiabilities({
      lcd,
      market: "market",
      startAfter: accAddress(startAfter),
      limit,
    })(addressProvider);
    await handleQueryCommand(query, queryLiabilities);
  });

interface Liability {
  borrower: string;
}

const getLiability = query
  .command("liability")
  .description("Get liability information for the specified borrower")
  .requiredOption("--borrower <AccAddress>", "Address of borrower")
  .action(async ({ borrower }: Liability) => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId)
    );
    const queryLiability = await queryMarketLiability({
      lcd,
      market: "market",
      borrower: accAddress(borrower),
    })(addressProvider);
    await handleQueryCommand(query, queryLiability);
  });

interface LoanAmount {
  borrower: string;
  blockHeight: number;
}

const getLoanAmount = query
  .command("loan-amount")
  .description(
    "Get the liability amount for the specified borrower at the specified block number"
  )
  .requiredOption("--borrower <AccAddress>", "Address of borrower")
  .requiredOption(
    "--block-height <int>",
    "Block number to apply in calculation"
  )
  .action(async ({ borrower, blockHeight }: LoanAmount) => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const queryLoanAmount = await queryMarketLoanAmount({
      lcd,
      market: "market",
      borrower: accAddress(borrower),
      blockHeight,
    })(addressProvider);
    await handleQueryCommand(query, queryLoanAmount);
  });

const getState = query
  .command("state")
  .description("Get information related to the overall state of Market")
  .action(async () => {
    const lcd = getLCDClient();
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId)
    );
    const queryState = await queryMarketState({
      lcd,
      market: "market",
    })(addressProvider);
    await handleQueryCommand(query, queryState);
  });

export default {
  query,
  menu,
};
