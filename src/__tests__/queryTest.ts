import * as path from 'path'
import { exec, ExecException } from 'child_process'


interface CliResult {
  error: ExecException
  stdout: string
  stderr: string
}

const testAddress = 'terra1us9cs88cxhcqclusvs4lxw0pfesc8y6f44hr3u'
const anchorPair = 'terra1gm5p3ner9x9xpwugn9sp6gvhd0lwrtkyrecdn3'
const bLunaPair = 'terra1jxazgm67et0ce260kvrpfv50acuushpjsz2y0p'
const bLuna = 'terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp'
const bEth = 'terra1dzhzukyezv0etz22ud940z7adyv7xgcjkahuun'

//query test is for mainnet, before test do $export ANCHORCLI_NETWORK=columbus-5 (mainnet)

//airdrop
describe('airdrop queries', () => {
  test('airdrop query claimed', async () => {
    const result = await cli(['q','airdrop','is-claimed', testAddress, '1'])
    expect(result.stdout).toContain('is_claimed')
  });

});

//anc
describe('anc queries', () => {
  test('anc token-info', async () => {
    const result = await cli(['q', 'anc', 'token-info'])
    expect(result.stdout).toContain('Anchor Token')
  });

  test('anc balance', async () => {
    const result = await cli(['q', 'anc', 'balance', '--address', testAddress])
    expect(result.stdout).toContain('balance')
  });

  test('anc minter', async () => {
    const result = await cli(['q', 'anc', 'minter'])
    expect(result.stdout).toContain('terra1f32xyep306hhcxxxf7mlyh0ucggc00rm2s9da5')
  });

  test('anc allowance', async () => {
    const result = await cli(['q', 'anc', 'allowance', '--owner', testAddress, '--spender', anchorPair])
    expect(result.stdout).toContain('allowance')
  });

  test('anc all allowances', async () => {
    const result = await cli(['q', 'anc', 'all-allowances', '--owner', testAddress])
    expect(result.stdout).toContain('allowances')
  });

  test('anc all accounts', async () => {
    const result = await cli(['q', 'anc', 'all-accounts', '--start-after', testAddress])
    expect(result.stdout).toContain('accounts')
  });
})

//aterra
describe('aterra queries', () => {
  test('aterra token-info', async () => {
    const result = await cli(['q', 'aust', 'token-info'])
    expect(result.stdout).toContain('Anchor Terra USD')
  });

  test('aterra balance', async () => {
    const result = await cli(['q', 'aust', 'balance', '--address', testAddress])
    expect(result.stdout).toContain('balance')
  });

  test('aterra balance', async () => {
    const result = await cli(['q', 'aust', 'minter'])
    expect(result.stdout).toContain('terra1sepfj7s0aeg5967uxnfk4thzlerrsktkpelm5s')
  });

  test('aterra allowance', async () => {
    const result = await cli(['q', 'aust', 'allowance', '--owner', testAddress, '--spender', anchorPair])
    expect(result.stdout).toContain('allowance')
  });

  test('aterra all allowances', async () => {
    const result = await cli(['q', 'aust', 'all-allowances', '--owner', testAddress])
    expect(result.stdout).toContain('allowances')
  });

  test('aterra all accounts', async () => {
    const result = await cli(['q', 'aust', 'all-accounts', '--start-after', testAddress])
    expect(result.stdout).toContain('accounts')
  });
});

//basset hub
describe('basset hub queries', () => {
  test('basset hub current-batch', async () => {
    const result = await cli(['q', 'basset-hub', 'current-batch'])
    expect(result.stdout).toContain('requested_with_fee')
  });

  test('basset hub all history', async () => {
    const result = await cli(['q', 'basset-hub', 'all-history'])
    expect(result.stdout).toContain('applied_exchange_rate')
  });

  test('basset hub params', async () => {
    const result = await cli(['q', 'basset-hub', 'whitelisted-validators'])
    expect(result.stdout).toContain('terravaloper')
  });

  test('basset hub unbond requests', async () => {
    const result = await cli(['q', 'basset-hub', 'unbond-requests', '--address', testAddress])
    expect(result.stdout).toContain('requests')
  });

  test('basset hub withdrawable unbonded', async () => {
    const result = await cli(['q', 'basset-hub', 'withdrawable-unbonded', '--address', testAddress, '--block-time', '3000000'])
    expect(result.stdout).toContain('withdrawable')
  });

  test('basset hub state', async () => {
    const result = await cli(['q', 'basset-hub', 'state'])
    expect(result.stdout).toContain('exchange_rate')
  });
});

