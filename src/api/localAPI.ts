import {chains} from "../assets/chains";
import BepHydro from '../assets/abis/bephydro.json';
import {AbiItem} from "web3-utils";
import {addressForWeb3, hydroAddresses, networkIDs, swapContractAddresses} from "../common/variables";
import {Contract} from "web3-eth-contract";

// let web3 = window.web3
const Web3 = require('web3');
// const Web3_2 = require('web3');

let web3 = new Web3(new Web3.providers.HttpProvider(addressForWeb3))
let web3_2 = new Web3(new Web3.providers.HttpProvider(addressForWeb3));

export const localAPI = {
    getAccountAddress: async () => {
        const accounts = await web3.eth.getAccounts();
        return accounts[0]
    },
    getNetworkID: async () => {
        return await web3.eth.net.getId();
    },
    connectToMetamask: async function () {
        let returnValues = {
            status: false,
            account: '',
            networkID: 0,
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

        returnValues.networkID = await web3.eth.net.getId()
        return returnValues
    },

    changeNetwork: async (networkID: number) => {
        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{chainId: chains[networkID].chainId}],
            })
            return true
        } catch (error) {
            try {
                if ((error as ErrorType).code === 4902) {
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [chains[networkID]],
                    });
                    return true
                }
            } catch (error) {
                return false
            }
        }
    },
    createHydroContractInstance: (networkID: number) => {
        let hydroAddress
        switch (networkID) {
            case networkIDs.eth: {
                hydroAddress = hydroAddresses.forEth
                break
            }
            case networkIDs.bsc: {
                hydroAddress = hydroAddresses.forBsc
                break
            }
            case networkIDs.mumbaiTest:
            case networkIDs.rinkebyTest:
            case networkIDs.coinExTest: {
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
        // console.log('displayApprovedFund, allowed_swap', allowed_swap)

        // const allowed = web3.utils.fromWei(allowed_swap.toString(), 'ether');
    },
    approveFunds: async function (hydroContractInstance: Contract, account: string, swapContractAddress: string) {
        hydroContractInstance.methods
            .approve(swapContractAddress, web3.utils.toWei('1000000000'))
            .send({
                from: account,
            })
            .on('transactionHash', (hash: string) => {
                if (hash !== null) {
                    // toast(<a href={this.state.network_Explorer + hash} target="blank">View transaction.</a>);
                    console.log('approveFunds on')
                }
            })
    },
    exchangeTokenChain: async function (hydroContractInstance: Contract, approvedAmount: string, way: ConversionWayType) {
        const account = await this.getAccountAddress()

        // const swapContractAddress = "0xfa41d158Ea48265443799CF720a120BFE77e41ca" // eth 2 bsc
        // const swapContractAddress = "0xa8377d8A0ee92120095bC7ae2d8A8E1973CcEa95" // bsc 2 eth

        hydroContractInstance.methods
            .approve(swapContractAddresses[way], web3.utils.toWei(approvedAmount))
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
export type ConversionWayType = 'eth2bsc' | 'bsc2eth' | 'coinexSmartChainTestnet' | 'mumbaiTestnet' | 'rinkebyTestnet'
type AnotherProviderType = { isAnotherProvider: boolean }