import { ContractAddresses } from "./types";
import { AddressProvider } from "../anchor-js/address-provider/types";

export enum NETWORKS {
  COLUMBUS4,
  TEQUILA0004,
}

import * as tequila from "./tequila-0004.json";

const chainIDToNetworkName: any = {
  "tequila-0004": NETWORKS.TEQUILA0004,
};
export const resolveChainIDToNetworkName = (chainId: string): NETWORKS => {
  const network: NETWORKS =
    chainId === undefined
      ? chainIDToNetworkName["tequila-0004"]
      : chainIDToNetworkName[chainId];
  return network;
};

const networksMap: { [networkName: string]: ContractAddresses } = {
  [NETWORKS.COLUMBUS4]: tequila,
  [NETWORKS.TEQUILA0004]: tequila,
};

export class AddressProviderFromJSON implements AddressProvider.Provider {
  addressesMap: ContractAddresses;

  constructor(network: NETWORKS) {
    this.addressesMap = networksMap[network];
  }

  bAssetReward(): string {
    return this.addressesMap.bAssetReward;
  }
  bAssetHub(): string {
    return this.addressesMap.bLunaHub;
  }
  bAssetToken(): string {
    return this.addressesMap.bAssetToken;
  }
  market(): string {
    return this.addressesMap.mmMarket;
  }
  custody(): string {
    return this.addressesMap.mmCustody;
  }
  overseer(): string {
    return this.addressesMap.mmOverseer;
  }
  aToken(): string {
    return this.addressesMap.anchorToken;
  }
  oracle(): string {
    return this.addressesMap.mmOracle;
  }
  interest(): string {
    return this.addressesMap.mmInterest;
  }
  liquidation(): string {
    return this.addressesMap.mmLiquidation;
  }
}