//basset reward
describe('basset reward queries', () => {
  test('basset reward config', async () => {
    const result = await cli(['q', 'basset-reward', 'config'])
    expect(result.stdout).toContain('hub_contract')
  });

  test('basset reward state', async () => {
    const result = await cli(['q', 'basset-reward', 'state'])
    expect(result.stdout).toContain('global_index')
  });

  test('basset reward accrued rewards', async () => {
    const result = await cli(['q', 'basset-reward', 'accrued-rewards', '--address', testAddress])
    expect(result.stdout).toContain('rewards')
  });

  test('basset reward holder', async () => {
    const result = await cli(['q', 'basset-reward', 'holders', '--start-after', testAddress])
    expect(result.stdout).toContain('holders')
  });
});


//basset token
describe('basset token queries', () => {
  test('basset token token info', async () => {
    const result = await cli(['q', 'basset-token', 'token-info'])
    expect(result.stdout).toContain('Bonded Luna')
  });

  test('basset token balance', async () => {
    const result = await cli(['q', 'basset-token', 'balance', '--address', testAddress])
    expect(result.stdout).toContain('balance')
  });

  test('basset token minter', async () => {
    const result = await cli(['q', 'basset-token', 'minter'])
    expect(result.stdout).toContain('terra1mtwph2juhj0rvjz7dy92gvl6xvukaxu8rfv8ts')
  });

  test('basset token allowance', async () => {
    const result = await cli(['q', 'basset-token', 'allowance', '--owner', testAddress, '--spender', bLunaPair])
    expect(result.stdout).toContain('allowance')
  });

  test('basset token all allowances', async () => {
    const result = await cli(['q', 'basset-token', 'all-allowances', '--owner', testAddress])
    expect(result.stdout).toContain('allowances')
  });

  test('basset token all accounts', async () => {
    const result = await cli(['q', 'basset-token', 'all-accounts', '--start-after', testAddress])
    expect(result.stdout).toContain('accounts')
  });
});

//beth reward
describe('beth reward queries', () => {
  test('beth reward config', async () => {
    const result = await cli(['q', 'beth-reward', 'config'])
    expect(result.stdout).toContain('token_contract')
  });

  test('beth reward state', async () => {
    const result = await cli(['q', 'beth-reward', 'state'])
    expect(result.stdout).toContain('global_index')
  });

  test('beth reward accrued rewards', async () => {
    const result = await cli(['q', 'beth-reward', 'accrued-rewards', '--address', testAddress])
    expect(result.stdout).toContain('rewards')
  });

  test('beth reward holder', async () => {
    const result = await cli(['q', 'beth-reward', 'holders', '--start-after', testAddress])
    expect(result.stdout).toContain('holders')
  });
});

//beth token
describe('beth token queries', () => {
  test('beth token token info', async () => {
    const result = await cli(['q', 'beth-token', 'token-info'])
    expect(result.stdout).toContain('Bonded ETH')
  });

  test('beth token balance', async () => {
    const result = await cli(['q', 'beth-token', 'balance', '--address', testAddress])
    expect(result.stdout).toContain('balance')
  });

  test('beth token minter', async () => {
    const result = await cli(['q', 'beth-token', 'minter'])
    expect(result.stdout).toContain('terra13yxhrk08qvdf5zdc9ss5mwsg5sf7zva9xrgwgc')
  });

  test('beth token allowance', async () => {
    const result = await cli(['q', 'beth-token', 'allowance', '--owner', testAddress, '--spender', bLunaPair])
    expect(result.stdout).toContain('allowance')
  });

  test('beth token all allowances', async () => {
    const result = await cli(['q', 'beth-token', 'all-allowances', '--owner', testAddress])
    expect(result.stdout).toContain('allowances')
  });

  test('beth token all accounts', async () => {
    const result = await cli(['q', 'beth-token', 'all-accounts', '--start-after', testAddress])
    expect(result.stdout).toContain('accounts')
  });
});

