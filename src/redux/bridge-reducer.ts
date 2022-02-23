import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "./store";
import {Contract} from "web3-eth-contract";
import {fromWei} from "web3-utils";
import {localAPI} from "../api/localAPI";
import {networkIDs} from "../common/variables";

let initialState = {
    account: '',
    hydroBalance: '',
    bepBalance: '0',
    allowedHydro: '0',
    allowedBep: '0',
    loading: false,
    hydroContract: {} as Contract,
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
        case "BRIDGE/SET-HYDRO-CONTRACT":
            return {...state, ...action.payload}
    }
    return state
}

//Action creators:
const setNetworkIDAC = (networkID: number) => ({type: 'BRIDGE/SET-NETWORK-ID', payload: {networkID}} as const)
const setLoadingAC = (loading: boolean) => ({type: 'BRIDGE/SET-LOADING', payload: {loading}} as const)
const setAccountAC = (account: string) => ({type: 'BRIDGE/SET-ACCOUNT', payload: {account}} as const)
const setHydroContractAC = (hydroContract: Contract) => ({
    type: 'BRIDGE/SET-HYDRO-CONTRACT',
    payload: {hydroContract}
} as const)
const setHydroBalanceAC = (hydroBalance: string) => ({
    type: 'BRIDGE/SET-HYDRO-BALANCE',
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

export const getHydroBalanceThunk = (): AppThunk => async (dispatch, getState: () => AppRootStateType) => {
    const hydroContract = localAPI.createHydroContract(getState().bridge.networkID)
    dispatch(setHydroContractAC(hydroContract))
    const hydroBalance = await localAPI.getHydroBalance(hydroContract)
    dispatch(setHydroBalanceAC(hydroBalance))
}

export const approveFundsThunk = (approvedAmount: string): AppThunk => async (dispatch, getState: () => AppRootStateType) => {
    if (Number(approvedAmount) > 0) {
        const bridgeState = getState().bridge
        const hydroContract = bridgeState.hydroContract
        const hydraBalance = bridgeState.hydroBalance
        if (hydraBalance === '') console.error('approveFundsThunk', 'HydroBalance === ""')
        const swapContractAddress = "0xfa41d158Ea48265443799CF720a120BFE77e41ca" // eth 2 bsc
        // const swapContractAddress = "0xa8377d8A0ee92120095bC7ae2d8A8E1973CcEa95" // bsc 2 eth
        const way = 'Eth2Bsc' // Bsc2Eth
        const networkId = networkIDs.eth
        await localAPI.exchangeEth2Bsc(hydroContract, approvedAmount)
    }
    else {
        console.error('approveFundsThunk', 'approvedAmount must be > 0')
    }

}

export type InitialStateType = typeof initialState

export type BridgeActionTypes =
    | ReturnType<typeof setNetworkIDAC>
    | ReturnType<typeof setLoadingAC>
    | ReturnType<typeof setAccountAC>
    | ReturnType<typeof setHydroContractAC>
    | ReturnType<typeof setHydroBalanceAC>

type AppThunk = ThunkAction<void, AppRootStateType, unknown, BridgeActionTypes>

declare let window: any; // todo: maybe fix any