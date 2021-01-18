import { LCDClient } from "@terra-money/terra.js";
import { AddressProvider } from "../../address-provider/types";

interface Option {
  lcd: LCDClient;
  collateralToken: string;
  startAfter?: string;
  limit?: number;
}
interface BidsByCollateralResponse {
  bids: object[];
}

export const queryLiquidationBidsByCollateral = ({
  lcd,
  collateralToken,
  startAfter,
  limit,
}: Option) => async (
  addressProvider: AddressProvider.Provider
): Promise<BidsByCollateralResponse> => {
  const liquidationContractAddress = addressProvider.liquidation();
  let response: BidsByCollateralResponse = await lcd.wasm.contractQuery(
    liquidationContractAddress,
    {
      bidsByCollateral: {
        collateralToken: collateralToken,
        startAfter: startAfter,
        limit: limit,
      },
    }
  );
  return response;
};
