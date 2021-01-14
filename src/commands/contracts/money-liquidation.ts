import { CLIKey } from "@terra-money/terra.js/dist/key/CLIKey";
import { createExecMenu, handleExecCommand } from "../../util/contract-menu";
import { AddressProviderFromEnvVar } from "../../anchor-js/address-provider";
import { fabricateRetractBid } from "../../anchor-js/fabricators/money-market/liquidation-retract-bid";
import {
  fabricateLiquidationConfig,
  fabricateSubmitBid,
} from "../../anchor-js/fabricators";
import { Dec } from "@terra-money/terra.js";
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from "../../addresses/from-json";

const menu = createExecMenu(
  "liquidation",
  "Anchor MoneyMarket Liquidation contract functions"
);

interface RetractBid {
  collateralToken: string;
  amount?: number;
}
const liquidationRetractBid = menu
  .command("retract-bid")
  .description("Withdraw specified amount of stablecoins from the bid ")
  .requiredOption(
    "--collateral-token <AccAddress>",
    "Cw20 token contract address of bidding collateral"
  )
  .option("--amount <string>", "Amount of stablecoins remove from bid")
  .action(async ({ collateralToken, amount }: RetractBid) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const msg = fabricateRetractBid({
      address: userAddress,
      collateral_token: collateralToken,
      amount: amount,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

interface RetractBid {
  collateralToken: string;
  premiumRate: Dec;
}
const liquidationSubmitBid = menu
  .command("submit-bid")
  .description("Submit a new bid for the specified Cw20 collateral")
  .requiredOption(
    "--collateral-token <AccAddress>",
    "Cw20 token contract address of bidding collateral"
  )
  .option("--premium-rate <Dec>", "Rate of commission on executing this bid")
  .action(async ({ collateralToken, premiumRate }: RetractBid) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const msg = fabricateSubmitBid({
      address: userAddress,
      collateral_token: collateralToken,
      premium_rate: premiumRate,
    })(addressProvider);
    await handleExecCommand(menu, msg);
  });

interface UpdateConfig {
  owner?: string;
  oracleContract?: string;
  stableDenom?: string;
  safeRatio?: Dec;
  bidFee?: Dec;
  maxPremiumRate?: Dec;
  liquidationThreshold?: number;
  priceTimeframe: number;
}
const liquidationUpdateConfig = menu
  .command("update-config")
  .description("Update the Liquidation Contract's configuration")
  .option("--owner <AccAddress>", "Address of new owner")
  .option("--oracle-contract <string>", "New oracle contract address")
  .option("--stable-denom <string>", "New native token denomination for bids")
  .option(
    "--safe-ratio <Dec>",
    "New liability / borrow limit of a loan deemed safe"
  )
  .option("--bid-fee <Dec>", "New fee rate applied to executed bids")
  .option(
    "--max-premium-rate <Dec>",
    "New maximum rate of commission given to the bidder of  an executed bid"
  )
  .option(
    "--liquidation-threshold, <int>",
    "New threshold collateral value for triggering partial collateral liquidations"
  )
  .option(
    "--price-timeframe <int>",
    "New window of time before price data is considered outdated"
  )
  .action(
    async ({
      owner,
      oracleContract,
      stableDenom,
      safeRatio,
      bidFee,
      maxPremiumRate,
      liquidationThreshold,
      priceTimeframe,
    }: UpdateConfig) => {
      const key = new CLIKey({ keyName: liquidationUpdateConfig.from });
      const userAddress = key.accAddress;
      const addressProvider = new AddressProviderFromJSON(
        resolveChainIDToNetworkName(menu.chainId)
      );
      const msg = fabricateLiquidationConfig({
        address: userAddress,
        owner: owner,
        oracle_contract: oracleContract,
        stable_denom: stableDenom,
        safe_ratio: safeRatio,
        bid_fee: bidFee,
        max_premium_rate: maxPremiumRate,
        liquidation_threshold: liquidationThreshold,
        price_timeframe: priceTimeframe,
      })(addressProvider);
      await handleExecCommand(menu, msg);
    }
  );

export default {
  menu,
};

//TODO: add queries
