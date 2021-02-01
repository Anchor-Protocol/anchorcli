import { LCDClient } from '@terra-money/terra.js';
import { AddressProvider } from '../../address-provider/types';

interface Option {
  lcd: LCDClient;
  bAsset: string;
}

interface StateResponse {
  global_index: string;
  total_balance: string;
  prev_reward_balance: string;
}

export const queryRewardState = ({ lcd, bAsset }: Option) => async (
  addressProvider: AddressProvider.Provider,
): Promise<StateResponse> => {
  const bAssetContractAddress = addressProvider.bAssetReward(bAsset);
  let reponse: StateResponse = await lcd.wasm.contractQuery(
    bAssetContractAddress,
    {
      state: {},
    },
  );
  return reponse;
};
