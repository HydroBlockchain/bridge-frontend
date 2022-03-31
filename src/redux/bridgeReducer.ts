import {ThunkAction} from 'redux-thunk'
import {AppStoreType} from './store'
import {Contract} from 'web3-eth-contract'
import {ChainIdType, ConversionWayType, localAPI} from '../api/localAPI'
import {chainNamesForGetHydroBalance, chainIDs, RealizedChainsRightType} from '../common/common'
import {ChainType, serverApi, TransactionFeeType} from '../api/serverAPI'
import {setAppStatusAC, setIsSwapperClickedAC, setSwapButtonDisabledAC} from './appReducer'
import {v1} from 'uuid'
import {setModalShowAC, setTransactionResultAC} from './modalReducer'

let initialState = {
    account: '',
    hydroBalance: '',
    hydroBalanceRight: '',
    loading: false,
    hydroContractInstance: {} as Contract,
    hydroAddress: null as string | null,
    totalSwapped: '0',
    chainID: chainIDs.notSelected,
    transactionFee: {} as TransactionFeeType,
    log: [] as Array<LogType>,
    leftNativeBalance: '',
    totalHydroSwapped: {
        totalValueSwappedOnTestnet: '',
        totalValueSwappedOnMainnet: '',
    } as TotalHydroSwappedType
}

export type bridgeStateType = typeof initialState

