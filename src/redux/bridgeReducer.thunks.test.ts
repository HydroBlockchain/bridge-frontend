import {Contract} from 'web3-eth-contract'
import {fromWei} from 'web3-utils'
import {chainIDs} from '../common/common'
import {TransactionFeeType} from '../api/serverAPI'
import {bridgeStateType} from './bridgeReducer'

let startState: bridgeStateType

beforeEach(() => {
    startState = {
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
        tx_Link: '',
        network_Explorer: '',
        prev_hash: 0,
        swapping: false,

        transactionFee: {} as TransactionFeeType
    }
})