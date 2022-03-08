import {ThunkAction} from "redux-thunk";
import {AppStoreType} from "./store";
import {Contract} from "web3-eth-contract";
import {fromWei} from "web3-utils";
import {ConversionWayType, localAPI} from "../api/localAPI";
import {chainNamesForGetHydroBalance, chainIDs, RealizedChainsRightType} from "../common/variables";
import {ChainType, serverApi} from "../api/serverAPI";
import {setAppStatusAC} from "./appReducer";

let initialState = {
    account: '',
    hydroBalance: '',
    hydroBalanceRight: '',
    bepBalance: '0',
    allowedHydro: '0',
    allowedBep: '0',
    loading: false,
    hydroContractInstance: {} as Contract,
    hydroAddress: null as string | null,
    bepHydroAddress: null,
    ethToBscInstance: null,
    BscToEthInstance: {} as Contract,
    bepHydroInstance: {} as Contract,
    currentForm: '',

    swapAddress: '',
    swapInstance: {} as Contract,
    totalSwapped: '0',
    allowed: '0' as ReturnType<typeof fromWei>,
    eth_allowed: 0,
    blockNumber: 0,
    chainID: chainIDs.notSelected,
    text: '',
    wrongNetwork: '',
    API_LINK: '',
    loading_text: '',
    txHash: {} as { transactionHash: string },
    gasFee: 0,
    //proxyFee:0,
    tx_Link: '',
    network_Explorer: '',
    prev_hash: 0,
    swapping: false,

    transactionFee: {} as TransactionFeeType
}

export const bridgeReducer = (state = initialState, action: BridgeActionTypes): InitialStateType => {
    switch (action.type) {
        case 'BRIDGE/SET-NETWORK-ID':
        case 'BRIDGE/SET-LOADING':
        case "BRIDGE/SET-ACCOUNT":
        case "BRIDGE/SET-HYDRO-BALANCE":
        case 'BRIDGE/SET-HYDRO-BALANCE-RIGHT':
        case "BRIDGE/SET-HYDRO-CONTRACT-INSTANCE":
        case 'BRIDGE/SET-TRANSACTION-FEE':
            return {...state, ...action.payload}
    }
    return state
}

//Action creators:
const setChainIDAC = (chainID: number) => ({type: 'BRIDGE/SET-NETWORK-ID', payload: {chainID}} as const)
const setLoadingAC = (loading: boolean) => ({type: 'BRIDGE/SET-LOADING', payload: {loading}} as const)
const setAccountAC = (account: string) => ({type: 'BRIDGE/SET-ACCOUNT', payload: {account}} as const)
const setHydroContractInstanceAC = (hydroContractInstance: Contract) => ({
    type: 'BRIDGE/SET-HYDRO-CONTRACT-INSTANCE',
    payload: {hydroContractInstance}
} as const)
const setHydroBalanceAC = (hydroBalance: string) => ({
    type: 'BRIDGE/SET-HYDRO-BALANCE',
    payload: {hydroBalance}
} as const)
const setHydroBalanceRightAC = (hydroBalanceRight: string) => ({
    type: 'BRIDGE/SET-HYDRO-BALANCE-RIGHT',
    payload: {hydroBalanceRight}
} as const)
const setTransactionFeeAC = (transactionFee: TransactionFeeType) => ({
    type: 'BRIDGE/SET-TRANSACTION-FEE',
    payload: {transactionFee}
})

//Thunks:
export const connectToMetamaskThunk = (): AppThunk => async (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    const {status, account, chainID} = await localAPI.connectToMetamask()

    if (status) {
        if (account !== '') {
            dispatch(setAccountAC(account))
        }
        if (chainID !== 0) dispatch(setChainIDAC(chainID))
        dispatch(setLoadingAC(true))
    } else {
        dispatch(setLoadingAC(false))
    }
    dispatch(setAppStatusAC('succeeded'))

    //turn on monitoring if chain in metamask changed
    window.ethereum.on('chainChanged', async function () {
        const account = await localAPI.getAccountAddress()
        dispatch(setAccountAC(account))

        const newChainID = await localAPI.getChainID()
        dispatch(setChainIDAC(newChainID))
    })

}

