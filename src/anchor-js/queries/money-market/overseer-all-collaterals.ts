import { LCDClient } from "@terra-money/terra.js";
import { AddressProvider } from "../../address-provider/types";

interface Option {
  lcd: LCDClient;
  overseer: string;
  startAfter?: string;
  limit?: number;
}
interface AllCollateralsResponse {
  allCollaterals: object[];
}

export const queryOverseerAllCollateral = ({
  lcd,
  overseer,
  startAfter,
  limit,
}: Option) => async (
  addressProvider: AddressProvider.Provider
): Promise<AllCollateralsResponse> => {
  const overseerContractAddress = addressProvider.overseer(overseer);
  let response: AllCollateralsResponse = await lcd.wasm.contractQuery(
    overseerContractAddress,
    {
      all_collaterals: {
        start_after: startAfter,
        limit: +limit,
      },
    }
  );
  return response;
};
