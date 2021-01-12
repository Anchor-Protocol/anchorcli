import { LCDClient, MsgExecuteContract } from "@terra-money/terra.js";
import { AddressProvider } from "../../address-provider/types";

interface Option {
  lcd: LCDClient;
  bAsset: string;
}

export const queryHubConfig = ({ lcd, bAsset }: Option) => (
  addressProvider: AddressProvider.Provider
): any => {
  const bAssetContractAddress = addressProvider.bAssetHub(bAsset);
  lcd.wasm.contractQuery(bAssetContractAddress, {
    config: {},
  });
};
