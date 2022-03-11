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
    }
}

export type ChainType = 'ethereum' | 'binanceMainnet' | 'polygonTestnet' | 'rinkebyTestnet' | 'coinexTestNetwork'
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


