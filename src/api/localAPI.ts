import {chains} from "../assets/chains";
import Web3 from "web3";
import BepHydro from '../assets/abis/bephydro.json';
import {AbiItem} from "web3-utils";
import {networkIDs} from "../common/variables";

export const localAPI = {
    getAccountAddress: async () => {
        const accounts = await window.web3.eth.getAccounts();
        return accounts[0]
    },
    getNetworkID: async () => {
        return await window.web3.eth.net.getId();
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
    getHydroBalance: async function (networkID: number) {
        let hydroAddress
        switch (networkID) {
            case networkIDs.eth: {
                hydroAddress = "0x946112efaB61C3636CBD52DE2E1392D7A75A6f01"
                break
            }
            case networkIDs.bsc: {
                hydroAddress = "0xf3DBB49999B25c9D6641a9423C7ad84168D00071"
                break
            }
            case networkIDs.mumbaiTest:
            case networkIDs.rinkebyTest:
            case networkIDs.coinExTest:
            {
                hydroAddress = "0x9477B2d4442FCd35368c029a0016e6800437BAe2"
                break
            }
        }

        const address = await this.getAccountAddress()
        const hydroInstance = new window.web3.eth.Contract(BepHydro as AbiItem[], hydroAddress);
        try {
            const HydroBalance = await hydroInstance.methods.balanceOf(address).call()
            return window.web3.utils.fromWei(HydroBalance)

        } catch (error) {
            console.error(error)
            return ''
        }
    }
}

declare let window: any // todo: maybe fix any
type ErrorType = {
    code: number
}