//collector
describe('colletor queries', () => {
  test('collector config', async () => {
    const result = await cli(['q', 'collector', 'config'])
    expect(result.stdout).toContain('gov_contract')
  })
});

//community
describe('community queries', () => {
  test('community config', async () => {
    const result = await cli(['q', 'community', 'config'])
    expect(result.stdout).toContain('spend_limit')
  })
});

//distributor
describe('distributor queries', () => {
  test('distributor config', async () => {
    const result = await cli(['q', 'distributor', 'config'])
    expect(result.stdout).toContain('spend_limit')
  })
});

//gov
describe('gov queries', () => {
  test('gov config', async () => {
    const result = await cli(['q', 'gov', 'config'])
    expect(result.stdout).toContain('proposal_deposit')
  })

  test('gov poll', async () => {
    const result = await cli(['q', 'gov', 'poll', '1'])
    expect(result.stdout).toContain('yes_votes')
  })

  test('gov polls', async () => {
    const result = await cli(['q', 'gov', 'polls', '--filter', 'executed', '--start-after', '4', 'limit', '1'])
    expect(result.stdout).toContain('yes_votes')
  })

  test('gov state', async () => {
    const result = await cli(['q', 'gov', 'state'])
    expect(result.stdout).toContain('poll_count')
  })

  test('gov voters', async () => {
    const result = await cli(['q', 'gov', 'voters', '1'])
    expect(result.stdout).toContain('voters')
  })
});

//bluna custody
describe('money market custody queries', () => {
  test('bluna custody borrower', async () => {
    const result = await cli(['q', 'custody-bluna', 'borrower', '--address', testAddress])
    expect(result.stdout).toContain('spendable')
  })

  test('bluna custody borrowers', async () => {
    const result = await cli(['q', 'custody-bluna', 'borrowers', '--start-after', testAddress, '--limit', '5'])
    expect(result.stdout).toContain('spendable')
  })

  test('bluna custody config', async () => {
    const result = await cli(['q', 'custody-bluna', 'config'])
    expect(result.stdout).toContain('BLUNA')
  })
});

//beth custody
describe('money market beth custody queries', () => {
  test('beth custody borrower', async () => {
    const result = await cli(['q', 'custody-beth', 'borrower', '--address', testAddress])
    expect(result.stdout).toContain('spendable')
  })

  test('beth custody borrowers', async () => {
    const result = await cli(['q', 'custody-beth', 'borrowers', '--start-after', testAddress, '--limit', '5'])
    expect(result.stdout).toContain('spendable')
  })

  test('beth custody config', async () => {
    const result = await cli(['q', 'custody-beth', 'config'])
    expect(result.stdout).toContain('BETH')
  })
});

//interest
describe('money market interest queries', () => {
  test('interest borrow-rate', async () => {
    const result = await cli(['q', 'interest', 'borrow-rate', '--market-balance', '100', '--total-liabilities', '100', '--total-reserves', '10'])
    expect(result.stdout).toContain('rate')
  })

  test('interest config', async () => {
    const result = await cli(['q', 'interest', 'config'])
    expect(result.stdout).toContain('interest_multiplier')
  })
});

//liquidation
describe('money market liquidation queries', () => {
  test('liquidation bid', async () => {
    const result = await cli(['q', 'liquidation', 'bid', '--collateral-token', bLuna, '--bidder', 'terra18kgwjqrm7mcnlzcy7l8h7awnn7fs2pvdl2tpm9'])
    expect(result.stdout).toContain('premium_rate')
  })

  test('liquidation bids by user', async () => {
    const result = await cli(['q', 'liquidation', 'bids-by-user', '--bidder', testAddress, '--start-after', bEth, '--limit', '1'])
    expect(result.stdout).toContain('bids')
  })

  test('liquidation bids by collateral', async () => {
    const result = await cli(['q', 'liquidation', 'bids-by-collateral', '--collateral-token', bEth, '--start-after', testAddress, '--limit', '3'])
    expect(result.stdout).toContain('bids')
  })

  test('liquidation config', async () => {
    const result = await cli(['q', 'liquidation', 'config'])
    expect(result.stdout).toContain('safe_ratio')
  })
});

