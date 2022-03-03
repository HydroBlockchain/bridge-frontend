import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:3000/api/1.0.0/',
    withCredentials: true,
})

export const serverApi = {
    getHydroBalance(address: string, chainName: ChainType) {
        return instance.get('getHydroBalance', {
            params: {
                address, chainName
            }
        })
    },
    getTransactionFee(destinationChain: ChainType) {
        return instance.get('getSwapCostInHydroTokens', {
            params: {
                destinationChain
            }
        })
    }
}

export type ChainType = 'ethereum' | 'binanceMainnet' | 'polygonTestnet' | 'rinkebyTestnet' | 'coinexTestNetwork'