import {Contract} from 'web3-eth-contract'
import {fromWei} from 'web3-utils'
import {chainIDs} from '../common/common'
import {TransactionFeeType} from '../api/serverAPI'
import {bridgeStateType, LogType} from './bridgeReducer'

let startState: bridgeStateType

beforeEach(() => {
    startState = {
        account: '',
        hydroBalance: '',
        hydroBalanceRight: '',
        loading: false,
        hydroContractInstance: {} as Contract,
        hydroAddress: null as string | null,
        totalSwapped: '0',
        chainID: chainIDs.notSelected,
        transactionFee: {} as TransactionFeeType,
        log: [] as Array<LogType>
    }
})