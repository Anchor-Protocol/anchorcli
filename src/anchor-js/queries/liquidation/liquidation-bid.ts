import { LCDClient } from "@terra-money/terra.js";
import { AddressProvider } from "../../address-provider/types";

interface Option {
  lcd: LCDClient;
  collateralToken: string;
  bidder: string;
}
interface BidResponse {
  collateralToken: string;
  bidder: string;
  amount: string;
  premiumRate: string;
}

export const queryLiquidationBid = ({
  lcd,
  collateralToken,
  bidder,
}: Option) => async (
  addressProvider: AddressProvider.Provider
): Promise<BidResponse> => {
  const liquidationContractAddress = addressProvider.liquidation();
  let response: BidResponse = await lcd.wasm.contractQuery(
    liquidationContractAddress,
    {
      bid: { collateralToken: collateralToken, bidder: bidder },
    }
  );
  return response;
};
