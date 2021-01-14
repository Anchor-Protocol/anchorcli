import { LCDClient } from "@terra-money/terra.js";
import { AddressProvider } from "../../address-provider/types";

interface Option {
  lcd: LCDClient;
  bAsset: string;
}

interface ParamsResponse {
  epoch_period: number;
  underlying_coin_denom: string;
  unbonding_period: number;
  peg_recovery_fee: string;
  er_threshold: string;
  reward_denom: string;
}

export const queryHubParams = ({ lcd, bAsset }: Option) => async (
  addressProvider: AddressProvider.Provider
): Promise<ParamsResponse> => {
  const bAssetContractAddress = addressProvider.bAssetHub(bAsset);
  let reponse: ParamsResponse = await lcd.wasm.contractQuery(
    bAssetContractAddress,
    {
      parameters: {},
    }
  );
  return reponse;
};
