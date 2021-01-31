import { LCDClient } from '@terra-money/terra.js';
import { AddressProvider } from '../../address-provider/types';

interface Option {
  lcd: LCDClient;
  overseer: string;
}
interface EpochStateResponse {
  depositRate: string;
  prevATokenSupply: string;
  prevExchangeRate: string;
  lastExecutedHeight: number;
}

export const queryOverseerEpochState = ({ lcd, overseer }: Option) => async (
  addressProvider: AddressProvider.Provider,
): Promise<EpochStateResponse> => {
  const overseerContractAddress = addressProvider.overseer(overseer);
  let response: EpochStateResponse = await lcd.wasm.contractQuery(
    overseerContractAddress,
    {
      epoch_state: {},
    },
  );
  return response;
};
