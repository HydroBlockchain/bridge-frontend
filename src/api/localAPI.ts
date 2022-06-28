import {chains} from '../assets/chains'
import BepHydro from '../assets/abis/bephydro_copy.json'
import {AbiItem} from 'web3-utils'
import bridgeContract from '../assets/abis/bridgeContract.json'
import {addressForWeb3, chainIDs, hydroAddresses, swapContractAddresses} from '../common/common'
import {Contract} from 'web3-eth-contract'

const Web3 = require('web3')

let web3 = new Web3(new Web3.providers.HttpProvider(addressForWeb3))

export const localAPI = {
    getAccountAddress: async (): Promise<string> => {
        const accounts = await web3.eth.getAccounts()
        return accounts[0]
    },
    getChainID: async (): Promise<number> => {
        return await web3.eth.net.getId()
    },
    connectToMetamask: async function (): Promise<connectToMetamaskReturnType> {
        let returnValues = {
            status: false,
            account: '',
            chainID: 0,
        }
        try {
            if (typeof window.ethereum !== 'undefined') {
                await window.ethereum.enable()
                web3 = new Web3(window.ethereum) // Instance web3 with the provided information
            }
            if (typeof web3 !== 'undefined') {
                web3 = new Web3(web3.currentProvider)
                returnValues.account = await this.getAccountAddress()
            } else {
                console.log('No Web3 Detected')
                web3 = new Web3(new Web3.providers.WebsocketProvider('wss://infura.io/ws/v3/72e114745bbf4822b987489c119f858b'))
            }
            returnValues.status = true
        } catch (error) {
            console.error('localAPI.connectToMetamask error')
        }

        returnValues.chainID = await web3.eth.net.getId()
        return returnValues
    },

    changeNetwork: async (chainID: number): Promise<boolean | undefined> => {
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
                    })
                    return true
                }
            } catch (error) {
                return false
            }
        }
    },
    createHydroContractInstance: (chainID: number): Contract => {
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
            case chainIDs.moonriverMainnet: {
                hydroAddress = hydroAddresses.forMoonriver
                break
            }
            case chainIDs.coinex: {
                hydroAddress = hydroAddresses.forCoinex
                break
            }
            case chainIDs.mumbaiTest:
            case chainIDs.rinkebyTest:
            case chainIDs.moonbeamAlphaTestnet:
            case chainIDs.coinExTest: {
                hydroAddress = hydroAddresses.forTestNets
                break
            }
        }
        return new web3.eth.Contract(BepHydro as AbiItem[], hydroAddress)
    },
    getBridgeContractInstance: (way: ConversionWayType): Contract => {
        return new web3.eth.Contract(bridgeContract as AbiItem[], swapContractAddresses[way])
    },
    fromWei: function (weiBalance: string, ether = ''): string {
        return web3.utils.fromWei(weiBalance, ether)
    },
    toWei: function (approvedAmount: string): string {
        return web3.utils.toWei(approvedAmount)
    },
    getHydroBalance: async function (hydroContractInstance: Contract): Promise<string> {
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
    approveTokens: async function (hydroContractInstance: Contract,
                                   approvedAmount: string,
                                   leftChainId: ChainIdType,
                                   conversionWay: ConversionWayType,
                                   bridgeContractInstance: Contract): Promise<void> {
        let outputHash = ''
        const account = await this.getAccountAddress()
        const finalAmount = leftChainId === chainIDs.mumbaiTest
            ? approvedAmount
            : web3.utils.toWei(approvedAmount)
        await hydroContractInstance.methods
            .approve(swapContractAddresses[conversionWay], finalAmount) // there need to check approve or not
            .send({from: account,})
            .on('transactionHash', (hash: string) => {
                if (hash !== null) {
                    finalAmount !== '0' ? outputHash = hash : outputHash = ''
                }
            })
    },
    /*
    * example:
    * https://rinkeby.etherscan.io/address/0x9477b2d4442fcd35368c029a0016e6800437bae2#readContract
    * owner - address of Metamask Account: string
    * spender - bridge contract:
    * */
    contractAllowance: async function (contract: Contract, conversionWay: ConversionWayType): Promise<number> {
        /// @dev This function makes it easy to read the `allowed[]` map
        /// @param _owner The address of the account that owns the token
        /// @param _spender The address of the account able to transfer the tokens
        /// @return Amount of remaining tokens of _owner that _spender is allowed
        /// to spend
        const owner = await this.getAccountAddress()
        const spender = swapContractAddresses[conversionWay]
        const result = await contract.methods.allowance(owner, spender).call()
        return web3.utils.fromWei(result)
    },
    getBalance: async function (address: string) {
        // let accounts = await web3.eth.getAccounts();
        const balance = await web3.eth.getBalance(address)
        return web3.utils.fromWei(balance)
    }
}

declare let window: any // todo: maybe fix any
type ErrorType = {
    code: number
}

export type ConversionWayType = 'coinexSmartChainTestnet' | 'mumbaiTestnet' | 'rinkebyTestnet' | 'eth' | 'bsc' | 'polygon' | 'moonbeamAlphaTestnet' | 'moonriverMainnet' | 'coinex'

type connectToMetamaskReturnType = {
    status: boolean
    account: string
    chainID: number
}
export type ChainIdType = chainIDs.eth | chainIDs.bsc | chainIDs.polygon | chainIDs.mumbaiTest | chainIDs.rinkebyTest | chainIDs.coinExTest | chainIDs.moonbeamAlphaTestnet | chainIDs.moonriverMainnet | chainIDs.coinex

export type ReceiptedType = {
    transactionHash: string
    transactionIndex: number,
    blockHash: string
    blockNumber: number
    contractAddress: string
    cumulativeGasUsed: number
    gasUsed: number
    events: {
        MyEvent: {
            returnValues: {
                myIndexedParam: number
                myOtherIndexedParam: string
                myNonIndexParam: string
            },
            raw: {
                data: string
                topics: Array<string>
            },
        }
    }
}

type ReturnSwapTokensType = {
    data: {
        transactionStatus: string
        explorerLink: string
        transactionHash: string
    }
}