export const changeNetworkThunk = (networkID: number): AppThunk => async (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    if (await localAPI.changeNetwork(networkID)) {
        dispatch(setAppStatusAC('succeeded'))
    } else {
        console.error('changeNetwork error')
    }
}

export const approveFundsThunk = (approvedAmount: string, way: ConversionWayType): AppThunk => async (dispatch, getState: () => AppStoreType) => {
    if (Number(approvedAmount) > 0) {
        const bridgeState = getState().bridge
        const hydroContractInstance = bridgeState.hydroContractInstance
        const hydraBalance = bridgeState.hydroBalance
        if (hydraBalance === '') console.error('approveFundsThunk', 'HydroBalance === ""')
        dispatch(setAppStatusAC('loading'))
        await localAPI.exchangeTokenChain(hydroContractInstance, approvedAmount, way)
        dispatch(setAppStatusAC('succeeded'))
    } else {
        console.error('approveFundsThunk', 'approvedAmount must be > 0')
    }
}

export const getHydroBalanceThunk = (isAnotherAccount: boolean = false, chainID: RealizedChainsRightType | 0 = 0)
    : AppThunk => async (dispatch, getState: () => AppStoreType) => {
    const account = getState().bridge.account
    if (isAnotherAccount && chainID !== chainIDs.notSelected) {
        try {
            dispatch(setAppStatusAC('loading'))
            await serverApi.getHydroBalance(account, chainNamesForGetHydroBalance[chainID] as ChainType)
                .then(data => {
                    dispatch(setHydroBalanceRightAC(data.data.tokenBalance))
                })
                .catch(e => {
                    console.error('serverApi error', e.response.data.errors[0].msg)
                    dispatch(setHydroBalanceRightAC('?'))
                })

        } catch (e) {
            console.error('getHydroBalanceThunk error', e)
            dispatch(setHydroBalanceRightAC('?'))
        }
        finally {
            dispatch(setAppStatusAC('succeeded'))
        }
    } else {
        const hydroContractInstance = localAPI.createHydroContractInstance(getState().bridge.chainID)
        dispatch(setHydroContractInstanceAC(hydroContractInstance))
        const hydroBalance = await localAPI.getHydroBalance(hydroContractInstance)
        dispatch(setHydroBalanceAC(hydroBalance))
    }
}

export const getTransactionFeeThunk = (amountOfHydro: string, chainID: RealizedChainsRightType | 0): AppThunk => async (dispatch) => {
    if (chainID !== 0) {
        dispatch(setAppStatusAC('loading'))
        await serverApi.getTransactionFee(amountOfHydro,chainNamesForGetHydroBalance[chainID] as ChainType)
            .then(data => {
                dispatch(setTransactionFeeAC(data.data))
            })
            .catch(e => {
                console.log('getTransactionFee error', e)
            })
            .finally(()=> {
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}

export type InitialStateType = typeof initialState

export type BridgeActionTypes =
    | ReturnType<typeof setChainIDAC>
    | ReturnType<typeof setLoadingAC>
    | ReturnType<typeof setAccountAC>
    | ReturnType<typeof setHydroContractInstanceAC>
    | ReturnType<typeof setHydroBalanceAC>
    | ReturnType<typeof setHydroBalanceRightAC>
    | ReturnType<typeof setTransactionFeeAC>
    | ReturnType<typeof setAppStatusAC>


type AppThunk = ThunkAction<void, AppStoreType, unknown, BridgeActionTypes>

declare let window: any; // todo: maybe fix any

type TransactionFeeType = {
    gasPrice: string
    gasRequired: number
    transactionCostinEth: number
    transactionCostInHydro: number
    hydroTokensToBeReceived: number
}