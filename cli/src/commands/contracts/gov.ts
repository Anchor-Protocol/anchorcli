// import * as _ from 'lodash';
//
// import {
//     createExecMenu,
//     createQueryMenu,
//     handleExecCommand,
//     handleQueryCommand,
// } from '../../util/contract-menu';
//
// const exec = createExecMenu('gov', 'Mirror Gov contract functions');
//
// const updateConfig = exec
//     .command('update-config')
//     .description(`Update Mirror Gov config`)
//     .option('--owner <AccAddress>', 'New owner address')
//     .option('--effective-delay <int>', 'New effective delay')
//     .option('--expiration-period <int>', 'New expiration period')
//     .option('--proposal-deposit <Uint128>', 'New min proposal deposit')
//     .option('--quorum <dec>', 'New quorum %')
//     .option('--threshold <dec>', 'New threshold %')
//     .option('--voting-period <int>', 'New voting period (sec)')
//     .action();
//
// const castVote = exec
//     .command('cast-vote <poll-id> <vote-option> <amount>')
//     .description(`Vote in an active poll`, {
//         'poll-id': '(int) Poll ID',
//         'vote-option': `(string) 'yes' or 'no'`,
//         amount: '(Uint128) amount of staked MIR voting power to allocate',
//     })
//     .action();
//
// const createPoll = exec
//     .command('create-poll')
//     .description(`Create a new poll`)
//     .requiredOption('--title <string>', '*Title of poll')
//     .requiredOption('--desc <string>', '*Poll description')
//     .requiredOption('--deposit <Uint128>', '*deposit amount of MIR tokens')
//     .option('--link <url>', 'URL with more information')
//     .option(
//         '--execute-to <AccAddress>',
//         'contract to execute on (specify message with --execute-msg)'
//     )
//     .option('--execute-msg <json>', 'message to execute')
//     .action();
//
// const executePoll = exec
//     .command('execute-poll <poll-id>')
//     .description(`Executes the poll`, {
//         pollId: '(int) poll id',
//     })
//     .action();
//
// const endPoll = exec
//     .command('end-poll <poll-id>')
//     .description(`Ends a poll`, {
//         pollId: '(int) poll id',
//     })
//     .action();
//
// const expirePoll = exec
//     .command('expire-poll <poll-id>')
//     .description(`Expires a poll`, {
//         pollId: '(int) poll id',
//     })
//     .action();
//
// const stake = exec
//     .command('stake <amount>')
//     .description(`Stake MIR tokens in governance`, {
//         amount: '(Uint128) amount of MIR tokens to stake',
//     })
//     .action();
//
// const unstake = exec
//     .command('unstake [amount]')
//     .description(`Unstake MIR tokens in governance`, {
//         amount: '(Uint128) amount of MIR tokens to unstake',
//     })
//     .action();
//
// const query = createQueryMenu('gov', 'Mirror Gov contract queries');
// const getConfig = query
//     .command('config')
//     .description('Query Mirror Gov contract config')
//     .action();
//
// const getPoll = query
//     .command('poll <poll-id>')
//     .description();
//
// const getPolls = query
//     .command('polls')
//     .description('Query all polls')
//     .option(
//         '--filter <string>',
//         `poll state to filter ('in_progress', 'passed', 'rejected', 'executed')`
//     )
//     .option('--start-after <int>', 'poll ID to start query from')
//     .option('--limit <int>', 'max results to return')
//     .action();
//
// const getStaker = query
//     .command('staker <address>')
//     .description('Query MIR staker', {
//         staker: '(AccAddress) staker address to query',
//     })
//     .action();
//
// const getState = query
//     .command('state')
//     .description('Query Mirror Gov state')
//     .action();
//
// const getVoters = query
//     .command('voters <poll-id>')
//     .description('Query voter for a poll')
//     .option('--start-after <string>', 'voter prefix to start query from')
//     .option('--limit <int>', 'max results to return')
//     .action();
//
// export default {
//     exec,
//     query,
// };
