import { LCDClientConfig } from '@terra-money/terra.js';

export interface AnchorConfig {
  lcd: LCDClientConfig;
  contracts: Contracts;
}

export interface Contracts {
  bLunaHub: string;
  bLunaToken: string;
  bLunaReward: string;
  bLunaAirdrop: string;
  bEthToken: string;
  bEthReward: string;
  mmInterestModel: string;
  mmOracle: string;
  mmMarket: string;
  mmOverseer: string;
  mmCustody: string;
  mmLiquidation: string;
  mmDistributionModel: string;
  aTerra: string;
  terraswapblunaLunaPair: string;
  terraswapblunaLunaLPToken: string;
  terraswapAncUstPair: string;
  terraswapAncUstLPToken: string;
  gov: string;
  distributor: string;
  collector: string;
  community: string;
  staking: string;
  ANC: string;
  airdrop: string;
  investor_vesting: string;
  team_vesting: string;
}
