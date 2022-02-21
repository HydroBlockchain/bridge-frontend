import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "./store";
import Web3 from "web3";
import {Contract} from "web3-eth-contract";
import {fromWei} from "web3-utils";
import {chains} from "../assets/chains";
import {localAPI} from "../api/localAPI";

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

export const bridgeReducer = (state = initialState, action: BridgeActionTypes): InitialStateType => {
    switch (action.type) {
        case 'BRIDGE/SET-WEB3':
        case 'BRIDGE/SET-NETWORK-ID':
        case 'BRIDGE/SET-LOADING':
        case "BRIDGE/SET-ACCOUNT":
            return {...state, ...action.payload}
    }
    return state
}

//Action creators:
const setWeb3AC = (web3: Web3) => ({type: 'BRIDGE/SET-WEB3', payload: {web3}} as const)
const setNetworkIDAC = (networkID: number) => ({type: 'BRIDGE/SET-NETWORK-ID', payload: {networkID}} as const)
const setLoadingAC = (loading: boolean) => ({type: 'BRIDGE/SET-LOADING', payload: {loading}} as const)
const setAccountAC = (account: string) => ({type: 'BRIDGE/SET-ACCOUNT', payload: {account}} as const)
const setHydroAC = (account: string) => ({type: 'BRIDGE/SET-HYDRO', payload: {account}} as const)

//Thunks:
export const connectToMetamaskThunk = (): AppThunk => async (dispatch, getState: () => AppRootStateType) => {
    //todo: add here progress bar of app

    try {
        let ethereum = window.ethereum;
        let web3 = window.web3;

        if (typeof ethereum !== 'undefined') {
            await ethereum.enable();
            web3 = new Web3(ethereum);
            dispatch(setWeb3AC(web3))
        }
        if (typeof web3 !== 'undefined') {
            console.log('Web3 Detected!')
            window.web3 = new Web3(web3.currentProvider);
            dispatch(setWeb3AC(web3))

            const account = await localAPI.getAccount()
            dispatch(setAccountAC(account))
            debugger

        } else {
            console.log('No Web3 Detected')
            window.web3 = new Web3(new Web3.providers.WebsocketProvider('wss://infura.io/ws/v3/72e114745bbf4822b987489c119f858b'));
            if (web3) dispatch(setWeb3AC(web3))
        }

        // set networkID
        const networkID = await localAPI.setNetworkID()
        dispatch(setNetworkIDAC(networkID))

        // window.ethereum.on('accountsChanged', function () {
        //     window.location.reload();
        // })

        //turn on monitoring if chain in metamask changed
        window.ethereum.on('chainChanged', async function () {
            // const account = await getAccountHelper()
            const account = await localAPI.getAccount()
            dispatch(setAccountAC(account))

            // const networkID = await setNetworkIDHelper()
            const networkID = await localAPI.setNetworkID()
            dispatch(setNetworkIDAC(networkID))

            console.log('CHAIN CHANGED!')
        })
    } catch (error) {
        dispatch(setLoadingAC(false))
        alert(
            `Please unlock you Metamask.`,
        );
        console.error(error);
    }
}

export const changeNetworkThunk = (networkName: string): AppThunk => async (dispatch, getState: () => AppRootStateType) => {
    if (await localAPI.changeNetwork(networkName)) {
        console.log('changeNetwork success')

        //todo: here will be status of app with progress bar

    } else {
        console.log('changeNetwork success')
    }
}

export const getHydroBalanceThunk = (): AppThunk => async (dispatch, getState: () => AppRootStateType) => {
    const bridgeState = getState().bridge
    const res = await bridgeState.hydroInstance.methods.balanceOf(bridgeState.account).call()
    const hydroBalance = bridgeState.web3.utils.fromWei(res.toString(), 'ether');
    dispatch(setHydroAC(hydroBalance))
}

export const approveFundsThunk = (): AppThunk => async (dispatch, getState: () => AppRootStateType) => {
    const bridgeState = getState().bridge
    await bridgeState.hydroInstance.methods.approve(bridgeState.swapAddress, bridgeState.web3.utils.toWei('1000000000')).send({
        from: bridgeState.account,
    })
}

export type InitialStateType = typeof initialState

export type BridgeActionTypes =
    | ReturnType<typeof setWeb3AC>
    | ReturnType<typeof setNetworkIDAC>
    | ReturnType<typeof setLoadingAC>
    | ReturnType<typeof setAccountAC>
    | ReturnType<typeof setHydroAC>

type AppThunk = ThunkAction<void, AppRootStateType, unknown, BridgeActionTypes>

declare let window: any; // todo: maybe fix any