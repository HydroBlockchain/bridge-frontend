import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "./store";
import Web3 from "web3";
import {Contract} from "web3-eth-contract";
import {fromWei} from "web3-utils";

let initialState = {
    account: '',
    hydroBalance: '0',
    bepBalance: '0',
    allowedHydro: '0',
    allowedBep: '0',
    loading: true,
    hydroInstance: {} as Contract,
    web3: {} as Web3,
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

export const bridgeReducer = (state = initialState, action: BridgeActionTypes): InitialStateProfileType => {
    switch (action.type) {
        case 'BRIDGE/SET-WEB3':
        case 'BRIDGE/SET-NETWORK-ID':
            return {...state, ...action.payload}
    }
    return state
}

//Action creators:
const setWeb3 = (web3: Web3) => ({type: 'BRIDGE/SET-WEB3', payload: {web3}} as const)
const setNetworkID = (networkID: number) => ({type: 'BRIDGE/SET-NETWORK-ID', payload: {networkID}} as const)

//Thunks:
export const connectToMetamask = (): AppThunk => async (dispatch) => {
    await (window as any).ethereum.enable();
    const web3 = new Web3((window as any).ethereum);
}


export type InitialStateProfileType = typeof initialState

export type BridgeActionTypes =
    | ReturnType<typeof setWeb3>
    | ReturnType<typeof setNetworkID>

type AppThunk = ThunkAction<void, AppRootStateType, unknown, BridgeActionTypes>

declare let window: any;