import {
  createExecMenu,
  createQueryMenu,
  getLCDClient,
  handleQueryCommand,
} from '../../util/contract-menu';
import {
  queryCommunityConfig,
  queryDistributortConfig,
} from '@anchor-protocol/anchor.js';
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from '../../addresses/from-json';
import * as commander from 'commander';

const query = createQueryMenu(
  'distributor',
  'Anchor Distributor contract queries',
);

const getConfig = query
  .command('config')
  .description('Query Anchor Community contract config')
  .action(async () => {
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const lcd = getLCDClient(query.chainId);
    await handleQueryCommand(
      query,
      await queryDistributortConfig({
        lcd,
      })(addressProvider),
    );
  });

export default {
  menu: undefined,
  query,
};
