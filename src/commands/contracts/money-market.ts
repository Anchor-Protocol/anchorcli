import { CLIKey } from "@terra-money/terra.js/dist/key/CLIKey";
import { AddressProviderFromEnvVar } from "../../anchor-js/address-provider";

import { createExecMenu, handleExecCommand } from "../../util/contract-menu";
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

const redeamStable = menu
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

//TODO: add queries

export default {
  menu,
};
