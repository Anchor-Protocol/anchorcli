import {
  createExecMenu,
  createQueryMenu,
  getLCDClient,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';
import { MsgExecuteContract } from '@terra-money/terra.js';
import {
  AddressProvider,
  fabricateAirdropClaim,
} from '@anchor-protocol/anchor.js';
import { CLIKey } from '@terra-money/terra.js/dist/key/CLIKey';
import {
  AddressProviderFromJSON,
  resolveChainIDToNetworkName,
} from '../../addresses/from-json';
import * as Parse from '../../util/parse-input';
import fetch from 'cross-fetch';

const menu = createExecMenu(
  'airdrop',
  'Anchor Airdrop contract functions [mainnet only]',
);

interface Claim {
  stage?: string;
  amount?: string;
}
const claim = menu
  .command('claim')
  .description(`Claim ANC airdrop reward`)
  .option(
    '--stage <int>',
    '(int) stage of airdrop to claim, if undefined send message for all unclaimed airdrops',
  )
  .option(
    '--amount <int>',
    "'(Uint128) amount of ANC tokens to claim. If omitted, total amount will be fetched via Anchor API to claim all.'",
  )
  .action(async ({ stage, amount }: Claim) => {
    const key = new CLIKey({ keyName: menu.from });
    const userAddress = key.accAddress;
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(menu.chainId),
    );
    if (stage === undefined) {
      await handleExecCommand(
        menu,
        await send_claim(userAddress, addressProvider, menu.chainId),
      );
    } else {
      await handleExecCommand(
        menu,
        await send_claim_with_stage(
          userAddress,
          addressProvider,
          menu.chainId,
          stage,
          amount,
        ),
      );
    }
  });

const query = createQueryMenu(
  'airdrop',
  'Anchor Airdrop contract queries [mainnet only]',
);

const getIsClaimed = query
  .command('is-claimed <address> <stage>')
  .description('Query whether airdrop stage is claimed', {
    address: '(AccAddress) account to query',
    stage: '(int) stage of airdrop',
  })
  .action(async (address: string, stage: string) => {
    const addressProvider = new AddressProviderFromJSON(
      resolveChainIDToNetworkName(query.chainId),
    );
    await handleQueryCommand(
      query,
      await isClaimed(
        Parse.int(stage),
        address,
        addressProvider,
        query.chainId,
      ),
    );
  });

// const getLatestStage = query
//     .command('latest-stage')
//     .description('Query the latest stage of airdrop')
//     .action(async () => {});
//
// const getMerkleRoot = query
//     .command('merkle-root <stage>')
//     .description('Query merkle root of airdrop', {
//         stage: '(int) stage of airdrop',
//     })
//     .action(async (stage: string) => {
//     });

export default {
  menu,
  query,
};

interface Airdrop {
  createdAt: string;
  id: number;
  stage: number;
  address: string;
  staked: string;
  total: string;
  rate: string;
  amount: string;
  proof: string;
  merkleRoot: string;
  claimable: boolean;
}

async function get_airdrops(address: string): Promise<Airdrop[]> {
  return fetch(
    `https://airdrop.anchorprotocol.com/api/get?address=${address}&chainId=columbus-4`,
  ).then((response) => {
    if (!response.ok) {
      console.log('ERROR');
    }
    return response.json();
  });
}

async function send_claim(
  address: string,
  addressProvider: AddressProviderFromJSON,
  chainId: string,
): Promise<MsgExecuteContract[]> {
  const airdrops = await get_airdrops(address);
  let msgs: MsgExecuteContract[] = [];

  for (const stageData of airdrops) {
    const claimable = await isClaimed(
      stageData.stage,
      address,
      addressProvider,
      chainId,
    );
    if (!claimable.is_claimed) {
      const airdrop_claim = await fabricateAirdropClaim({
        address: address,
        amount: stageData.amount,
        proof: JSON.parse(stageData.proof.toString()) as [string],
        stage: stageData.stage,
      })(addressProvider);

      msgs.push(airdrop_claim[0]);
    }
  }
  return msgs;
}

async function send_claim_with_stage(
  address: string,
  addressProvider: AddressProviderFromJSON,
  chainId: string,
  stage: string,
  amount?: string,
): Promise<MsgExecuteContract[]> {
  const airdrops = await get_airdrops(address);
  let msgs: MsgExecuteContract[] = [];
  let proof: string[];

  airdrops
    .filter((airdrop) => airdrop.stage === Parse.int(stage))
    .map(async (airdrop) => {
      const claimable = await isClaimed(
        airdrop.stage,
        address,
        addressProvider,
        chainId,
      );
      if (!claimable.is_claimed) {
        if (amount === undefined) {
          amount = airdrop.amount;
        }
        proof = JSON.parse(airdrop.proof);
        return;
      } else {
        throw new Error(`Stage ${stage} is already claimed`);
      }
    });
  msgs.push(
    await fabricateAirdropClaim({
      address: address,
      stage: Parse.int(stage),
      amount: amount,
      proof: proof,
    })(addressProvider)[0],
  );
  return msgs;
}

interface IsClaimedResponse {
  is_claimed: boolean;
}

async function isClaimed(
  stage: number,
  address: string,
  addressProvider: AddressProviderFromJSON,
  chainId: string,
): Promise<IsClaimedResponse> {
  const lcd = getLCDClient(chainId);
  const query: IsClaimedResponse = await lcd.wasm.contractQuery(
    addressProvider.addressesMap.airdrop,
    {
      is_claimed: {
        stage: stage,
        address: address,
      },
    },
  );
  return query;
}
