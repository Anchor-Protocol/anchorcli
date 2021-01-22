# `anchorcli` <!-- omit in toc -->

Command-line interface for Anchor Protocol on Terra.

## Table of Contents <!-- omit in toc -->
- [Setup](#setup)
- [Usage](#usage)
  - [Execute](#execute)
  - [Query](#query)
- [License](#license)
## Setup

**Requirements**

- Node.js 12+
- NPM, yarn
- [`terracli`](https://github.com/terra-project/core) in your path

****
Insert this line in the terminal:

```bash
$ yarn install
```

Directions on interacting with `anchorcli` would appear:

<pre>
        <div align="left">
        Usage: anchorcli [options] [command]

        Command-line interface for interacting with Anchor Protocol on Terra

        Options:
          -V, --version   output the version number
          -v,--verbose    Show verbose error logs
          -h, --help      display help for command

        Commands:
          exec|x          Execute a function on a smart contract
          query|q         Run a smart contract query function
          help [command]  display help for command
        </div>
</pre>


## Usage

`anchorcli` allows you to:

- [**execute**](#execute) state-changing functions on Anchor smart contracts
- [**query**](#query) readonly data endpoints on Anchor smart contracts

### Execute

**USAGE: `anchorcli exec|x [options] [command]`**

```
Execute a function on a smart contract

Options:
  -h, --help               display help for command

Commands:
  basset-hub [options]     Anchor bAsset Hub contract functions
  basset-reward [options]  Anchor bAsset reward contract functions
  basset-token [options]   Anchor bAsset token contract functions
  liquidation [options]    Anchor MoneyMarket Liquidation contract functions
  oracle [options]         Anchor MoneyMarket Liquidation contract functions
  market [options]         Anchor MoneyMarket Market contract functions
  custody [options]        Anchor MoneyMarket Custody contract functions
  overseer [options]       Anchor MoneyMarket Overseer contract functions
  interest [options]       Anchor MoneyMarket Interest contract functions
  help [command]           display help for command

```

### Query

**USAGE: `anchorcli query|q [options] [command]`**

```
Run a smart contract query function

Options:
  -h, --help               display help for command

Commands:
  basset-hub [options]     Anchor bAsset hub contract queries
  basset-reward [options]  Anchor bAsset reward contract queries
  basset-token [options]   Anchor bAsset token  contract queries
  liquidation [options]    Anchor liquidation contract queries
  oracle [options]         Anchor oracle contract queries
  market [options]         Anchor market contract queries
  custody [options]        Anchor custody contract queries
  overseer [options]       Anchor overseer contract queries
  interest [options]       Anchor interest contract queries
  help [command]           display help for command

```

## License

This software is licensed under the Apache 2.0 license. Read more about it [here](./LICENSE).

© 2021 Anchor Protocol