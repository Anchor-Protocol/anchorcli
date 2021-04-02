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

const sweep = menu
  .command('sweep <denom>')
  .description(
    `swap denom Terra stablecoins in the Collector contract to ANC tokens`,
    {
      denom: 'Denomination of stablecoin to swap',
    },
  )
  .action(async (denom: string) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
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
    const lcd = getLCDClient(query.chainId);
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );

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
