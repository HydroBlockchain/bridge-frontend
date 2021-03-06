import {ThunkAction} from 'redux-thunk'
import {AppStoreType} from './store'

const isTestNetsLS = localStorage.getItem('isTestNets')
let initialState = {
    status: 'idle' as RequestStatusType,
    isTestNets: isTestNetsLS ? JSON.parse(isTestNetsLS) : false,//true
    isSwapButtonDisabled: true,
    isApproveButtonDisabled: false,
    isAmountInputDisabled: false,
    isSelectorsDisabled: false,
    isSwapperDisabled: false,
    isSupportedChain: false,
    isSwapperClicked: false, // this is for solve async problem with native balance after swapping
    errorMessage: '',
    hydroBalanceErrorMessage: '',
}

export const appReducer = (state: AppStateType = initialState, action: ActionsType): AppStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
        case 'APP/SET-IS-TEST-NETS':
        case 'APP/SET-IS-SWAP-BUTTON-DISABLED':
        case 'APP/SET-IS-SUPPORTED-CHAIN':
        case 'APP/SET-IS-SWAPPER-CLICKED':
        case 'APP/SET-ERROR-MESSAGE':
        case 'APP/SET-HYDRO-BALANCE-ERROR-MESSAGE':
        case 'APP/SET-IS-APPROVE-BUTTON-DISABLED':
        case 'APP/SET-IS-AMOUNT-INPUT-DISABLED':
        case 'APP/SET-IS-SELECTOR-DISABLED':
        case 'APP/SET-IS-SWAPPER-DISABLED':
            return {...state, ...action.payload}
        default:
            return {...state}
    }
}

export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', payload: {status}} as const)
export const setIsTestNetsAC = (isTestNets: boolean) => ({type: 'APP/SET-IS-TEST-NETS', payload: {isTestNets}} as const)
// disable control elements if something is happened
export const setSwapButtonDisabledAC = (isSwapButtonDisabled: boolean) => ({type: 'APP/SET-IS-SWAP-BUTTON-DISABLED', payload: {isSwapButtonDisabled}} as const)
export const setApproveButtonDisabledAC = (isApproveButtonDisabled: boolean) => ({type: 'APP/SET-IS-APPROVE-BUTTON-DISABLED', payload: {isApproveButtonDisabled}} as const)
export const setIsAmountInputDisabledAC = (isAmountInputDisabled: boolean) => ({type: 'APP/SET-IS-AMOUNT-INPUT-DISABLED', payload: {isAmountInputDisabled}} as const)
export const setIsSelectorsDisabledAC = (isSelectorsDisabled: boolean) => ({type: 'APP/SET-IS-SELECTOR-DISABLED', payload: {isSelectorsDisabled}} as const)
export const setIsSwapperDisabledAC = (isSwapperDisabled: boolean) => ({type: 'APP/SET-IS-SWAPPER-DISABLED', payload: {isSwapperDisabled}} as const)
// if selected in Metamask chain is not supported in application:
export const setIsSupportedChainAC = (isSupportedChain: boolean) => ({type: 'APP/SET-IS-SUPPORTED-CHAIN', payload: {isSupportedChain}} as const)
export const setIsSwapperClickedAC = (isSwapperClicked: boolean) => ({type: 'APP/SET-IS-SWAPPER-CLICKED', payload: {isSwapperClicked}} as const)
export const setErrorMessageAC = (errorMessage: string) => ({type: 'APP/SET-ERROR-MESSAGE', payload: {errorMessage}} as const)
export const setHydroBalanceErrorMessageAC = (hydroBalanceErrorMessage: string) => ({type: 'APP/SET-HYDRO-BALANCE-ERROR-MESSAGE', payload: {hydroBalanceErrorMessage}} as const)

// types
export type AppStateType = typeof initialState
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
type ActionsType =
    | ReturnType<typeof setAppStatusAC>
    | ReturnType<typeof setIsTestNetsAC>
    | ReturnType<typeof setSwapButtonDisabledAC>
    | ReturnType<typeof setApproveButtonDisabledAC>
    | ReturnType<typeof setIsSupportedChainAC>
    | ReturnType<typeof setIsSwapperClickedAC>
    | ReturnType<typeof setErrorMessageAC>
    | ReturnType<typeof setHydroBalanceErrorMessageAC>
    | ReturnType<typeof setIsAmountInputDisabledAC>
    | ReturnType<typeof setIsSelectorsDisabledAC>
    | ReturnType<typeof setIsSwapperDisabledAC>
type AppThunk = ThunkAction<void, AppStoreType, unknown, ActionsType>