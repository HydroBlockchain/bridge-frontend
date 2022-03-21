import React, {useEffect, useState} from 'react'
import s from './Menu.module.scss'
import {NetworkElement} from './NetworkElement/NetworkElement'
import {useDispatch, useSelector} from 'react-redux'
import {
    BridgeInitialStateType,
    connectToMetamaskThunk,
    getHydroBalanceThunk,
    getTransactionFeeThunk,
    setAccountAC,
    setChainIDAC,
    setHydroBalanceAC,
    setHydroBalanceRightAC,
    setHydroContractInstanceThunk,
    setHydroTokensToBeReceivedAC,
    setTransactionFeeAC,
    swapApproveFundsThunk,
    turnOnChainChangeMonitoringThunk
} from '../../redux/bridgeReducer'
import {AppStoreType} from '../../redux/store'
import {Swapper} from './Swapper/Swapper'
import {chainIDs, chainsNationalSymbols, chainsPictures, isLightTheme} from '../../common/common'
import {ConversionWayType} from '../../api/localAPI'
import {
    AppStateType,
    RequestStatusType,
    setIsSupportedChainAC
} from '../../redux/appReducer'
import cn from 'classnames'

export const Menu = () => {
    const dispatch = useDispatch()
    const {
        chainID,
        hydroBalance,
        hydroBalanceRight,
        transactionFee,
    } = useSelector<AppStoreType, BridgeInitialStateType>(state => state.bridge)
    const appStatus = useSelector<AppStoreType, RequestStatusType>(state => state.app.status)
    const {
        isSwapButtonDisabled,
        isTestNets,
        isSupportedChain,
    } = useSelector<AppStoreType, AppStateType>(state => state.app)

    const [inputValue, setInputValue] = useState<string>('')
    const [leftChainId, setLeftChainId] = useState(chainIDs.notSelected)
    const [rightChainId, setRightChainId] = useState(chainIDs.notSelected)
    const [swapWay, setSwapWay] = useState<undefined | ConversionWayType>(undefined)

    const checkIsChainIdSupported = (chainID: chainIDs) => {
        const chainIDsActive = isTestNets
            ? [chainIDs.notSelected, chainIDs.mumbaiTest, chainIDs.rinkebyTest, chainIDs.coinExTest]
            : [chainIDs.notSelected, chainIDs.eth, chainIDs.bsc]
        return chainIDsActive.includes(chainID);
    }

    useEffect(() => {
        if (chainID !== chainIDs.notSelected && checkIsChainIdSupported(chainID)) {
            dispatch(getHydroBalanceThunk(true, chainID, true))
            dispatch(setHydroContractInstanceThunk())
            setLeftChainId(chainID)
        }
        dispatch(setIsSupportedChainAC(checkIsChainIdSupported(chainID)))
    }, [chainID, isTestNets])

    useEffect(() => {
        // for swap conversion way
        if (leftChainId === chainIDs.eth && rightChainId === chainIDs.bsc) {
            setSwapWay('eth2bsc')
        } else if (leftChainId === chainIDs.bsc && rightChainId === chainIDs.eth) {
            setSwapWay('bsc2eth')
        } else if (rightChainId === chainIDs.coinExTest) {
            setSwapWay('coinexSmartChainTestnet')
        } else if (rightChainId === chainIDs.mumbaiTest) {
            setSwapWay('mumbaiTestnet')
        } else if (rightChainId === chainIDs.rinkebyTest) {
            setSwapWay('rinkebyTestnet')
        } else setSwapWay(undefined)

        if (leftChainId !== chainIDs.notSelected &&
            rightChainId !== chainIDs.notSelected && leftChainId !== rightChainId) {
            dispatch(getTransactionFeeThunk(inputValue, rightChainId))
        }
    }, [leftChainId, rightChainId])

    useEffect(() => {
        if (rightChainId !== chainIDs.notSelected) {
            dispatch(getHydroBalanceThunk(true, rightChainId))
        }
    }, [rightChainId])

    // if checkbox of isTestNets changing then zero all values of menu
    useEffect(() => {
        !checkIsChainIdSupported(chainID) && setLeftChainId(chainIDs.notSelected)
        setRightChainId(chainIDs.notSelected)
        dispatch(setHydroBalanceAC(''))
        dispatch(setHydroBalanceRightAC(''))
        setInputValue('')
        dispatch(setTransactionFeeAC({
            gasPrice: '',
            gasRequired: 0,
            hydroTokensToBeReceived: 0,
            priceTimestamp: '',
            transactionCostInHydro: 0,
            transactionCostinEth: ''
        }))
    }, [isTestNets])

    let timeoutId: ReturnType<typeof setTimeout>
    useEffect(() => {
        if (rightChainId !== 0 && inputValue !== '' && leftChainId !== rightChainId) {
            dispatch(setHydroTokensToBeReceivedAC(0))
            timeoutId = setTimeout(() => {
                dispatch(getTransactionFeeThunk(inputValue, rightChainId))
            }, 1000)
        }
        return () => {
            clearTimeout(timeoutId)
        }
    }, [inputValue])

    // Handlers:
    const connectToMetamaskHandler = () => {
        dispatch(connectToMetamaskThunk())
        dispatch(turnOnChainChangeMonitoringThunk())
    }
    const approveHandler = () => {
        if (swapWay !== undefined) {
            dispatch(swapApproveFundsThunk('approve', inputValue, leftChainId, swapWay))
        }
    }
    const swapHandler = () => {
        if (swapWay !== undefined) {
            dispatch(swapApproveFundsThunk('swap', inputValue, leftChainId, swapWay))
        }
    }
    const onClickSwapper = () => {
        dispatch(setTransactionFeeAC({
            gasPrice: '',
            gasRequired: 0,
            hydroTokensToBeReceived: 0,
            priceTimestamp: '',
            transactionCostInHydro: 0,
            transactionCostinEth: ''
        }))
        dispatch(setHydroBalanceAC(''))
        dispatch(setHydroBalanceRightAC(''))
        const tempLeftId = leftChainId
        const tempRightId = rightChainId
        dispatch(setChainIDAC(tempRightId))
        setLeftChainId(tempRightId)
        setRightChainId(tempLeftId)
    }
    const maxHandler = () => {
        if (hydroBalance) setInputValue(hydroBalance)
    }

    // Is buttons or elements disabled:
    const isApproveButtonDisabled = () => {
        return swapWay === undefined || Number(inputValue) <= 0 || leftChainId === rightChainId
            || (!transactionFee.hydroTokensToBeReceived) || appStatus === 'loading'
    }
    const isMaxButtonDisabled = () => {
        return hydroBalance === '' || appStatus === 'loading'
    }
    const isConnectWalletButtonDisabled = () => {
        return !isSupportedChain || appStatus === 'loading'
    }
    const isSwapperDisabled = () => {
        return rightChainId === chainIDs.notSelected || leftChainId === rightChainId || appStatus === 'loading'
    }
    const isChainsSelectorsAndAmountInputDisabled = () => {
        return chainID === chainIDs.notSelected || appStatus === 'loading'
    }

    return (
        <div className={s.menuContainer}>
            <div className={isLightTheme ? `${s.menu} ${s.lightTheme}` : `${s.menu}`}>
                <div className={s.selectNetwork}>
                    <NetworkElement text={'From'} isMain={true} state={leftChainId} setState={setLeftChainId}
                                    isDisabled={isChainsSelectorsAndAmountInputDisabled()}
                                    chainPicture={chainsPictures[leftChainId]}
                    />
                    <Swapper isDisable={isSwapperDisabled()} onClick={onClickSwapper}/>
                    <NetworkElement text={'To'} state={rightChainId} setState={setRightChainId}
                                    isDisabled={isChainsSelectorsAndAmountInputDisabled()}
                                    chainPicture={chainsPictures[rightChainId]}/>
                </div>
                <div className={s.amount}>
                    <div className={s.headerAndBalance}>
                        <div className={s.amount}>
                            <div className={s.amountBody}>
                                <div>Balance: {hydroBalance === '' ? '?' : `${hydroBalance} HYDRO`}</div>
                                <div>Balance: {hydroBalanceRight === '' ? '?' : `${hydroBalanceRight} HYDRO`}</div>
                            </div>
                            <div className={s.amountHeader}>
                                Amount
                            </div>
                        </div>
                    </div>
                    <div className={s.buttonIn}>
                        <input type="text" placeholder={'Enter amount'} value={inputValue}
                               onChange={(e) => setInputValue(e.currentTarget.value)}
                               disabled={isChainsSelectorsAndAmountInputDisabled()}
                               className={
                                   isLightTheme
                                       ? isChainsSelectorsAndAmountInputDisabled()
                                           ? s.disabledInputLight
                                           : s.lightThemeInput
                                       : isChainsSelectorsAndAmountInputDisabled()
                                           ? s.disabledInputDark
                                           : s.darkThemeInput
                               }
                        />
                        <button onClick={maxHandler} disabled={isMaxButtonDisabled()}
                                className={isLightTheme ? s.lightTheme : ''}>MAX
                        </button>
                    </div>
                    <div className={s.transactionFee}>
                        <b>Transaction fee:</b>
                        {(!transactionFee.gasPrice || leftChainId === rightChainId) && <span> ?</span>}
                        {(transactionFee.gasPrice && leftChainId !== rightChainId) &&
                          <div>
                            <div>gasPrice: {transactionFee.gasPrice}</div>
                            <div>gasRequired: {transactionFee.gasRequired}</div>
                            <div>transactionCost: {transactionFee.transactionCostinEth} {chainsNationalSymbols[leftChainId]}</div>
                            <div>transactionCostInHydro: {transactionFee.transactionCostInHydro} HYDRO</div>
                          </div>
                        }
                    </div>
                </div>
                <div className={s.buttonsBlock}>
                    <div>Amount Received</div>
                    <div className={isLightTheme ? cn(s.amountReceived, s.lightThemeAmount) : cn(s.amountReceived)}>
                        {leftChainId !== rightChainId
                            ? transactionFee.hydroTokensToBeReceived
                                ? transactionFee.hydroTokensToBeReceived
                                : '?'
                            : '?'
                        }
                    </div>
                    {chainID === chainIDs.notSelected &&
                      <button
                        className={isLightTheme
                            ? cn(s.accentLight, s.connectSwapButtons, s.lightTheme)
                            : cn(s.accent, s.connectSwapButtons)}
                        onClick={connectToMetamaskHandler}
                        disabled={isConnectWalletButtonDisabled()}
                      >Connect Wallet</button>}
                    {chainID !== chainIDs.notSelected &&
                      <div>
                        <button disabled={isApproveButtonDisabled()}
                                onClick={approveHandler}
                                className={isLightTheme
                                    ? cn(s.connectSwapButtons, s.swapApproveButtons, s.lightTheme)
                                    : cn(s.connectSwapButtons, s.swapApproveButtons)}>Approve
                        </button>
                        <button onClick={swapHandler}
                                disabled={isSwapButtonDisabled}
                                className={isLightTheme
                                    ? cn(s.connectSwapButtons, s.swapApproveButtons, s.lightTheme)
                                    : cn(s.connectSwapButtons, s.swapApproveButtons)}
                        >Swap
                        </button>
                      </div>
                    }
                </div>
            </div>
        </div>

    )
}