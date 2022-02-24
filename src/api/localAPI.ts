import {chains} from "../assets/chains";
import Web3 from "web3";
import BepHydro from '../assets/abis/bephydro.json';
import {AbiItem} from "web3-utils";
import {networkIDs} from "../common/variables";
import EthToBscAbi from '../assets/abis/ethToBsc.json'
import {getHydroBalanceThunk} from "../redux/bridge-reducer";
import {Contract} from "web3-eth-contract";
import BscToEthAbi from '../assets/abis/bscToEth.json';

const hydroAddresses = {
    forEth: '0x946112efaB61C3636CBD52DE2E1392D7A75A6f01',
    forBsc: '0xf3DBB49999B25c9D6641a9423C7ad84168D00071',
    forTestNets: '0x9477B2d4442FCd35368c029a0016e6800437BAe2'
}

const swapContractAddresses = {
    eth2bsc: '0xfa41d158Ea48265443799CF720a120BFE77e41ca',
    bsc2eth: '0xa8377d8A0ee92120095bC7ae2d8A8E1973CcEa95'
}

let web3 = window.web3

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
    getHydroBalance: async function (hydroContractInstance: Contract) {
        const address = await this.getAccountAddress()
        try {
            const HydroBalance = await hydroContractInstance.methods.balanceOf(address).call()
            return web3.utils.fromWei(HydroBalance)

        } catch (error) {
            console.error(error)
            return ''
        }
    },
    // this for total hydro swapped
    displayApprovedFund: async function (hydroContractInstance: Contract, hydroBalance: string, account: string, swapAddress: string) {
        console.log('displayApprovedFund, hydroBalance', hydroBalance)
        try {
            const allowed_swap = await hydroContractInstance.methods.allowed(account, swapAddress).call();
            console.log('displayApprovedFund, allowed_swap', allowed_swap)
            const allowed_swapFromWei = web3.utils.fromWei(allowed_swap.toString(), 'ether')
            console.log('displayApprovedFund, allowed_swapFromWei', allowed_swapFromWei)
        } catch (error) {
            console.error(error)
        }
        // console.log('displayApprovedFund, allowed_swap', allowed_swap)

        // const allowed = web3.utils.fromWei(allowed_swap.toString(), 'ether');
    },
    approveFunds: async function (hydroContractInstance: Contract, account: string, swapContractAddress: string) {
        hydroContractInstance.methods.approve(swapContractAddress, web3.utils.toWei('1000000000')).send({
            from: account,
        })
            .on('transactionHash', (hash: string) => {
                if (hash !== null) {
                    // toast(<a href={this.state.network_Explorer + hash} target="blank">View transaction.</a>);
                    console.log('approveFunds on')
                }
            })
    },
    exchangeEth2Bsc: async function (hydroContractInstance: Contract, approvedAmount: string, way: ConversionWayType) {
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
export type ConversionWayType = 'eth2bsc' | 'bsc2eth'