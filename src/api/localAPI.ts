import {chains} from "../assets/chains";
import Web3 from "web3";
import BepHydro from '../assets/abis/bephydro.json';
import {AbiItem} from "web3-utils";

export const localAPI = {
    getAccountAddress: async () => {
        const accounts = await window.web3.eth.getAccounts();
        return accounts[0]
    },
    getNetworkID: async () => {
        return await window.web3.eth.net.getId();
    },
    connectToMetamask: async function() {
        let returnValues = {
            status: false,
            account: '',
            networkID: 0,
        }
        try {
            if (typeof window.ethereum !== 'undefined') {
                await window.ethereum.enable();
                window.web3 = new Web3(window.ethereum); // Instance web3 with the provided information
            }
            if (typeof window.web3 !== 'undefined') {
                window.web3 = new Web3(window.web3.currentProvider);
                returnValues.account = await this.getAccountAddress()
            } else {
                console.log('No Web3 Detected')
                window.web3 = new Web3(new Web3.providers.WebsocketProvider('wss://infura.io/ws/v3/72e114745bbf4822b987489c119f858b'));
            }
            returnValues.status = true
        } catch (error) {
            console.error('localAPI.connectToMetamask error')
        }

        returnValues.networkID = await window.web3.eth.net.getId()
        return returnValues
    },

    changeNetwork: async (networkName: string) => {
        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{chainId: chains[networkName].chainId}],
            })
            return true
        } catch (error) {
            try {
                if ((error as ErrorType).code === 4902) {
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [chains[networkName]],
                    });
                    return true
                }
            } catch (error) {
                return false
            }
        }
    },
    getHydroInstance: (web3: Web3) => {
        const hydroAddress = "0xf3DBB49999B25c9D6641a9423C7ad84168D00071";
        return new web3.eth.Contract(BepHydro as AbiItem[], hydroAddress);
    },
    getHydroBalance: async function() {
        const address = await this.getAccountAddress()
        console.log('account', address)
        const balance = await window.web3.eth.getBalance(address)
        const balanceTransformed =  window.web3.utils.fromWei(balance)
        console.log('balanceEther', balanceTransformed) //this is ether balance
        // now getting token balance
        const tokenInst = new window.web3.eth.Contract(BepHydro, address);
        console.log('hydroInstance', tokenInst)
        try {
            const HydroInstance = await tokenInst.methods.balanceOf(address).call()
        } catch (error) {
            console.error(error)
        }
    }
}

declare let window: any // todo: maybe fix any
type ErrorType = {
    code: number
}