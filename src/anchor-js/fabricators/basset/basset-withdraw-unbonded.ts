import { MsgExecuteContract } from "@terra-money/terra.js";
import { validateInput } from "../../utils/validate-input";
import { validateAddress } from "../../utils/validation/address";
import { AddressProvider } from "../../address-provider/types";

interface Option {
  address: string;
  bAsset: string;
}

export const fabricatebAssetWithdrawUnbonded = ({
  address,
  bAsset,
}: Option) => (
  addressProvider: AddressProvider.Provider
): MsgExecuteContract[] => {
  validateInput([validateAddress(address)]);

  const bAssetHubAddress = addressProvider.bAssetHub(bAsset);

  return [
    new MsgExecuteContract(address, bAssetHubAddress, {
      withdraw_unbonded: {},
    }),
  ];
};
