export class AddressProviderFromMantle implements AddressProvider.Provider {
  bAssetReward(denom: string): string {
    throw new Error('Method not implemented.');
  }
  bAssetHub(denom: string): string {
    throw new Error('Method not implemented.');
  }
  bAssetToken(denom: string): string {
    throw new Error('Method not implemented.');
  }
  bAsset(denom: string): string {
    throw new Error('Method not implemented.');
  }
  market(denom: string): string {
    throw new Error('Method not implemented.');
  }
  custody(): string {
    throw new Error('Method not implemented.');
  }
  overseer(): string {
    throw new Error('Method not implemented.');
  }
  aToken(): string {
    throw new Error('Method not implemented.');
  }
  oracle(): string {
    throw new Error('Method not implemented.');
  }
  interest(): string {
    throw new Error('Method not implemented.');
  }
  liquidation(): string {
    throw new Error('Method not implemented.');
  }
}
