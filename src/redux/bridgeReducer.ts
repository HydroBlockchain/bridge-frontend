import {ThunkAction} from 'redux-thunk'
import {AppStoreType} from './store'
import {Contract} from 'web3-eth-contract'
import {fromWei} from 'web3-utils'
import {ConversionWayType, localAPI} from '../api/localAPI'
import {chainNamesForGetHydroBalance, chainIDs, RealizedChainsRightType} from '../common/common'
import {ChainType, serverApi, TransactionFeeType} from '../api/serverAPI'
import {setAppStatusAC} from './appReducer'
import {logDOM} from '@testing-library/react'
import {v1} from 'uuid'

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

    transactionFee: {} as TransactionFeeType,
    log: [] as Array<LogType>
}

export type bridgeStateType = typeof initialState

export const bridgeReducer = (state: bridgeStateType = initialState, action: BridgeActionTypes): InitialStateType => {
    switch (action.type) {
        case 'BRIDGE/SET-NETWORK-ID':
        case 'BRIDGE/SET-LOADING':
        case 'BRIDGE/SET-ACCOUNT':
        case 'BRIDGE/SET-HYDRO-BALANCE':
        case 'BRIDGE/SET-HYDRO-BALANCE-RIGHT':
        case 'BRIDGE/SET-HYDRO-CONTRACT-INSTANCE':
        case 'BRIDGE/SET-TRANSACTION-FEE':
        case 'BRIDGE/SET-TOTAL-HYDRO-SWAPPED':
            return {...state, ...action.payload}
        case 'BRIDGE/SET-HYDRO-TOKENS-TO-BE-RECEIVED':
            return {
                ...state,
                transactionFee: {...state.transactionFee, hydroTokensToBeReceived: action.hydroTokensToBeReceived}
            }
        case 'BRIDGE/SET-LOG-MESSAGE':
            return {
                ...state,
                log: [...state.log, {id: v1(), message: action.message, messageType: action.messageType}]
            }
    }
    return state
}

//Action creators :
export const setHydroTokensToBeReceivedAC = (hydroTokensToBeReceived: number) => {
    return ({type: 'BRIDGE/SET-HYDRO-TOKENS-TO-BE-RECEIVED', hydroTokensToBeReceived} as const)
}
export const setChainIDAC = (chainID: number) => ({type: 'BRIDGE/SET-NETWORK-ID', payload: {chainID}} as const)
const setLoadingAC = (loading: boolean) => ({type: 'BRIDGE/SET-LOADING', payload: {loading}} as const)
const setAccountAC = (account: string) => ({type: 'BRIDGE/SET-ACCOUNT', payload: {account}} as const)
const setHydroContractInstanceAC = (hydroContractInstance: Contract) => ({
    type: 'BRIDGE/SET-HYDRO-CONTRACT-INSTANCE',
    payload: {hydroContractInstance}
} as const)
export const setHydroBalanceAC = (hydroBalance: string) => ({
    type: 'BRIDGE/SET-HYDRO-BALANCE',
    payload: {hydroBalance}
} as const)
export const setHydroBalanceRightAC = (hydroBalanceRight: string) => ({
    type: 'BRIDGE/SET-HYDRO-BALANCE-RIGHT',
    payload: {hydroBalanceRight}
} as const)
export const setTransactionFeeAC = (transactionFee: TransactionFeeType) => ({
    type: 'BRIDGE/SET-TRANSACTION-FEE',
    payload: {transactionFee}
} as const)
export const setTotalHydroSwappedAC = (totalSwapped: string) => ({
    type: 'BRIDGE/SET-TOTAL-HYDRO-SWAPPED',
    payload: {totalSwapped}
} as const)
export const setLogMessageAC = (message: string, messageType: MessageType) => ({
    type: 'BRIDGE/SET-LOG-MESSAGE', message, messageType
} as const)

//Thunks:
export const connectToMetamaskThunk = (): AppThunk => async (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    const {status, account, chainID} = await localAPI.connectToMetamask()
    try {
        if (status) {
            if (account !== '') {
                dispatch(setAccountAC(account))
            }
            if (chainID !== 0) dispatch(setChainIDAC(chainID))
            dispatch(setLoadingAC(true))
        } else {
            dispatch(setLoadingAC(false))
        }
        dispatch(setLogMessageAC('connectToMetamask: success', 'success'))
    } catch {
        dispatch(setAppStatusAC('failed'))
    } finally {
        dispatch(setAppStatusAC('succeeded'))
    }

}

export const changeNetworkThunk = (networkID: number): AppThunk => async (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    try {
        if (await localAPI.changeNetwork(networkID)) {
        } else {
            console.error('changeNetwork error')
        }
        dispatch(setLogMessageAC('changeNetwork: success', 'success'))
    } catch {
        dispatch(setLogMessageAC('changeNetwork: error', 'error'))
    } finally {
        dispatch(setAppStatusAC('succeeded'))
    }
}

//turn on monitoring if chain in metamask changed
export const turnOnChainChangeMonitoringThunk = (): AppThunk => async (dispatch) => {
    try {
        dispatch(setLogMessageAC('turnOnChainChangeMonitoring: success', 'success'))
        window.ethereum.on('chainChanged', async function () {
            dispatch(setLogMessageAC('turnOnChainChangeMonitoring chainChanged: success', 'success'))
            dispatch(setAppStatusAC('loading'))
            const account = await localAPI.getAccountAddress()
            dispatch(setAccountAC(account))

            const newChainID = await localAPI.getChainID()
            dispatch(setChainIDAC(newChainID))
            dispatch(setAppStatusAC('succeeded'))
        })
    } catch {
        dispatch(setLogMessageAC('turnOnChainChangeMonitoring: error', 'error'))
    }

}

