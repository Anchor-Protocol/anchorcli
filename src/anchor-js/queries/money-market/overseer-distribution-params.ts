import { LCDClient } from "@terra-money/terra.js";
import { AddressProvider } from "../../address-provider/types";

interface Option {
  lcd: LCDClient;
  overseer: string;
}
interface DistributionParamsResponse {
  depositRate: string;
  targetDepositRate: string;
  distributionThreshold: string;
}

export const queryOverseerDistributionParams = ({
  lcd,
  overseer,
}: Option) => async (
  addressProvider: AddressProvider.Provider
): Promise<DistributionParamsResponse> => {
  const overseerContractAddress = addressProvider.overseer(overseer);
  let response: DistributionParamsResponse = await lcd.wasm.contractQuery(
    overseerContractAddress,
    {
      distributionParams: {},
    }
  );
  return response;
};