export const bridgeReducer = (state: bridgeStateType = initialState, action: BridgeActionTypes): BridgeInitialStateType => {
    switch (action.type) {
        case 'BRIDGE/SET-NETWORK-ID':
        case 'BRIDGE/SET-LOADING':
        case 'BRIDGE/SET-ACCOUNT':
        case 'BRIDGE/SET-HYDRO-BALANCE':
        case 'BRIDGE/SET-HYDRO-BALANCE-RIGHT':
        case 'BRIDGE/SET-HYDRO-CONTRACT-INSTANCE':
        case 'BRIDGE/SET-TRANSACTION-FEE':
        case 'BRIDGE/SET-TOTAL-HYDRO-SWAPPED':
        case 'BRIDGE/SET-LEFT-NATIVE-BALANCE':
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
export const setAccountAC = (account: string) => ({type: 'BRIDGE/SET-ACCOUNT', payload: {account}} as const)
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
export const setLogMessageAC = (message: string, messageType: MessageType) => ({
    type: 'BRIDGE/SET-LOG-MESSAGE', message, messageType
} as const)
export const setLeftNativeBalanceAC = (leftNativeBalance: string) => ({
    type: 'BRIDGE/SET-LEFT-NATIVE-BALANCE',
    payload: {leftNativeBalance}
} as const)
export const setTotalHydroSwappedAC = (totalHydroSwapped: TotalHydroSwappedType) => ({
    type: 'BRIDGE/SET-TOTAL-HYDRO-SWAPPED',
    payload: {totalHydroSwapped}
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
export const turnOnChainChangeMonitoringThunk = (): AppThunk => async (dispatch, getState: () => AppStoreType) => {
    const isSwapperClicked = getState().app.isSwapperClicked
    const chainID = getState().bridge.chainID
    try {
        dispatch(setLogMessageAC('turnOnChainChangeMonitoring: success', 'success'))
        window.ethereum.on('chainChanged', async function () {
            dispatch(setLogMessageAC('turnOnChainChangeMonitoring chainChanged: success', 'success'))
            dispatch(setAppStatusAC('loading'))
            const account = await localAPI.getAccountAddress()
            dispatch(setAccountAC(account))

            const newChainID = await localAPI.getChainID()
            dispatch(setChainIDAC(newChainID))
            dispatch(getNativeBalanceThunk())
            dispatch(setAppStatusAC('succeeded'))
        })
    } catch {
        dispatch(setLogMessageAC('turnOnChainChangeMonitoring: error', 'error'))
    }

}

//todo: this function
export const checkPreviousApprove = (): AppThunk => async (dispatch, getState: () => AppStoreType) => {
    // if this return nonzero umount // user will receive nonzero amount then amount to be input for swap
    // that should be less or equal to return amount
    // then user does not need to call approve

    // else user need to call approve

    // localAPI.contractAllowance(contract: Contract, owner: string, spender: string)

}

export const swapApproveFundsThunk = (
    swapOrApprove: 'swap' | 'approve',
    approvedAmount: string,
    leftChainId: ChainIdType | 0,
    rightChainId: ChainIdType | 0,
    way: ConversionWayType): AppThunk => async (dispatch, getState: () => AppStoreType) => {
    dispatch(setAppStatusAC('loading'))
    try {
        if (Number(approvedAmount) > 0) {
            const bridgeState = getState().bridge
            const hydroContractInstance = bridgeState.hydroContractInstance
            const hydraBalance = bridgeState.hydroBalance
            dispatch(setAppStatusAC('loading'))
            if (leftChainId !== 0) { // if left chainId selected
                const bridgeContractInstance: Contract = localAPI.getBridgeContractInstance(way)
                if (swapOrApprove === 'approve') {
                    const amount = await localAPI.contractAllowance(hydroContractInstance, way)
                    // todo: if user call the amount that less or equal to this amount, then it can call the swap directly
                    // if else
                    if (amount === 0) {
                        await localAPI.approveTokens(hydroContractInstance, approvedAmount, leftChainId, way, bridgeContractInstance)
                        dispatch(setSwapButtonDisabledAC(false))
                        dispatch(setLogMessageAC('approveFunds: success', 'success'))
                    } else {
                        // notify user that he has previously approved some amount
                        // will show user a message
                        try {
                            await localAPI.approveTokens(hydroContractInstance, '0', leftChainId, way, bridgeContractInstance)
                            await localAPI.approveTokens(hydroContractInstance, approvedAmount, leftChainId, way, bridgeContractInstance)
                            dispatch(setSwapButtonDisabledAC(false))
                        }
                        catch {
                            console.log('localAPI.approveTokens mistake')
                        }
                    }

                } else { // swap
                    if (rightChainId !== 0) {
                        try {
                            const serverAnswer = await localAPI.swapTokens(hydroContractInstance, approvedAmount, leftChainId, rightChainId, way, bridgeContractInstance)
                            console.log('bridgeReducer serverAnswer.data',serverAnswer.data)
                            dispatch(setTransactionResultAC(serverAnswer.data.explorerLink, serverAnswer.data.explorerLink, serverAnswer.data.transactionHash))
                            dispatch(setModalShowAC(true))
                        }
                        catch (e) {
                            dispatch(setTransactionResultAC('swapTokens error', '?', '?'))
                            dispatch(setModalShowAC(true))
                        }
                    }
                }
            }

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

export const getNativeBalanceThunk = (): AppThunk => async (dispatch) => {
    try {
        const address = await localAPI.getAccountAddress()
        const balance = await localAPI.getBalance(address)
        dispatch(setLeftNativeBalanceAC(balance))
        dispatch(setIsSwapperClickedAC(false))
    } catch {
        console.log('balance error')
    }
}

export const getTotalHydroSwappedThunk = (): AppThunk => async (dispatch, getState: () => AppStoreType) => {
    try {
        dispatch(setAppStatusAC('loading'))
        const bridgeState = getState().bridge
        const data = await serverApi.getTotalHydroSwapped()
        dispatch(setTotalHydroSwappedAC({
            totalValueSwappedOnTestnet: data.data.totalValueSwappedOnTestnet,
            totalValueSwappedOnMainnet: data.data.totalValueSwappedOnMainnet,
        }))
        dispatch(setLogMessageAC('getTotalHydroSwapped: success', 'success'))
    } catch {
        dispatch(setLogMessageAC('getTotalHydroSwapped: error', 'error'))
    } finally {
        dispatch(setAppStatusAC('succeeded'))
    }
}


export type BridgeInitialStateType = typeof initialState

export type BridgeActionTypes =
    | ReturnType<typeof setChainIDAC> | ReturnType<typeof setLoadingAC>
    | ReturnType<typeof setAccountAC>
    | ReturnType<typeof setHydroContractInstanceAC>
    | ReturnType<typeof setHydroBalanceAC>
    | ReturnType<typeof setHydroBalanceRightAC>
    | ReturnType<typeof setTransactionFeeAC>
    | ReturnType<typeof setAppStatusAC>
    | ReturnType<typeof setHydroTokensToBeReceivedAC>
    | ReturnType<typeof setTotalHydroSwappedAC>
    | ReturnType<typeof setLogMessageAC>
    | ReturnType<typeof setSwapButtonDisabledAC>
    | ReturnType<typeof setLeftNativeBalanceAC>
    | ReturnType<typeof setTotalHydroSwappedAC>
    | ReturnType<typeof setIsSwapperClickedAC>
    | ReturnType<typeof setModalShowAC>
    | ReturnType<typeof setTransactionResultAC>

type AppThunk = ThunkAction<void, AppStoreType, unknown, BridgeActionTypes>

declare let window: any // todo: maybe fix any

type MessageType = 'success' | 'error'
export type LogType = {
    id: string, message: string, messageType: MessageType
}
export type TotalHydroSwappedType = {
    totalValueSwappedOnTestnet: string
    totalValueSwappedOnMainnet: string
}