export const approveFundsThunk = (approvedAmount: string, leftChainId: number, way: ConversionWayType): AppThunk => async (dispatch, getState: () => AppStoreType) => {
    dispatch(setAppStatusAC('loading'))
    try {
        if (Number(approvedAmount) > 0) {
            const bridgeState = getState().bridge
            const hydroContractInstance = bridgeState.hydroContractInstance
            const hydraBalance = bridgeState.hydroBalance
            dispatch(setAppStatusAC('loading'))
            const bridgeContractInstance: Contract = localAPI.getBridgeContractInstance()
            await localAPI.exchangeTokenChain(hydroContractInstance, approvedAmount, leftChainId, way, bridgeContractInstance)
            dispatch(setLogMessageAC('approveFunds: success', 'success'))
        } else {
            console.error('approveFundsThunk', 'approvedAmount must be > 0')
        }
    } catch {
        dispatch(setLogMessageAC('approveFunds: error', 'error'))
    } finally {
        dispatch(setAppStatusAC('succeeded'))
    }
}

export const getHydroBalanceThunk = (
    isGetBalanceFromBackend: boolean = false,
    chainID: RealizedChainsRightType | 0 = 0,
    isLeftBalance: boolean = false
)
    : AppThunk => async (dispatch, getState: () => AppStoreType) => {
    const account = getState().bridge.account
    if (isGetBalanceFromBackend && chainID !== chainIDs.notSelected) {
        try {
            dispatch(setAppStatusAC('loading'))
            await serverApi.getHydroBalance(account, chainNamesForGetHydroBalance[chainID] as ChainType)
                .then(data => {
                    isLeftBalance
                        ? dispatch(setHydroBalanceAC(data.data.tokenBalance))
                        : dispatch(setHydroBalanceRightAC(data.data.tokenBalance))

                })
                .catch(e => {
                    console.error('serverApi error', e.response.data.errors[0].msg)
                    isLeftBalance
                        ? dispatch(setHydroBalanceAC('?'))
                        : dispatch(setHydroBalanceRightAC('?'))

                })

        } catch (e) {
            console.error('getHydroBalanceThunk error', e)
            dispatch(setHydroBalanceRightAC('?'))
        } finally {
            dispatch(setAppStatusAC('succeeded'))
        }
    } else { // get balance from active chainId + hydroContractInstance here
        dispatch(setAppStatusAC('loading'))
        const hydroContractInstance = localAPI.createHydroContractInstance(getState().bridge.chainID)
        dispatch(setHydroContractInstanceAC(hydroContractInstance))
        const hydroBalance = await localAPI.getHydroBalance(hydroContractInstance)
        dispatch(setHydroBalanceAC(hydroBalance))
        dispatch(setAppStatusAC('succeeded'))
    }
}

export const getTransactionFeeThunk = (amountOfHydro: string, chainID: RealizedChainsRightType | 0): AppThunk => async (dispatch) => {
    try {
        if (chainID !== 0) {
            dispatch(setAppStatusAC('loading'))
            await serverApi.getTransactionFee(amountOfHydro, chainNamesForGetHydroBalance[chainID] as ChainType)
                .then(data => {
                    dispatch(setTransactionFeeAC(data.data))
                })
                .catch(e => {
                    console.log('getTransactionFee error', e)
                    dispatch(setLogMessageAC(`getTransactionFee: error ${e}`, 'error'))
                })
        }
        dispatch(setLogMessageAC('getTransactionFee: success', 'success'))
    } catch {
        dispatch(setLogMessageAC('getTransactionFee: error', 'error'))
    } finally {
        dispatch(setAppStatusAC('succeeded'))
    }
}

export const setHydroContractInstanceThunk = (): AppThunk => (dispatch, getState: () => AppStoreType) => {
    try {
        dispatch(setAppStatusAC('loading'))
        const hydroContractInstance = localAPI.createHydroContractInstance(getState().bridge.chainID)
        dispatch(setHydroContractInstanceAC(hydroContractInstance))
        dispatch(setLogMessageAC('setHydroContractInstance: success', 'success'))
    } catch {
        dispatch(setLogMessageAC('setHydroContractInstance: error', 'error'))
    } finally {
        dispatch(setAppStatusAC('succeeded'))
    }
}

export const getTotalHydroSwappedThunk = (): AppThunk => async (dispatch, getState: () => AppStoreType) => {
    try {
        dispatch(setAppStatusAC('loading'))
        const bridgeState = getState().bridge
        const hydroContractInstance = bridgeState.hydroContractInstance
        const totalHydroSwapped = await localAPI.getTotalHydroSwapped(hydroContractInstance)
        dispatch(setTotalHydroSwappedAC(totalHydroSwapped))
        dispatch(setLogMessageAC('getTotalHydroSwapped: success', 'success'))
    } catch {
        dispatch(setLogMessageAC('getTotalHydroSwapped: error', 'error'))
    } finally {
        dispatch(setAppStatusAC('succeeded'))
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
    | ReturnType<typeof setHydroTokensToBeReceivedAC>
    | ReturnType<typeof setTotalHydroSwappedAC>
    | ReturnType<typeof setLogMessageAC>


type AppThunk = ThunkAction<void, AppStoreType, unknown, BridgeActionTypes>

declare let window: any // todo: maybe fix any

type MessageType = 'success' | 'error'
export type LogType = {
    id: string, message: string, messageType: MessageType
}

