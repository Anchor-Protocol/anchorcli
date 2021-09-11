import {
  createExecMenu,
  createQueryMenu,
  getLCDClient,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';
import { CLIKey } from '@terra-money/terra.js/dist/key/CLIKey';
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from '../../addresses/from-json';
import {
  ExecuteMsg,
  fabricateGovCastVote,
  fabricateGovCreatePoll,
  fabricateGovEndPoll,
  fabricateGovExecutePoll,
  fabricateGovExpirePoll,
  fabricateGovSnapshotPoll,
  fabricateGovStakeVoting,
  fabricateGovUpdateConfig,
  fabricateGovWithdrawVotingTokens,
  queryGovConfig,
  queryGovPoll,
  queryGovPolls,
  queryGovStaker,
  queryGovState,
  queryGovVoters,
} from '@anchor-protocol/anchor.js';
import * as Parse from '../../util/parse-input';
import int = Parse.int;

const menu = createExecMenu('gov', 'Anchor Gov contract functions');

interface UpdateConfig {
  owner: string;
  effectiveDelay: number;
  expirationPeriod: number;
  proposalDeposit: string;
  quorum: string;
  threshold: string;
  votingPeriod: number;
  snapshotPeriod: number;
}

const updateConfig = menu
  .command('update-config')
  .description(`Update Anchor Gov config`)
  .option('--owner <AccAddress>', 'New owner address')
  .option('--effective-delay <int>', 'New effective delay')
  .option('--expiration-period <int>', 'New expiration period')
  .option('--proposal-deposit <Uint128>', 'New min proposal deposit')
  .option('--quorum <dec>', 'New quorum %')
  .option('--threshold <dec>', 'New threshold %')
  .option('--voting-period <int>', 'New voting period (sec)')
  .action(
    async ({
      owner,
      effectiveDelay,
      expirationPeriod,
      proposalDeposit,
      quorum,
      threshold,
      votingPeriod,
      snapshotPeriod,
    }: UpdateConfig) => {
      const key = new CLIKey({ keyName: menu.from });
      const userAddress = key.accAddress;
      const addressProvider = new AddressProviderFromJSON(
        resolveChainIDToNetworkName(menu.chainId),
      );
      const msgs = fabricateGovUpdateConfig({
        address: userAddress,
        owner,
        timelock_period: effectiveDelay,
        expiration_period: expirationPeriod,
        proposal_deposit: proposalDeposit,
        quorum,
        threshold,
        voting_period: votingPeriod,
        snapshot_period: snapshotPeriod,
      })(addressProvider);

      await handleExecCommand(menu, msgs);
    },
  );

const castVote = menu
  .command('cast-vote <poll-id> <vote-option> <amount>')
  .description(`Vote in an active poll`, {
    'poll-id': '(int) Poll ID',
    'vote-option': `(string) 'yes' or 'no'`,
    amount: '(Uint128) amount of staked ANC voting power to allocate',
  })
  .action(async (pollId: string, voteOption: string, amount: string) => {
    if (voteOption !== 'yes' && voteOption !== 'no') {
      throw new Error(
        `invalid vote option '${voteOption}', MUST be 'yes' or 'no'`,
      );
    }
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    await handleExecCommand(
      menu,
      fabricateGovCastVote({
        address: userAddress,
        poll_id: int(pollId),
        vote: voteOption,
        amount: amount,
      })(addressProvider),
    );
  });

interface CreatePoll {
  title: string;
  desc: string;
  deposit: string;
  link: string;
  executeTo: string;
  executeMsg: ExecuteMsg[];
}
const createPoll = menu
  .command('create-poll')
  .description(`Create a new poll`)
  .requiredOption('--title <string>', '*Title of poll')
  .requiredOption('--desc <string>', '*Poll description')
  .requiredOption('--deposit <Uint128>', '*deposit amount of ANC tokens')
  .option('--link <url>', 'URL with more information')
  .option(
    '--execute-to <AccAddress>',
    'contract to execute on (specify message with --execute-msg)',
  )
  .option('--execute-msg <json>', 'message to execute')
  .action(async ({ title, desc, deposit, link, executeMsg }: CreatePoll) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    handleExecCommand(
      menu,
      fabricateGovCreatePoll({
        address: userAddress,
        title: title,
        amount: deposit,
        description: desc,
        link: link,
        execute_msgs: executeMsg,
      })(addressProvider),
    );
  });

const executePoll = menu
  .command('execute-poll <poll-id>')
  .description(`Execute the poll`, {
    pollId: '(int) poll id',
  })
  .action(async (pollId: string) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    handleExecCommand(
      menu,
      fabricateGovExecutePoll({
        address: userAddress,
        poll_id: int(pollId),
      })(addressProvider),
    );
  });

