/* eslint-disable */
import { Contracts } from './types';
import { activeNetwork, loadConfig } from '../util/config';
import { AddressProvider } from '@anchor-protocol/anchor.js';
import tequilaDefaultConfig from '../data/anchorcli-default-tequila';
import mainnetDefaultConfig from '../data/anchorcli-default-columbus';

export enum NETWORKS {
  COLUMBUS4,
  TEQUILA0004,
}

//TODO: should not read from loadconfig();
const testnetContracts: Contracts = tequilaDefaultConfig.contracts;
const mainnetContracts: Contracts = mainnetDefaultConfig.contracts;

const chainIDToNetworkName: any = {
  'tequila-0004': NETWORKS.TEQUILA0004,
  'columbus-4': NETWORKS.COLUMBUS4,
};
export const resolveChainIDToNetworkName = (chainId: string): NETWORKS => {
  if (chainId === undefined) {
    chainId = activeNetwork;
  }
  const network: NETWORKS = chainIDToNetworkName[chainId];
  return network;
};

const networksMap: { [networkName: string]: Contracts } = {
  [NETWORKS.COLUMBUS4]: mainnetContracts,
  [NETWORKS.TEQUILA0004]: testnetContracts,
};

export class AddressProviderFromJSON implements AddressProvider {
  addressesMap: Contracts;

  constructor(network: NETWORKS) {
    this.addressesMap = networksMap[network];
  }

  bLunaReward(): string {
    return this.addressesMap.bLunaReward;
  }

  bLunaHub(): string {
    return this.addressesMap.bLunaHub;
  }

  bLunaToken(): string {
    return this.addressesMap.bLunaToken;
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

  aTerra(): string {
    return this.addressesMap.aTerra;
  }

  oracle(): string {
    return this.addressesMap.mmOracle;
  }

  interest(): string {
    return this.addressesMap.mmInterestModel;
  }

  liquidation(): string {
    return this.addressesMap.mmLiquidation;
  }

  terraswapblunaLunaPair(): string {
    return this.addressesMap.terraswapblunaLunaPair;
  }

  terraswapblunaLunaLPToken(): string {
    return this.addressesMap.terraswapblunaLunaLPToken;
  }

  gov(): string {
    return this.addressesMap.gov;
  }

  terraswapAncUstPair(): string {
    return this.addressesMap.terraswapAncUstPair;
  }

  terraswapAncUstLPToken(): string {
    return this.addressesMap.terraswapAncUstLPToken;
  }

  collector(): string {
    return this.addressesMap.collector;
  }

  staking(): string {
    return this.addressesMap.staking;
  }

  community(): string {
    return this.addressesMap.community;
  }

  distributor(): string {
    return this.addressesMap.distributor;
  }

  ANC(): string {
    return this.addressesMap.ANC;
  }

  airdrop(): string {
    return this.addressesMap.airdrop;
  }

  investorLock(): string {
    return this.addressesMap.investor_vesting;
  }

  teamLock(): string {
    return this.addressesMap.team_vesting;
  }
}
