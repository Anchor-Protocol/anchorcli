import { LCDClient } from "@terra-money/terra.js";
import { AddressProvider } from "../../address-provider/types";

interface Option {
  lcd: LCDClient;
  market: string;
  blockHeight?: number;
}
interface EpochStateResponse {
  exchangeRate: string;
  aTokenSupply: string;
}

export const queryMarketEpochState = ({
  lcd,
  market,
  blockHeight,
}: Option) => async (
  addressProvider: AddressProvider.Provider
): Promise<EpochStateResponse> => {
  const marketContractAddress = addressProvider.market(market);
  let response: EpochStateResponse = await lcd.wasm.contractQuery(
    marketContractAddress,
    {
      epoch_state: {
        blockHeight: blockHeight,
      },
    }
  );
  return response;
};
