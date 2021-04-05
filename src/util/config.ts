import * as path from 'path';
import { homedir } from 'os';
import * as fs from 'fs';
import { AnchorConfig } from '../addresses/types';
import mainnetDefaultConfig from '../data/anchorcli-default-columbus';
import tequilaDefaultConfig from '../data/anchorcli-default-tequila';
import { Validator } from 'jsonschema';
import * as logger from './logger';
import configSchema from '../data/configSchema';

export const configFilePathTestnet = path.join(
  homedir(),
  'anchorcliTestnet.json',
);
export const configFilePathMainnet = path.join(
  homedir(),
  'anchorcliMainnet.json',
);

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export namespace AnchorCLIConfig {
  export const SCHEMA = configSchema;
}

export const activeNetwork = process.env.ANCHORCLI_NETWORK || 'columbus-4';

export const config = (() => {
  try {
    const c = loadConfig(activeNetwork);
    if (c === undefined) {
      throw new Error(`Could not find configuration`);
    }
    return c;
  } catch (e) {
    process.exit();
  }
})();

export function saveConfigTestnet(newConfig: DeepPartial<AnchorConfig>) {
  fs.writeFileSync(
    configFilePathTestnet,
    JSON.stringify(validateConfig(newConfig), null, 2),
  );
}

export function saveConfigMainnet(newConfig: DeepPartial<AnchorConfig>) {
  fs.writeFileSync(
    configFilePathMainnet,
    JSON.stringify(validateConfig(newConfig), null, 2),
  );
}

export function validateConfig(
  config: DeepPartial<AnchorConfig>,
): DeepPartial<AnchorConfig> {
  const v = new Validator();
  const r = v.validate(config, AnchorCLIConfig.SCHEMA);
  if (r.valid) {
    return config;
  } else {
    for (const err of r.errors) {
      logger.error(err.toString());
    }
    throw new Error(`improper format.`);
  }
}

export function loadConfig(chainId?: string): AnchorConfig {
  if (chainId === undefined) {
    chainId = activeNetwork;
  }
  if (
    !fs.existsSync(configFilePathTestnet) ||
    !fs.existsSync(configFilePathMainnet)
  ) {
    if (chainId === 'columbus-4') {
      console.log(' I am here');
      saveConfigMainnet(mainnetDefaultConfig);
      let config: AnchorConfig = mainnetDefaultConfig;
      return config;
    } else {
      saveConfigTestnet(tequilaDefaultConfig);
      let config: AnchorConfig = tequilaDefaultConfig;
      return config;
    }
  } else {
    if (chainId === 'columbus-4') {
      try {
        const loadedConfig: AnchorConfig = JSON.parse(
          fs.readFileSync(configFilePathMainnet).toString(),
        );
        return loadedConfig;
      } catch (e) {
        throw new Error(
          `Could not parse config file ${configFilePathTestnet}: ${e.message}`,
        );
      }
    } else {
      try {
        const loadedConfig: AnchorConfig = JSON.parse(
          fs.readFileSync(configFilePathTestnet).toString(),
        );
        return loadedConfig;
      } catch (e) {
        throw new Error(
          `Could not parse config file ${configFilePathTestnet}: ${e.message}`,
        );
      }
    }
  }
}

export function saveContractAddresses(
  newContractAddresses: AnchorConfig,
  chainId?: string,
) {
  if (chainId === undefined) {
    chainId = activeNetwork;
  }
  if (chainId === 'columbus-4') {
    fs.writeFileSync(
      configFilePathMainnet,
      JSON.stringify(newContractAddresses, null, 2),
    );
  } else {
    fs.writeFileSync(
      configFilePathTestnet,
      JSON.stringify(newContractAddresses, null, 2),
    );
  }
}

export default {
  config,
};
