import {
  createExecMenu,
  createQueryMenu,
  handleExecCommand,
} from "../../util/contract-menu";
import {
  Asset,
  fabricatebAssetBond,
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
  .requiredOption("--denom", "Supported native token")
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
  asset: Asset[];
  slippageTolerance: string;
  amount: string;
}

const provideLiquidity = menu
  .command("provide-liquidity")
  .description("Provide liquidity to a Terraswap pool")
  .requiredOption("--amount <string>", "")
  .requiredOption("--slippage-tolerance <Dec>", "")
  .requiredOption(
    "--asset <json>",
    "first/second side of liquidity pool e.g. 1000bluna and 1000uusd"
  )
  .action(
    async ({ asset, slippageTolerance, amount }: provideLiquidityArgs) => {
      const addressProvider = new AddressProviderFromJSON(
        resolveChainIDToNetworkName(menu.chainId)
      );
      const key = new CLIKey({ keyName: menu.from });
      const userAddress = key.accAddress;
      const message = fabricateTerraSwapProvideLiquidity({
        address: userAddress,
        slippageTolerance: slippageTolerance,
        asset: asset,
        quote: "blunaLuna",
        bAsset: "bluna",
        amount: amount,
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
  .requiredOption("--amount", "bAsset amount to swap")
  .option("--to", "ccount to send swapped funds to")
  .option("--max-spread", "")
  .option("--belief-price", "")
  .action(async ({ to, beliefPrice, maxSpread, amount }: swapArgs) => {
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId)
    );
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
