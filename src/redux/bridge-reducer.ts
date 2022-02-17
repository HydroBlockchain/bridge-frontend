import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "./store";
import Web3 from "web3";
import {Contract} from "web3-eth-contract";
import {fromWei} from "web3-utils";
import {chains} from "../assets/chains";

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
const setWeb3 = (web3: Web3) => ({type: 'BRIDGE/SET-WEB3', payload: {web3}} as const)
const setNetworkID = (networkID: number) => ({type: 'BRIDGE/SET-NETWORK-ID', payload: {networkID}} as const)
const setLoading = (loading: boolean) => ({type: 'BRIDGE/SET-LOADING', payload: {loading}} as const)
const setAccount = (account: string) => ({type: 'BRIDGE/SET-ACCOUNT', payload: {account}} as const)




//Thunks:
export const connectToMetamask = (): AppThunk => async (dispatch, getState: () => AppRootStateType) => {
    try {
        let ethereum = window.ethereum;
        let web3 = window.web3;

        if (typeof ethereum !== 'undefined') {
            await ethereum.enable();
            web3 = new Web3(ethereum);
            dispatch(setWeb3(web3))
        }
        if (typeof web3 !== 'undefined') {
            console.log('Web3 Detected!')
            window.web3 = new Web3(web3.currentProvider);
            dispatch(setWeb3(web3))

            // set account
            const accounts = await getState().bridge.web3.eth.getAccounts();
            const account = accounts[0]
            dispatch(setAccount(account))

        } else {
            console.log('No Web3 Detected')
            window.web3 = new Web3(new Web3.providers.WebsocketProvider('wss://infura.io/ws/v3/72e114745bbf4822b987489c119f858b'));
            if (web3) dispatch(setWeb3(web3))
        }

        // set networkID
        const networkID = await web3.eth.net.getId();
        dispatch(setNetworkID(networkID))

        // window.ethereum.on('accountsChanged', function () {
        //     window.location.reload();
        // })

        /*window.ethereum.on('chainChanged', function () {
            window.location.reload();
        })*/
    } catch (error) {
        dispatch(setLoading(false))
        alert(
            `Please unlock you Metamask.`,
        );
        console.error(error);
    }
}

const changeNetworkHelper = async (networkName: string) => {
    try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{chainId: chains[networkName].chainId}],
        });
        // console.log('changeNetwork success')
        return true
    } catch (error) {
        try {
            if ((error as ErrorType).code === 4902) {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [chains[networkName]],
                });
                return true
            }
        } catch (error) {
            return false
        }
    }
}

export const changeNetwork = (networkName: string): AppThunk => async (dispatch, getState: () => AppRootStateType) => {
    /*try {
        if (!window.ethereum) console.warn("No crypto wallet found");
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{chainId: chains[networkName].chainId}],
        });
        console.log('changeNetwork success')
        // change flag
    } catch (error) {
        if ((error as ErrorType).code === 4902) {
            await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [chains[networkName]],
            });
            // console.warn('changeNetwork error');
            //change flag
        }

        /!*await connectToMetamaskAPI(networkName)
            .then(() => {
                console.log('changeNetwork success')
            })
            .catch(() =>{
                console.warn('changeNetwork error');
            })*!/
    }*/
    if (await changeNetworkHelper(networkName)) {
        console.log('changeNetwork success')

        // set account
        const accounts = await getState().bridge.web3.eth.getAccounts();
        const account = accounts[0]
        dispatch(setAccount(account))

        // set networkID
        let web3 = window.web3;
        const networkID = await web3.eth.net.getId();
        dispatch(setNetworkID(networkID))

    } else {
        console.log('changeNetwork success')
    }

}

export type InitialStateType = typeof initialState

export type BridgeActionTypes =
    | ReturnType<typeof setWeb3>
    | ReturnType<typeof setNetworkID>
    | ReturnType<typeof setLoading>
    | ReturnType<typeof setAccount>

type AppThunk = ThunkAction<void, AppRootStateType, unknown, BridgeActionTypes>

type ErrorType = {
    code: number
}

declare let window: any; //todo: maybe fix any