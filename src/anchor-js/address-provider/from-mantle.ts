import { AddressProvider } from "./types";

export class AddressProviderFromMantle implements AddressProvider.Provider {
  bAssetReward(): string {
    throw new Error("Method not implemented.");
  }
  bAssetHub(): string {
    throw new Error("Method not implemented.");
  }
  bAssetToken(): string {
    throw new Error("Method not implemented.");
  }
  bAsset(): string {
    throw new Error("Method not implemented.");
  }
  market(): string {
    throw new Error("Method not implemented.");
  }
  custody(): string {
    throw new Error("Method not implemented.");
  }
  overseer(): string {
    throw new Error("Method not implemented.");
  }
  aToken(): string {
    throw new Error("Method not implemented.");
  }
  oracle(): string {
    throw new Error("Method not implemented.");
  }
  interest(): string {
    throw new Error("Method not implemented.");
  }
  liquidation(): string {
    throw new Error("Method not implemented.");
  }
}
