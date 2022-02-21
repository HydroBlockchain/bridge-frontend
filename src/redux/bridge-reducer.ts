import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "./store";
import {Contract} from "web3-eth-contract";
import {fromWei} from "web3-utils";
import {localAPI} from "../api/localAPI";

let initialState = {
    account: '',
    hydroBalance: '0',
    bepBalance: '0',
    allowedHydro: '0',
    allowedBep: '0',
    loading: false,
    hydroInstance: {} as Contract,
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
    networkID: 0,
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
}

export const bridgeReducer = (state = initialState, action: BridgeActionTypes): InitialStateType => {
    switch (action.type) {
        case 'BRIDGE/SET-NETWORK-ID':
        case 'BRIDGE/SET-LOADING':
        case "BRIDGE/SET-ACCOUNT":
            return {...state, ...action.payload}
    }
    return state
}

//Action creators:
const setNetworkIDAC = (networkID: number) => ({type: 'BRIDGE/SET-NETWORK-ID', payload: {networkID}} as const)
const setLoadingAC = (loading: boolean) => ({type: 'BRIDGE/SET-LOADING', payload: {loading}} as const)
const setAccountAC = (account: string) => ({type: 'BRIDGE/SET-ACCOUNT', payload: {account}} as const)
const setHydroBalanceAC = (account: string) => ({type: 'BRIDGE/SET-HYDRO', payload: {account}} as const)

//Thunks:
export const connectToMetamaskThunk = (): AppThunk => async (dispatch, getState: () => AppRootStateType) => {
    //todo: add here progress bar of app
    const {status, account, networkID} = await localAPI.connectToMetamask()
    if (status) {
        if (account !== '') {
            dispatch(setAccountAC(account))
        }
        if (networkID !== 0) dispatch(setNetworkIDAC(networkID))
        dispatch(setLoadingAC(true))
    } else {
        dispatch(setLoadingAC(false))
    }

    //turn on monitoring if chain in metamask changed
    window.ethereum.on('chainChanged', async function () {
        const account = await localAPI.getAccountAddress()
        dispatch(setAccountAC(account))

        const networkID = await localAPI.getNetworkID()
        dispatch(setNetworkIDAC(networkID))
    })

}

export const changeNetworkThunk = (networkName: string): AppThunk => async (dispatch, getState: () => AppRootStateType) => {
    if (await localAPI.changeNetwork(networkName)) {
        //todo: here will be status of app with progress bar
    } else {
        console.error('changeNetwork error')
    }
}

export const getHydroBalanceThunk = (): AppThunk => async (dispatch, getState: () => AppRootStateType) => {
    await localAPI.getHydroBalance()
}

export const approveFundsThunk = (): AppThunk => async (dispatch, getState: () => AppRootStateType) => {
    alert('approveFundsThunk')
}

export type InitialStateType = typeof initialState

export type BridgeActionTypes =
    | ReturnType<typeof setNetworkIDAC>
    | ReturnType<typeof setLoadingAC>
    | ReturnType<typeof setAccountAC>
    | ReturnType<typeof setHydroBalanceAC>

type AppThunk = ThunkAction<void, AppRootStateType, unknown, BridgeActionTypes>

declare let window: any; // todo: maybe fix any