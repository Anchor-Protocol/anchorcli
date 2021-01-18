import { LCDClient } from "@terra-money/terra.js";
import { AddressProvider } from "../../address-provider/types";

interface Option {
  lcd: LCDClient;
  startAfter?: string;
  limit?: number;
}
interface PricesResponse {
  prices: object[];
}

export const queryOraclePrice = ({ lcd, startAfter, limit }: Option) => async (
  addressProvider: AddressProvider.Provider
): Promise<PricesResponse> => {
  const oracleContractAddress = addressProvider.oracle();
  let response: PricesResponse = await lcd.wasm.contractQuery(
    oracleContractAddress,
    {
      prices: {
        start_after: startAfter,
        limit: limit,
      },
    }
  );
  return response;
};
