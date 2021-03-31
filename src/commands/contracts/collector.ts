import * as Parse from '../../util/parse-input';
import {
  createExecMenu,
  createQueryMenu,
  getLCDClient,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';
import {
  fabricateCollectorSweep,
  queryCollectorConfig,
} from '@anchor-protocol/anchor.js';
import { CLIKey } from '@terra-money/terra.js/dist/key/CLIKey';
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from '../../addresses/from-json';

const menu = createExecMenu('collector', 'Anchor Collector contract functions');

const addressProvider = new AddressProviderFromJSON(
  resolveChainIDToNetworkName(menu.chainId),
);
const lcd = getLCDClient();

interface Sweep {
  denom: string;
}

const sweep = menu
  .command('sweep <denom>')
  .description(
    `swap denom Terra stablecoins in the Collector contract to ANC tokens`,
    {
      denom: 'Denomination of stablecoin to swap',
    },
  )
  .action(async ({ denom }: Sweep) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    await handleExecCommand(
      menu,
      await fabricateCollectorSweep({
        address: userAddress,
        denom: denom,
      })(addressProvider),
    );
  });

const query = createQueryMenu('collector', 'Anchor Collector contract queries');
const getConfig = query
  .command('config')
  .description('Query Anchor Collector contract config')
  .action(async () => {
    await handleQueryCommand(
      query,
      await queryCollectorConfig({
        lcd,
      })(addressProvider),
    );
  });

export default {
  menu,
  query,
};
