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

const addressProvider = new AddressProviderFromJSON(
  resolveChainIDToNetworkName(query.chainId),
);
const lcd = getLCDClient();

const getConfig = query
  .command('config')
  .description('Query Anchor Community contract config')
  .action(async () => {
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
