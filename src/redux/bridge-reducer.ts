import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "./store";
import {Contract} from "web3-eth-contract";
import {fromWei} from "web3-utils";
import {localAPI} from "../api/localAPI";
import {networkIDs} from "../common/variables";
import App from "../App";

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
    networkID: networkIDs.notSelected,
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
        case "BRIDGE/SET-HYDRO-BALANCE":
        case "BRIDGE/SET-HYDRO-CONTRACT-INSTANCE":
            return {...state, ...action.payload}
    }
    return state
}

//Action creators:
const setNetworkIDAC = (networkID: number) => ({type: 'BRIDGE/SET-NETWORK-ID', payload: {networkID}} as const)
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
const setHydroBalanceRightAC = (hydroBalance: string) => ({
    type: 'BRIDGE/SET-HYDRO-BALANCE-RIGHT',
    payload: {hydroBalance}
} as const)

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

export const changeNetworkThunk = (networkID: number): AppThunk => async (dispatch, getState: () => AppRootStateType) => {
    if (await localAPI.changeNetwork(networkID)) {
        //todo: here will be status of app with progress bar
    } else {
        console.error('changeNetwork error')
    }
}

export const getHydroBalanceThunk = (isAnotherAccount: boolean = false, networkID: number = 0): AppThunk => async (dispatch, getState: () => AppRootStateType) => {
    let hydroContractInstanceRightOut
    let hydroContractInstanceOut
    if (isAnotherAccount) {
        console.log('getHydroBalanceThunk, come to isAnotherAccount')
      /*  const hydroContractInstanceRight = localAPI.createHydroContractInstance(getState().bridge.networkID)
        hydroContractInstanceRightOut = hydroContractInstanceRight
        console.log('getHydroBalanceThunk, hydroContractInstanceRight=',hydroContractInstanceRight)
        const hydroBalanceRight = await localAPI.getHydroBalance(hydroContractInstanceRight, {isTrue: true})
        console.log('hydroBalanceRight=',hydroBalanceRight)*/

        /* if (hydroBalanceRight !== '') {
             console.log('Menu:hydroBalanceRight', hydroBalanceRight)
         }*/
    }
    else {
        const hydroContractInstance = localAPI.createHydroContractInstance(getState().bridge.networkID)
        dispatch(setHydroContractInstanceAC(hydroContractInstance))
        hydroContractInstanceOut = hydroContractInstance
        const hydroBalance = await localAPI.getHydroBalance(hydroContractInstance)
        dispatch(setHydroBalanceAC(hydroBalance))
    }
    console.log('hydroContractInstanceOut===hydroContractInstanceRightOut',hydroContractInstanceOut===hydroContractInstanceRightOut)

}

export const getHydroBalanceForInactiveAccountThunk = (): AppThunk => async () => {

}

export const approveFundsThunk = (approvedAmount: string): AppThunk => async (dispatch, getState: () => AppRootStateType) => {
    if (Number(approvedAmount) > 0) {
        const bridgeState = getState().bridge
        const hydroContractInstance = bridgeState.hydroContractInstance
        const hydraBalance = bridgeState.hydroBalance
        if (hydraBalance === '') console.error('approveFundsThunk', 'HydroBalance === ""')
        await localAPI.exchangeEth2Bsc(hydroContractInstance, approvedAmount, "eth2bsc")
    } else {
        console.error('approveFundsThunk', 'approvedAmount must be > 0')
    }

}

export type InitialStateType = typeof initialState

export type BridgeActionTypes =
    | ReturnType<typeof setNetworkIDAC>
    | ReturnType<typeof setLoadingAC>
    | ReturnType<typeof setAccountAC>
    | ReturnType<typeof setHydroContractInstanceAC>
    | ReturnType<typeof setHydroBalanceAC>
    | ReturnType<typeof setHydroBalanceRightAC>

type AppThunk = ThunkAction<void, AppRootStateType, unknown, BridgeActionTypes>

declare let window: any; // todo: maybe fix any