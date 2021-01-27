import { LCDClientConfig } from "@terra-money/terra.js";

export interface AnchorConfig {
  lcd: LCDClientConfig;
  contracts: Contracts;
}

export interface Contracts {
  bLunaHub: string;
  bAssetToken: string;
  bAssetReward: string;
  mmInterest: string;
  mmOracle: string;
  mmMarket: string;
  mmOverseer: string;
  mmCustody: string;
  mmLiquidation: string;
  anchorToken: string;
  terraswapFactory: string;
  terraswapPair: string;
  blunaBurn: { [nativeDenom: string]: string };
}
