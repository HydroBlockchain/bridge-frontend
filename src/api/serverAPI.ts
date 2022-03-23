import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:3000/api/1.0.0/',
    withCredentials: true,
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
    /*getTransactionHash() {
        return instance.get('getSwapCostInHydroTokens', {
            params: {
                amountOfHydro, destinationChain
            }
        })
    },*/
    performSwap(TransactionHash: string, sourceChainName: ChainType, destinationChainName: ChainType) {
        return instance.get('performSwapForTransaction', {
            params: {
                TransactionHash, sourceChainName, destinationChainName
            }
        })
    }
}

type GetTransactionDetailsResponseType = {
    data: {
        amountDeposited: number,
        depositor: string
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


