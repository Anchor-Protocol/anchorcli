import { createExecMenu, handleExecCommand } from '../../util/contract-menu';
import {
  fabricateInvestorVestingClaim,
  fabricateInvestorVestingRegisterAccounts,
  fabricateInvestorVestingUpdateConfig,
} from '@anchor-protocol/anchor.js';
import { CLIKey } from '@terra-money/terra.js/dist/key/CLIKey';
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from '../../addresses/from-json';

const menu = createExecMenu(
  'investor-vesting',
  'Anchor Investor Vesting contract functions',
);

const addressProvider = new AddressProviderFromJSON(
  resolveChainIDToNetworkName(menu.chainId),
);

const claim = menu
  .command('claim <denom>')
  .description(`Claims vested ANC tokens`)
  .action(async () => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    await handleExecCommand(
      menu,
      await fabricateInvestorVestingClaim({
        address: userAddress,
      })(addressProvider),
    );
  });

interface RefisterAccounts {
  vesting_accounts: string[];
}

const registerAccounts = menu
  .command('register-accounts')
  .description(`Registers a new vesting account to the Vesting contract`)
  .option(
    '--accounts <json>',
    'List of accounts with ANC vesting and their vesting schedules',
  )
  .action(async ({ vesting_accounts }: RefisterAccounts) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    await handleExecCommand(
      menu,
      await fabricateInvestorVestingRegisterAccounts({
        address: userAddress,
        vesting_accounts,
      })(addressProvider),
    );
  });

interface UpdateConfig {
  owner?: string;
  anchorToken?: string;
  genesisTime?: string;
}
const updateConfig = menu
  .command('update-config')
  .description(`Updates the Vesting contract configuration`)
  .option('--owner <string>', 'Address of new contract owner')
  .option(
    '--anchor-token <string>',
    'New contract address of Anchor Token (ANC)',
  )
  .option(
    '--genesis-time <int>',
    'New block timestamp when Anchor Protocol launched',
  )
  .action(async ({ owner, anchorToken, genesisTime }: UpdateConfig) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    await handleExecCommand(
      menu,
      await fabricateInvestorVestingUpdateConfig({
        address: userAddress,
        owner: owner,
        genesis_time: genesisTime,
        anchor_token: anchorToken,
      })(addressProvider),
    );
  });

export default {
  menu,
  query: undefined,
};