//market
describe('money market market queries', () => {
  test('market config', async () => {
    const result = await cli(['q', 'market', 'config'])
    expect(result.stdout).toContain('max_borrow_factor')
  })

  test('market epoch-state', async () => {
    const result = await cli(['q', 'market', 'epoch-state'])
    expect(result.stdout).toContain('exchange_rate')
  })

  test('market liabilities', async () => {
    const result = await cli(['q', 'market', 'liabilities', '--start-after', testAddress, '--limit', '3'])
    expect(result.stdout).toContain('pending_rewards')
  })

  test('liquidation liability', async () => {
    const result = await cli(['q', 'market', 'state'])
    expect(result.stdout).toContain('prev_exchange_rate')
  })
});

describe('money market oracle queries', () => {
  test('oracle config', async () => {
    const result = await cli(['q', 'oracle', 'config'])
    expect(result.stdout).toContain('base_asset')
  })

  test('oracle price', async () => {
    const result = await cli(['q', 'oracle', 'price', '--base', bLuna, '--quote', 'uusd'])
    expect(result.stdout).toContain('last_updated_base')
  })

  test('oracle prices', async () => {
    const result = await cli(['q', 'oracle', 'prices', '--start-after', bEth, '--limit', '1'])
    expect(result.stdout).toContain('last_updated_time')
  })
});

describe('money market overseer queries', () => {
  test('overseer all collaterals', async () => {
    const result = await cli(['q', 'overseer', 'all-collaterals', '--start-after', testAddress, '--limit', '5'])
    expect(result.stdout).toContain('all_collaterals')
  })

  test('overseer borrow limit', async () => {
    const result = await cli(['q', 'overseer', 'borrow-limit', '--borrower', testAddress, '--block-time', '50000000'])
    expect(result.stdout).toContain('borrow_limit')
  })

  test('overseer collaterals', async () => {
    const result = await cli(['q', 'overseer', 'collaterals', '--borrower', testAddress])
    expect(result.stdout).toContain('collaterals')
  })

  test('overseer config', async () => {
    const result = await cli(['q', 'overseer', 'config'])
    expect(result.stdout).toContain('target_deposit_rate')
  })

  test('overseer epoch state', async () => {
    const result = await cli(['q', 'overseer', 'epoch-state'])
    expect(result.stdout).toContain('prev_interest_buffer')
  })

  test('overseer whitelist select collateral', async () => {
    const result = await cli(['q', 'overseer', 'whitelist', '--collateral-token', bEth])
    expect(result.stdout).toContain('Bonded ETH')
  })

  test('overseer whitelist start-after', async () => {
    const result = await cli(['q', 'overseer', 'whitelist', '--start-after', bEth, '--limit', '1'])
    expect(result.stdout).toContain('Bonded Luna')
  })
});

describe('staking queries', () => {
  test('staking config', async () => {
    const result = await cli(['q', 'staking', 'config'])
    expect(result.stdout).toContain('distribution_schedule')
  })

  test('staking state', async () => {
    const result = await cli(['q', 'staking', 'state'])
    expect(result.stdout).toContain('global_reward_index')
  })

  test('staking reward info', async () => {
    const result = await cli(['q', 'staking', 'reward-info', testAddress])
    expect(result.stdout).toContain('reward_index')
  })
})

describe('terraswap queries', () => {
  test('terraswap pool anc-ust', async () => {
    const result = await cli(['q', 'terraswap', 'pool', '--anc-ust'])
    expect(result.stdout).toContain('assets')
  })

  test('terraswap pool bluna-luna', async () => {
    const result = await cli(['q', 'terraswap', 'pool', '--bluna-luna'])
    expect(result.stdout).toContain('assets')
  })

  test('terraswap pair anc-ust', async () => {
    const result = await cli(['q', 'terraswap', 'pair', '--anc-ust'])
    expect(result.stdout).toContain('asset_infos')
  })

  test('terraswap pool bluna-luna', async () => {
    const result = await cli(['q', 'terraswap', 'pair', '--bluna-luna'])
    expect(result.stdout).toContain('asset_infos')
  })
})

const cliPath = path.resolve('./bin/anchorcli')

async function cli(args: string[]): Promise<CliResult> {
  
  return new Promise(resolve => {  
    exec(
      `${cliPath} ${args.join(' ')}`,
      {}, 
      (error, stdout, stderr) => {resolve({        
        error,
        stdout,
        stderr 
      })
    })
  })
}