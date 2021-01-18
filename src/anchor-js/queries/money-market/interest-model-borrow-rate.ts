import { LCDClient } from "@terra-money/terra.js";
import { AddressProvider } from "../../address-provider/types";

interface Option {
  lcd: LCDClient;
  marketBalance: string;
  totalLiabilities: string;
  totalReserves: string;
}
interface BorrowRateResponse {
  rate: string;
}

export const queryInterestModelBorrowRate = ({
  lcd,
  marketBalance,
  totalLiabilities,
  totalReserves,
}: Option) => async (
  addressProvider: AddressProvider.Provider
): Promise<BorrowRateResponse> => {
  const interestModelContractAddress = addressProvider.interest();
  let response: BorrowRateResponse = await lcd.wasm.contractQuery(
    interestModelContractAddress,
    {
      borrowRate: {
        marketBalance: marketBalance,
        totalLiabilities: totalLiabilities,
        totalReserves: totalReserves,
      },
    }
  );
  return response;
};
