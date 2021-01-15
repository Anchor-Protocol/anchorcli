import { LCDClient } from "@terra-money/terra.js";
import { AddressProvider } from "../../address-provider/types";

interface Option {
  lcd: LCDClient;
  bAsset: string;
  startFrom?: number;
  lim?: number;
}

interface HistoryResponse {
  history: object[];
}

export const queryHubHistory = ({
  lcd,
  bAsset,
  startFrom,
  lim,
}: Option) => async (
  addressProvider: AddressProvider.Provider
): Promise<HistoryResponse> => {
  const bAssetContractAddress = addressProvider.bAssetHub(bAsset);
  console.log(lim);
  let reponse: HistoryResponse = await lcd.wasm.contractQuery(
    bAssetContractAddress,
    {
      all_history: {
        start_from: +startFrom,
        limit: +lim,
      },
    }
  );
  return reponse;
};
