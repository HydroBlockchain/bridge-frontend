import axios from 'axios'
import {ReceiptedType} from './localAPI'

const instance = axios.create({
    // baseURL: 'http://localhost:3000/api/1.0.0/',
    baseURL: 'https://hydro-bridge.org/api/1.0.0/',
    withCredentials: false,
})

export const serverApi = {
    getHydroBalance(address: string, chainName: ChainType): Promise<GetHydroBalanceResponseType> {
        return instance.get('getHydroBalance', {
            params: {
                address, chainName
            }
        })
    },
    getTransactionFee(amountOfHydro: string, destinationChain: ChainType): Promise<GetTransactionFeeType> {
        return instance.get('getSwapCostInHydroTokens', {
            params: {
                amountOfHydro, destinationChain
            }
        })
    },
    transactionDetails(TransactionHash: string, chainName: ChainType): Promise<GetTransactionDetailsResponseType> {
        return instance.get('transactionDetails', {
            params: {
                TransactionHash, chainName
            }
        })
    },
    performSwap(TransactionHashInput: ReceiptedType, sourceChainName: ChainType, destinationChainName: ChainType): Promise<PerformSwapType> {

        const TransactionHash = TransactionHashInput.transactionHash
        // const serverAnswer = await localAPI.swapTokens(hydroContractInstance, approvedAmount, leftChainId, rightChainId, way, bridgeContractInstance)
        return instance.get('performSwapForTransaction', {
            params: {
                TransactionHash, sourceChainName, destinationChainName
            }
        })
    },
    getTotalHydroSwapped(): Promise<GetTotalHydroSwappedResponseType> {
        return instance.get('getTotalHydroSwapped')
    }
}


type SwappedChainType = {
    chainName: string
    swappedAmount: string
}
type GetTotalHydroSwappedResponseType = {
    data: {
        totalValueSwappedOnTestnet: string
        totalValueSwappedOnMainnet: string
        testnet: Array<SwappedChainType>
        mainnet: Array<SwappedChainType>
    }
}
type GetTransactionDetailsResponseType = {
    data: {
        amountDeposited: number,
        depositor: string
    }
}
type PerformSwapType = {
    data: {
        explorerLink: string
        transactionHash: string
    }
}
export type ChainType =
    | 'ethereum'
    | 'binanceMainnet'
    | 'polygonTestnet'
    | 'rinkebyTestnet'
    | 'coinexTestNetwork'
    | 'rinkeby'
type GetHydroBalanceResponseType = {
    data: {
        tokenBalance: string
    }
}
export type TransactionFeeType = {
    gasPrice: string
    gasRequired: number
    hydroTokensToBeReceived: number
    priceTimestamp: string
    transactionCostInHydro: number
    transactionCostinEth: string
}
type GetTransactionFeeType = {
    data: TransactionFeeType
}