const endPoll = menu
  .command('end-poll <poll-id>')
  .description(`End a poll`, {
    pollId: '(int) poll id',
  })
  .action(async (pollId: string) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    handleExecCommand(
      menu,
      fabricateGovEndPoll({
        address: userAddress,
        poll_id: int(pollId),
      })(addressProvider),
    );
  });

const expirePoll = menu
  .command('expire-poll <poll-id>')
  .description(`Expire a poll`, {
    pollId: '(int) poll id',
  })
  .action(async (pollId: string) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    handleExecCommand(
      menu,
      fabricateGovExpirePoll({
        address: userAddress,
        poll_id: int(pollId),
      })(addressProvider),
    );
  });

const snapshotPoll = menu
  .command('snapshot-poll <poll-id>')
  .description(`Snapshot a poll`, {
    pollId: '(int) poll id',
  })
  .action(async (pollId: string) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    handleExecCommand(
      menu,
      fabricateGovSnapshotPoll({
        address: userAddress,
        poll_id: int(pollId),
      })(addressProvider),
    );
  });

interface Stake {
  amount: string;
}

const stake = menu
  .command('stake')
  .description(`Stake ANC tokens in governance`)
  .requiredOption(
    '--amount <string>',
    '(Uint128) amount of ANC tokens to stake',
  )
  .action(async ({ amount }: Stake) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    handleExecCommand(
      menu,
      fabricateGovStakeVoting({
        address: userAddress,
        amount: amount,
      })(addressProvider),
    );
  });

const withdraw = menu
  .command('withdraw-voting <amount>')
  .description(`Withdraw ANC tokens in governance`, {
    amount: '(Uint128) amount of ANC tokens to stake',
  })
  .action(async (amount: string) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    handleExecCommand(
      menu,
      fabricateGovWithdrawVotingTokens({
        address: userAddress,
        amount: amount,
      })(addressProvider),
    );
  });

const query = createQueryMenu('gov', 'Anchor Gov contract queries');
const getConfig = query
  .command('config')
  .description('Query Anchor Gov contract config')
  .action(async () => {
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const lcd = getLCDClient(query.chainId);

    await handleQueryCommand(
      query,
      await queryGovConfig({
        lcd,
      })(addressProvider),
    );
  });

const getPoll = query
  .command('poll <poll-id>')
  .description('Query poll')
  .action(async (pollId: string) => {
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const lcd = getLCDClient(query.chainId);
    await handleQueryCommand(
      query,
      await queryGovPoll({
        lcd,
        poll_id: int(pollId),
      })(addressProvider),
    );
  });

const getPolls = query
  .command('polls')
  .description('Query all polls')
  .option(
    '--filter <string>',
    `poll state to filter ('in_progress', 'passed', 'rejected', 'executed')`,
  )
  .option('--start-after <int>', 'poll ID to start query from')
  .option('--limit <int>', 'max results to return')
  .action(async () => {
    if (
      getPolls.filter &&
      !['in_progress', 'passed', 'rejected', 'executed'].includes(
        getPolls.filter,
      )
    ) {
      throw new Error(
        `invalid filter ${getPolls.filter}; MUST be one of: 'in_progress', 'passed', 'rejected', 'executed'`,
      );
    }
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const lcd = getLCDClient(query.chainId);
    await handleQueryCommand(
      query,
      await queryGovPolls({
        lcd,
        filter: getPolls.filter,
        start_after: Number(getPolls.startAfter),
        limit: Number(getPolls.limit),
      })(addressProvider),
    );
  });

const getStaker = query
  .command('staker <address>')
  .description('Query ANC staker', {
    staker: '(AccAddress) staker address to query',
  })
  .action(async (address: string) => {
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const lcd = getLCDClient(query.chainId);
    await handleQueryCommand(
      query,
      await queryGovStaker({
        lcd,
        address: address,
      })(addressProvider),
    );
  });

const getState = query
  .command('state')
  .description('Query ANC Gov state')
  .action(async () => {
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const lcd = getLCDClient(query.chainId);
    await handleQueryCommand(
      query,
      await queryGovState({
        lcd,
      })(addressProvider),
    );
  });

const getVoters = query
  .command('voters <poll-id>')
  .description('Query voter for a poll')
  .option('--start-after <string>', 'voter prefix to start query from')
  .option('--limit <int>', 'max results to return')
  .action(async (pollId: string) => {
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    const lcd = getLCDClient(query.chainId);
    await handleQueryCommand(
      query,
      await queryGovVoters({
        lcd,
        poll_id: int(pollId),
        start_after: getVoters.startAfter,
        limit: getVoters.limit,
      })(addressProvider),
    );
  });

export default {
  menu,
  query,
};
