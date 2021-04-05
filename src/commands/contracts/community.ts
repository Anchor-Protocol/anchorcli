import {
  createExecMenu,
  createQueryMenu,
  getLCDClient,
  handleQueryCommand,
} from '../../util/contract-menu';
import { queryCommunityConfig } from '@anchor-protocol/anchor.js';
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from '../../addresses/from-json';
import * as commander from 'commander';

const query = createQueryMenu('community', 'Anchor Community contract queries');

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
      await queryCommunityConfig({
        lcd,
      })(addressProvider),
    );
  });

export default {
  menu: undefined,
  query,
};
