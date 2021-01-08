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

const mockAddressProvider = new AddressProviderFromEnvVar();
const menu = createExecMenu(
  "market",
  "Anchor MoneyMarket Market contract functions"
);

interface BorrowStable {
  amount: number;
  to?: string;
}
const borrowStable = menu
  .description("borrow stable")
  .requiredOption("--amount <string>", "Amount of stablecoins to borrow")
  .option("--to <string>", "Withdrawal address for borrowed stablecoins")
  .action(async ({ amount, to }: BorrowStable) => {
    const key = new CLIKey({ keyName: borrowStable.from });
    const userAddress = key.accAddress;
    const msg = fabricateBorrow({
      address: userAddress,
      market: "market",
      amount: amount,
      withdrawTo: to,
    })(mockAddressProvider);
    await handleExecCommand(menu, msg);
  });

const depositStable = menu
  .description("deposit stable")
  .requiredOption("--amount <string>", "Amount of stablecoins to borrow")
  .action(async () => {
    const key = new CLIKey({ keyName: depositStable.from });
    const userAddress = key.accAddress;
    const msg = fabricateDepositStableCoin({
      address: userAddress,
      symbol: "market",
      amount: depositStable.amount,
    })(mockAddressProvider);
    await handleExecCommand(menu, msg);
  });

const redeamStable = menu
  .description("redeem stable")
  .requiredOption("--amount <string>", "")
  .action(async ({ amount }) => {
    const key = new CLIKey({ keyName: redeamStable.from });
    const userAddress = key.accAddress;
    const msg = fabricateRedeemStable({
      address: userAddress,
      symbol: "market",
      amount: amount,
    })(mockAddressProvider);
    await handleExecCommand(menu, msg);
  });

const repay = menu
  .description("repay stable")
  .requiredOption("--amount <string>", "")
  .action(async ({ amount }) => {
    const key = new CLIKey({ keyName: repay.from });
    const userAddress = key.accAddress;
    const msg = fabricateRepay({
      address: userAddress,
      market: "market",
      amount: amount,
    })(mockAddressProvider);
    await handleExecCommand(menu, msg);
  });

interface Config {
  ownerAddress?: string;
  interestModel?: string;
  reserveFactor?: Dec;
}
const updateConfig = menu
  .description("update config")
  .option("--owner-address <AccAddress>", "Address of new owner")
  .option(
    "--reserve-factor <Dec>",
    "New portion of borrower interest set aside as reserves"
  )
  .option("--interest-model <string>", "New interest model contract address")
  .action(async ({ ownerAddress, interestModel, reserveFactor }: Config) => {
    const key = new CLIKey({ keyName: updateConfig.from });
    const userAddress = key.accAddress;
    const msg = fabricatebMarketConfig({
      address: userAddress,
      owner_addr: ownerAddress,
      interest_model: interestModel,
      reserve_factor: reserveFactor,
      market: "market",
    });
  });

//TODO: add queries

export default {
  menu,
};
