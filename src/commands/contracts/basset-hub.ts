import { Int } from '@terra-money/terra.js';
import { CLIKey } from '@terra-money/terra.js/dist/key/CLIKey';
import { AddressProviderFromEnvVar } from '../../anchor-js/address-provider';
import { fabricatebAssetBond } from '../../anchor-js/fabricators/basset/basset-bond';
import { createExecMenu, handleExecCommand } from '../../util/contract-menu';
const mockAddressProvider = new AddressProviderFromEnvVar()
const menu = createExecMenu('basset-hub', 'Anchor bAsset Hub contract functions')
interface BondArgs {
    amount: string
    validator: string
}
const bond = menu
    .option('--amount <amount>', '*Asset to be bonded and minted')
    .option('--validator <validator>', 'validator to delegate to')
    .action(async ({ amount, validator }: BondArgs) => {
        const key = new CLIKey({ keyName: bond.from })
        const userAddress = key.accAddress
        const msgs = fabricatebAssetBond({
            address: userAddress,
            amount: +amount,
            validator: validator,
            bAsset: 'bluna'
        })(mockAddressProvider)
        await handleExecCommand(menu, msgs)
    });
