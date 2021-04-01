import { Coins, LCDClient, LCDClientConfig } from '@terra-money/terra.js';
import { Numeric } from '@terra-money/terra.js/dist/core/numeric';
import * as path from 'path';
import { homedir } from 'os';
import * as fs from 'fs';
import { AnchorConfig, Contracts } from '../addresses/types';

export const configFilePath = path.join(homedir(), '.anchorcli_contracts.json');

export const config = (() => {
  try {
    const c = loadConfig();
    if (c === undefined) {
      throw new Error(`Could not find configuration`);
    }
    return c;
  } catch (e) {
    process.exit();
  }
})();

export function loadConfig(chainId?: string): AnchorConfig {
  if (!fs.existsSync(configFilePath)) {
    if (chainId === 'columbus-4') {
      let config: AnchorConfig = JSON.parse(
        fs.readFileSync('src/addresses/anchor-config-mainnet').toString(),
      );
      return config;
    } else {
      let config: AnchorConfig = JSON.parse(
        fs.readFileSync('src/addresses/anchor-config-testnet.json').toString(),
      );
      return config;
    }
  } else {
    try {
      const loadedConfig: AnchorConfig = JSON.parse(
        fs.readFileSync(configFilePath).toString(),
      );
      return loadedConfig;
    } catch (e) {
      throw new Error(
        `Could not parse config file ${configFilePath}: ${e.message}`,
      );
    }
  }
}

export function saveContractAddresses(newContractAddresses: AnchorConfig) {
  fs.writeFileSync(
    configFilePath,
    JSON.stringify(newContractAddresses, null, 2),
  );
}

export default {
  config,
};
