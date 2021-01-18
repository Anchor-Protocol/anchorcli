import { LCDClient } from "@terra-money/terra.js";
import { AddressProvider } from "../../address-provider/types";

interface Option {
  lcd: LCDClient;
  bidder: string;
  startAfter?: string;
  limit?: number;
}
interface BidsByUserResponse {
  bids: object[];
}

export const queryLiquidationBidsByUser = ({
  lcd,
  bidder,
  startAfter,
  limit,
}: Option) => async (
  addressProvider: AddressProvider.Provider
): Promise<BidsByUserResponse> => {
  const liquidationContractAddress = addressProvider.liquidation();
  let response: BidsByUserResponse = await lcd.wasm.contractQuery(
    liquidationContractAddress,
    {
      bidsByUser: { bidder: bidder, startAfter: startAfter, limit: limit },
    }
  );
  return response;
};
