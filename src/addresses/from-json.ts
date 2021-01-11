import { ContractAddresses } from "./types";

export enum NETWORKS {
  COLUMBUS4,
  TEQUILA0004,
}

import tequila from "./tequila-0004.json";

const chainIDToNetworkName = {
  "tequila-0004": NETWORKS.TEQUILA0004,
};
export const resolveChainIDToNetworkName = (chainId: string): NETWORKS => {
  const network = chainIDToNetworkName[chainId];
  if (typeof network === "undefined") {
    throw new Error("unknown network");
  }
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

  bAssetReward(denom: string): string {
    return this.addressesMap.bAssetReward;
  }
  bAssetHub(denom: string): string {
    return this.addressesMap.bLunaHub;
  }
  bAssetToken(denom: string): string {
    return this.addressesMap.bAssetToken;
  }
  market(denom: string): string {
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
