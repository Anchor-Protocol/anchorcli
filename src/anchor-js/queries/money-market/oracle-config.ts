import { LCDClient } from '@terra-money/terra.js';
import { AddressProvider } from '../../address-provider/types';

interface Option {
  lcd: LCDClient;
}
interface ConfigResponse {
  owner: string;
  baseAsset: string;
}

export const queryOracleConfig = ({ lcd }: Option) => async (
  addressProvider: AddressProvider.Provider,
): Promise<ConfigResponse> => {
  const oracleContractAddress = addressProvider.oracle();
  let response: ConfigResponse = await lcd.wasm.contractQuery(
    oracleContractAddress,
    {
      config: {},
    },
  );
  return response;
};
