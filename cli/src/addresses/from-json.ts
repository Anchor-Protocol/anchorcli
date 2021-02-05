import { Contracts } from './types';

export enum NETWORKS {
  COLUMBUS4,
  TEQUILA0004,
}
import { loadConfig } from '../util/config';
import { AddressProvider } from '@anchor-protocol/anchor.js/dist/address-provider';

const contracts: Contracts = loadConfig().contracts;

const chainIDToNetworkName: any = {
  'tequila-0004': NETWORKS.TEQUILA0004,
};
export const resolveChainIDToNetworkName = (chainId: string): NETWORKS => {
  const network: NETWORKS =
    chainId === undefined
      ? chainIDToNetworkName['tequila-0004']
      : chainIDToNetworkName[chainId];
  return network;
};

const networksMap: { [networkName: string]: Contracts } = {
  [NETWORKS.COLUMBUS4]: contracts,
  [NETWORKS.TEQUILA0004]: contracts,
};

export class AddressProviderFromJSON implements AddressProvider {
  addressesMap: Contracts;

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
  terraswapFactory(): string {
    return this.addressesMap.terraswapFactory;
  }
  blunaBurnPair(): string {
    return this.addressesMap.terraswapPair;
  }

  blunaBurn(quote: string): string {
    const address = this.addressesMap.blunaBurn[quote];
    if (typeof address === 'undefined') {
      throw new Error(`there is not address for ${quote}`);
    }
    return address;
  }
}
