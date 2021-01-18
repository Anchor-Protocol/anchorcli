import { LCDClient } from "@terra-money/terra.js";
import { AddressProvider } from "../../address-provider/types";

interface Option {
  lcd: LCDClient;
  market: string;
  startAfter?: string;
  limit?: number;
}
interface LiabilitiesResponse {
  liabilities: object[];
}

export const queryMarketLiabilities = ({
  lcd,
  market,
  startAfter,
  limit,
}: Option) => async (
  addressProvider: AddressProvider.Provider
): Promise<LiabilitiesResponse> => {
  const marketContractAddress = addressProvider.market(market);
  let response: LiabilitiesResponse = await lcd.wasm.contractQuery(
    marketContractAddress,
    {
      liabilities: {
        startAfter: startAfter,
        limit: limit,
      },
    }
  );
  return response;
};
