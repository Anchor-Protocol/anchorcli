import {
  createExecMenu,
  createQueryMenu,
  handleExecCommand,
} from "../../util/contract-menu";
import {
  fabricatebSwapbLuna,
  fabricatebTerraSwapCreatePair,
  fabricateTerraSwapProvideLiquidity,
} from "../../anchor-js/fabricators";
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from "../../addresses/from-json";
import { CLIKey } from "@terra-money/terra.js/dist/key/CLIKey";

const menu = createExecMenu(
  "terraswap",
  "terraswap, anchor related contract functions"
);

interface CreatePair {
  denom: string;
}

const create_pair = menu
  .command("create-pair")
  .description("Create LP token contract")
  .requiredOption("--denom <string>", "Supported native token")
  .action(async ({ denom }: CreatePair) => {
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const pair_message = fabricatebTerraSwapCreatePair({
      address: userAddress,
      bAsset: "bluna",
      nativeToken: denom,
    })(addressProvider);
    await handleExecCommand(menu, pair_message);
  });

interface provideLiquidityArgs {
    tokenAmount: string;
    nativeAmount: string;
  slippageTolerance?: string;
  quote: string;
}

const provideLiquidity = menu
  .command("provide-liquidity")
  .description("Provide liquidity to a Terraswap pool")
  .requiredOption("--token-amount <string>", "first side of liquidity pool e.g. 1000bluna")
    .requiredOption("--native-amount <string>", "second side of liquidity pool e.g. 1000uusd")
  .option("--slippage-tolerance <Dec>", "")
  .action(
    async ({slippageTolerance, tokenAmount, nativeAmount, quote }: provideLiquidityArgs) => {
      const addressProvider = new AddressProviderFromJSON(
        resolveChainIDToNetworkName(menu.chainId)
      );
      const key = new CLIKey({ keyName: menu.from });
      const userAddress = key.accAddress;
      const message = fabricateTerraSwapProvideLiquidity({
        address: userAddress,
        slippageTolerance: slippageTolerance,
        quote: quote,
        bAsset: "bluna",
        tokenAmount: tokenAmount,
          nativeAmount: nativeAmount
      })(addressProvider);
      await handleExecCommand(menu, message);
    }
  );

interface swapArgs {
  to?: string;
  beliefPrice?: string;
  maxSpread?: string;
  amount: string;
}
const swap = menu
  .command("swap")
  .description("Swap one asset for another using Terraswap")
  .requiredOption("--amount <string>", "bAsset amount to swap")
  .option("--to <AccAddress>", "ccount to send swapped funds to")
  .option("--max-spread <Dec>", "")
  .option("--belief-price <Dec>", "")
  .action(async ({ to, beliefPrice, maxSpread, amount }: swapArgs) => {
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
    console.log(amount);
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const pair_message = fabricatebSwapbLuna({
      address: userAddress,
      amount: amount,
      bAsset: "bluna",
      to: to,
      beliefPrice: beliefPrice,
      maxSpread: maxSpread,
    })(addressProvider);
    await handleExecCommand(menu, pair_message);
  });

const query = createQueryMenu("terraswap", "Terraswap contract queries");

export default {
  menu,
  query,
};
