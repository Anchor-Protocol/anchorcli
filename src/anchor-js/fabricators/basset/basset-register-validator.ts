import { MsgExecuteContract } from "@terra-money/terra.js";
import { validateInput } from "../../utils/validate-input";
import { validateValAddress } from "../../utils/validation/address";

interface Option {
  address: string; // sender address
  validatorAddress: string; // validator address to whitelist
}

/**
 * @param address Client’s Terra address.
 */
export const fabricateRegisterValidator = ({
  address,
  validatorAddress,
}: Option) => (
  addressProvider: AddressProvider.Provider
): MsgExecuteContract[] => {
  validateInput([validateValAddress(validatorAddress)]);

  const bAssetHubAddress = addressProvider.bAssetHub("bluna");

  return [
    new MsgExecuteContract(address, bAssetHubAddress, {
      register_validator: {
        validator: validatorAddress,
      },
    }),
  ];
};