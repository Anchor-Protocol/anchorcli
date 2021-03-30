# `anchorcli` <!-- omit in toc -->

Command-line interface for Anchor Protocol on Terra.

## Table of Contents <!-- omit in toc -->
- [Setup](#setup)
- [Configuration](#configuration)
  - [Specifying LCD settings](#specifying-lcd-settings)
  - [Specifying Contracts](#specifying-contracts)
- [Usage](#usage)
  - [Execute](#execute)
  - [Query](#query)
- [Examples](#examples)
  - [Bond bLuna](#bond-bluna)
  - [Query bLuna Balance](#query-bluna-balance)
- [License](#license)
## Setup

**Requirements**

- Node.js 12+
- NPM,
- [`terracli`](https://github.com/terra-project/core) in your path.

`anchorcli` can be installed off NPM.
****
```bash
$ npm install -g @anchor-protocol/cli
```
The entrypoint `anchorcli` should then be available in your `path`:

<pre>
         <div align="left">
        <strong>$ anchorcli</strong>
        
        Usage: anchorcli [options] [command]

        Command-line interface for interacting with Anchor Protocol on Terra

        Options:
          -V, --version   output the version number
          -v,--verbose    Show verbose error logs
          -h, --help      display help for command

        Commands:
          menu|x          Execute a function on a smart contract
          query|q         Run a smart contract query function
          help [command]  display help for command
        </div>
</pre>

## Configuration
By default, `anchorcli` works with the default configuration which is set to be for contracts on `tequila-0004`. 
This setting provides the address of contracts and specifies the setting for LCD provider, gas prices for fee estimation.

### Specifying LCD settings
Each network config should define how to connect to the Terra blockchain via LCD parameters.
```json
{
"lcd": {
    "chainID": "tequila-0004",
    "URL": "https://tequila-lcd.terra.dev",
    "gasPrices": {
      "uluna": 0.15,
      "usdr": 0.1018,
      "uusd": 0.15,
      "ukrw": 178.05,
      "umnt": 431.6259
    },
    "gasAdjustment": 1.2
  }
}
```

### Specifying Contracts
Each address configuration should point to the correct Anchor core contract addresses.
```json
{
 "contracts": {
    "bLunaHub": "terra1kzx23xs8v9yggf6lqpwgerg455e8xzsv0s0glf",
    "bAssetToken": "terra12kz7ehjh9m2aexmyumlt29qjuc9j5mjcdp0d5k",
    "bAssetReward": "terra1pjpzktukkd20amfwc0d8mahjg5na2pgu3swdu4",
    "mmInterest": "terra16f3lv77yu4ga4w8m7jl0xg2xkavqe347dz30v9",
    "mmOracle": "terra1enud48d754pau5rce79xsdx9gfschw2eelwcuj",
    "mmMarket": "terra1r8vmgf3mf5m5gcp09fnj2ewsyaqppr6ke50mf2",
    "mmOverseer": "terra1t6zjqmqjvsfrszr65cppug4gd4xkqm33vugwl2",
    "mmCustody": "terra1usycpap7j0mz4ynrgmtv7jc7uwqka345ushknz",
    "mmLiquidation": "terra14pdcpx6szzfvhz4g6dfddkx82f5ssf8llmzpw4",
    "anchorToken": "terra10c0q6qyk2634tfx2nw9v4gxqlm7a0luk9huhy8",
    "terraswapFactory": "terra1mtvsarza55hehpmyjgw7edqwvxpq5qquvttz9n",
    "terraswapPair": "terra1w6qcjvcwe8ljafp2859kmmcfern35ap9sngm3q",
    "blunaBurn": {
      "uluna": "terra12y3emkv22ug94wnq5zpmhws6fgtr929rtaq6je"
    }
  }
}
```
## Usage

`anchorcli` allows you to:

- [**execute**](#execute) state-changing functions on Anchor smart contracts
- [**query**](#query) readonly data endpoints on Anchor smart contracts

### Execute

**USAGE: `anchorcli exec|x [options] [command]`**

```
Execute a function on a smart contract

Options:
  --yaml                         Encode result as YAML instead of JSON
  -y,--yes                       Sign transaction without confirming (yes)
  --home <string>                Directory for config of terracli
  --from <key-name>              *Name of key in terracli keyring
  --generate-only                Build an unsigned transaction and write it to stdout
  -G,--generate-msg              Build an ExecuteMsg (good for including in poll)
  --base64                       For --generate-msg: returns msg as base64
  -b,--broadcast-mode <string>   Transaction broadcasting mode (sync|async|block) (default: sync) (default: "sync")
  --chain-id <string>            Chain ID of Terra node
  -a,--account-number <int>      The account number of the signing account (offline mode)
  -s,--sequence <int>            The sequence number of the signing account (offline mode)
  --memo <string>                Memo to send along with transaction
  --fees <coins>                 Fees to pay along with transaction
  --gas <int|auto>               *Gas limit to set per-transaction; set to "auto" to calculate required gas automatically
  --gas-adjustment <float>       Adjustment factor to be multiplied against the estimate returned by the tx simulation
  --gas-prices <coins>           Gas prices to determine the transaction fee (e.g. 10uluna,12.5ukrw)
  -h, --help                     display help for command

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
## Examples
This section illustrates the usage of `anchorcli` through some use cases. 
All examples assume you have a key in `terracli` keychain called `test1`.

### Bond bLuna 
The anchor protocol requires you to provide collateral to be able to borrow. In order to provide collateral, a user needs to bond luna first, the contract will issue bLuna for the user. The following example is the way a user can bond luna to gain bluna: 
```bash
anchorcli x basset-hub bond --amount $BOND_AMOUNT --validator $VALIDATOR_ADDRESS --from test1 --gas auto --fees 100000uluna --b block
```
### Query bLuna Balance
After bonding your luna, you can get your bLuna balance with the following query: 
```bash
anchorcli q basset-token balance --address $USER_ADDRESS
```

## License

This software is licensed under the Apache 2.0 license. Read more about it [here](./LICENSE).

© 2021 Anchor Protocol