import { LCDClient } from "@terra-money/terra.js";
import { AddressProvider } from "../../address-provider/types";

interface Option {
  lcd: LCDClient;
  bAsset: string;
  start_from: number;
  limit: number;
}

interface HistoryResponse {
  history: object[];
}

export const queryHubHistory = ({
  lcd,
  bAsset,
  start_from,
  limit,
}: Option) => async (
  addressProvider: AddressProvider.Provider
): Promise<HistoryResponse> => {
  const bAssetContractAddress = addressProvider.bAssetHub(bAsset);
  let reponse: HistoryResponse = await lcd.wasm.contractQuery(
    bAssetContractAddress,
    {
      all_history: {
        start_from: start_from,
        limit: limit,
      },
    }
  );
  return reponse;
};
