import {chains} from '../assets/chains';
import BepHydro from '../assets/abis/bephydro_copy.json';
import {AbiItem} from 'web3-utils';
import {addressForWeb3, chainIDs, hydroAddresses, swapContractAddresses} from '../common/common';
import {Contract} from 'web3-eth-contract';

const Web3 = require('web3');

let web3 = new Web3(new Web3.providers.HttpProvider(addressForWeb3))

export const localAPI = {
    getAccountAddress: async () => {
        const accounts = await web3.eth.getAccounts();
        return accounts[0]
    },
    getChainID: async () => {
        return await web3.eth.net.getId();
    },
    connectToMetamask: async function (): Promise<connectToMetamaskReturnType> {
        let returnValues = {
            status: false,
            account: '',
            chainID: 0,
        }
        try {
            if (typeof window.ethereum !== 'undefined') {
                await window.ethereum.enable();
                web3 = new Web3(window.ethereum); // Instance web3 with the provided information
            }
            if (typeof web3 !== 'undefined') {
                web3 = new Web3(web3.currentProvider);
                returnValues.account = await this.getAccountAddress()
            } else {
                console.log('No Web3 Detected')
                web3 = new Web3(new Web3.providers.WebsocketProvider('wss://infura.io/ws/v3/72e114745bbf4822b987489c119f858b'));
            }
            returnValues.status = true
        } catch (error) {
            console.error('localAPI.connectToMetamask error')
        }

        returnValues.chainID = await web3.eth.net.getId()
        return returnValues
    },

    changeNetwork: async (chainID: number) => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{chainId: chains[chainID].chainId}],
            })
            return true
        } catch (error) {
            try {
                if ((error as ErrorType).code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [chains[chainID]],
                    });
                    return true
                }
            } catch (error) {
                return false
            }
        }
    },
    createHydroContractInstance: (chainID: number) => {
        let hydroAddress
        switch (chainID) {
            case chainIDs.eth: {
                hydroAddress = hydroAddresses.forEth
                break
            }
            case chainIDs.bsc: {
                hydroAddress = hydroAddresses.forBsc
                break
            }
            case chainIDs.mumbaiTest:
            case chainIDs.rinkebyTest:
            case chainIDs.coinExTest: {
                hydroAddress = hydroAddresses.forTestNets
                break
            }
        }
        return new web3.eth.Contract(BepHydro as AbiItem[], hydroAddress)
    },
    fromWei: function (weiBalance: string, ether = '') {
        return web3.utils.fromWei(weiBalance, ether)
    },
    getHydroBalance: async function (hydroContractInstance: Contract) {
        let address
        address = await this.getAccountAddress()

        try {
            const HydroBalance = await hydroContractInstance.methods.balanceOf(address).call()
            return this.fromWei(HydroBalance)
        } catch (error) {
            console.error('getHydroBalance error')
            return ''
        }
    },
    // this for total hydro swapped
    displayApprovedFund: async function (hydroContractInstance: Contract, hydroBalance: string, account: string, swapAddress: string) {
        try {
            const allowed_swap = await hydroContractInstance.methods.allowed(account, swapAddress).call();
            const allowed_swapFromWei = this.fromWei(allowed_swap.toString(), 'ether')
        } catch (error) {
            console.error(error)
        }
        // const allowed = web3.utils.fromWei(allowed_swap.toString(), 'ether');
    },
    exchangeTokenChain: async function (hydroContractInstance: Contract, approvedAmount: string, way: ConversionWayType) {
        const account = await this.getAccountAddress()
        hydroContractInstance.methods
            .approve(swapContractAddresses[way], web3.utils.toWei(approvedAmount))
            // .approve(swapContractAddresses[way], approvedAmount)
            .send({from: account,})
            .on('transactionHash', (hash: string) => {
                if (hash !== null) {
                    // toast(<a href={this.state.network_Explorer + hash} target="blank">View transaction.</a>);
                    console.log('on transactionHash')
                }
            })
    },

}

declare let window: any // todo: maybe fix any
type ErrorType = {
    code: number
}

export type ConversionWayType = 'coinexSmartChainTestnet' | 'mumbaiTestnet' | 'rinkebyTestnet' | 'eth2bsc' | 'bsc2eth'

type AnotherProviderType = { isAnotherProvider: boolean }
type connectToMetamaskReturnType = {
    status: boolean
    account: string
    chainID: number
}