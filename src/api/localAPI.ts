import {chains} from "../assets/chains";
import Web3 from "web3";
import BepHydro from '../assets/abis/bephydro.json';
import {AbiItem} from "web3-utils";
import {networkIDs} from "../common/variables";
import EthToBscAbi from '../assets/abis/ethToBsc.json'
import {getHydroBalanceThunk} from "../redux/bridge-reducer";
import {Contract} from "web3-eth-contract";

const hydroAddresses = {
    forEth: '0x946112efaB61C3636CBD52DE2E1392D7A75A6f01',
    forBsc: '0xf3DBB49999B25c9D6641a9423C7ad84168D00071',
    forTestNets: '0x9477B2d4442FCd35368c029a0016e6800437BAe2'
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
    createHydroContract: (networkID: number) => {
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
    getHydroBalance: async function (hydroContract: Contract) {
        const address = await this.getAccountAddress()
        try {
            const HydroBalance = await hydroContract.methods.balanceOf(address).call()
            return web3.utils.fromWei(HydroBalance)

        } catch (error) {
            console.error(error)
            return ''
        }
    },
    displayApprovedFund: async function (hydroContract: Contract, hydroBalance: string, account: string, swapAddress: string) {
        console.log('displayApprovedFund, hydroBalance', hydroBalance)
        try {
            const allowed_swap = await hydroContract.methods.allowed(account, swapAddress).call();
            console.log('displayApprovedFund, allowed_swap', allowed_swap)
            const allowed_swapFromWei = web3.utils.fromWei(allowed_swap.toString(), 'ether')
            console.log('displayApprovedFund, allowed_swapFromWei', allowed_swapFromWei)
        }
        catch (error) {
            console.error(error)
        }
        // console.log('displayApprovedFund, allowed_swap', allowed_swap)

        // const allowed = web3.utils.fromWei(allowed_swap.toString(), 'ether');
    },
    approveFunds: async function (hydroContract: Contract, account: string, swapContractAddress: string) {
        hydroContract.methods.approve(swapContractAddress, web3.utils.toWei('1000000000')).send({
            from: account,
        })
            .on('transactionHash', (hash: string) => {
                if (hash !== null) {
                    // toast(<a href={this.state.network_Explorer + hash} target="blank">View transaction.</a>);
                    console.log('approveFunds on')
                }
            })
    },
    exchangeEth2Bsc: async function (hydroContract: Contract, hydroBalance: string) {
        console.log('exchangeEth2Bsc, hydroContract',hydroContract)
        console.log('exchangeEth2Bsc, hydroBalance in exchangeEth2Bsc=', hydroBalance)
        const account = await this.getAccountAddress()
        console.log('exchangeEth2Bsc, account', account)
        const hydroAddress = hydroAddresses.forEth
        console.log('exchangeEth2Bsc, hydroAddress', hydroAddress)
        hydroContract.events.allEvents({filter: {owner: account}, toBlock: 'latest'}) //for what?
            .on('data', () => {
                console.log('exchangeEth2Bsc, hydroContract on inside')
                this.displayApprovedFund(hydroContract, hydroBalance, account, swapContractAddress);
            })

        const swapContractAddress = "0xfa41d158Ea48265443799CF720a120BFE77e41ca";
        const swapContract = new web3.eth.Contract(EthToBscAbi, swapContractAddress);
        console.log('exchangeEth2Bsc, swapInstance', swapContract)

        // for Total Hydro Swapped:
        try {
            const newTotalSwapped = await swapContract.methods.totalAmountSwapped().call();
            const totalSwappedFromWei = web3.utils.fromWei(newTotalSwapped.toString())
            console.log('exchangeEth2Bsc, totalSwappedFromWei', totalSwappedFromWei)
        } catch (error) {
            console.error(error)
        }

        await this.displayApprovedFund(hydroContract, hydroBalance, account,swapContractAddress);

        await this.approveFunds(hydroContract, account, swapContractAddress)
    },

}

declare let window: any // todo: maybe fix any
type ErrorType = {
    code: number
}