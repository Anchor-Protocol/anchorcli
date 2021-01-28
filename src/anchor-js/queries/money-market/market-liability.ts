import { LCDClient } from '@terra-money/terra.js';
import { AddressProvider } from '../../address-provider/types';

interface Option {
  lcd: LCDClient;
  market: string;
  borrower: string;
}
interface LiabilityResponse {
  borrower: string;
  interestIndex: string;
  loanAmount: string;
}

export const queryMarketLiability = ({
  lcd,
  market,
  borrower,
}: Option) => async (
  addressProvider: AddressProvider.Provider,
): Promise<LiabilityResponse> => {
  const marketContractAddress = addressProvider.market(market);
  let response: LiabilityResponse = await lcd.wasm.contractQuery(
    marketContractAddress,
    {
      liability: {
        borrower: borrower,
      },
    },
  );
  return response;
};
