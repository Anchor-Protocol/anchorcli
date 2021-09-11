/* eslint-disable */
import { Contracts } from './types';
import { activeNetwork, loadConfig } from '../util/config';
import { AddressProvider, COLLATERAL_DENOMS, MARKET_DENOMS } from '@anchor-protocol/anchor.js';

export enum NETWORKS {
  COLUMBUS5,
  BOMBAY10,
}

const testnetContracts: Contracts = loadConfig('bombay-10').contracts;
const mainnetContracts: Contracts = loadConfig('columbus-5').contracts;

const chainIDToNetworkName: any = {
  'bombay-10': NETWORKS.BOMBAY10,
  'columbus-5': NETWORKS.COLUMBUS5,
};
export const resolveChainIDToNetworkName = (chainId: string): NETWORKS => {
  if (chainId === undefined) {
    chainId = activeNetwork;
  }
  const network: NETWORKS = chainIDToNetworkName[chainId];
  return network;
};

const networksMap: { [networkName: string]: Contracts } = {
  [NETWORKS.COLUMBUS5]: mainnetContracts,
  [NETWORKS.BOMBAY10]: testnetContracts,
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

  bEthToken(): string {
    return this.addressesMap.bEthToken;
  }

  bEthReward(): string {
    return this.addressesMap.bEthReward;
  }

  market(): string {
    return this.addressesMap.mmMarket;
  }

  custody(_denom: MARKET_DENOMS, collateral: COLLATERAL_DENOMS): string {
    switch (collateral) {
      case COLLATERAL_DENOMS.UBLUNA: {
        return this.addressesMap.mmCustody
      }
      case COLLATERAL_DENOMS.UBETH: {
        return this.addressesMap.mmCustodyBEth
      }
    }
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
