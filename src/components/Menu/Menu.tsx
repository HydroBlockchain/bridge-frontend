import React, {useEffect, useState} from "react";
import s from './Menu.module.scss'
import {NetworkElement} from "./NetworkElement/NetworkElement";
import {useDispatch, useSelector} from "react-redux";
import {
    approveFundsThunk,
    connectToMetamaskThunk,
    getHydroBalanceThunk,
    getTransactionFeeThunk,
    InitialStateType,
    setChainIDAC, setHydroContractInstanceThunk, turnOnChainChangeMonitoringThunk
} from '../../redux/bridgeReducer'
import {AppStoreType} from "../../redux/store";
import {Swapper} from "./Swapper/Swapper";
import {chainIDs, isLightTheme} from "../../common/common";
import {ConversionWayType} from "../../api/localAPI";
import {RequestStatusType} from "../../redux/appReducer";
import cn from "classnames";


export const Menu = () => {
    const dispatch = useDispatch()

    const {
        chainID,
        hydroBalance,
        hydroBalanceRight,
        transactionFee
    } = useSelector<AppStoreType, InitialStateType>(state => state.bridge)
    const appStatus = useSelector<AppStoreType, RequestStatusType>(state => state.app.status)

    const [inputValue, setInputValue] = useState<string>('')
    const [isSupportedChain, setIsSupportChain] = useState(false) // if selected in Metamask chain is not supported in application
    const [leftChainId, setLeftChainId] = useState(chainIDs.notSelected)
    const [rightChainId, setRightChainId] = useState(chainIDs.notSelected)
    const [swapWay, setSwapWay] = useState<undefined | ConversionWayType>(undefined)

    useEffect(() => {
        setLeftChainId(chainID)
        if (chainID !== chainIDs.notSelected) {
            // dispatch(getHydroBalanceThunk())
            dispatch(getHydroBalanceThunk(true, chainID, true))
            dispatch(setHydroContractInstanceThunk())
        }
        chainID in chainIDs
            ? setIsSupportChain(true)
            : setIsSupportChain(false)
    }, [chainID])

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

        if (leftChainId !== chainIDs.notSelected && rightChainId !== chainIDs.notSelected && leftChainId !== rightChainId)
            dispatch(getTransactionFeeThunk(inputValue, rightChainId))
    }, [leftChainId, rightChainId])

    useEffect(() => {
        if (rightChainId !== chainIDs.notSelected) {
            dispatch(getHydroBalanceThunk(true, rightChainId))
        }
    }, [rightChainId])


    let timeoutId: ReturnType<typeof setTimeout>
    useEffect(() => {
        if (rightChainId !== 0 && inputValue !== '' && leftChainId !== rightChainId) {
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
    const exchangeHandler = () => {
        if (swapWay !== undefined) {
            dispatch(approveFundsThunk(inputValue, swapWay))
        }
    }
    const onClickSwapper = () => {
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
    const isSwapButtonDisabled = () => {
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
                                    isDisabled={isChainsSelectorsAndAmountInputDisabled()}/>
                    <Swapper isDisable={isSwapperDisabled()} onClick={onClickSwapper}/>
                    <NetworkElement text={'To'} state={rightChainId} setState={setRightChainId}
                                    isDisabled={isChainsSelectorsAndAmountInputDisabled()}/>
                </div>
                <div className={s.amount}>
                    <div className={s.headerAndBalance}>
                        <div className={s.amount}>
                            <div className={s.amountBody}>
                                <div>Left HYDRO Balance: {hydroBalance === '' ? '?' : hydroBalance}</div>
                                <div>Right HYDRO Balance: {hydroBalanceRight === '' ? '?' : hydroBalanceRight}</div>
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
                            <div>transactionCost: {transactionFee.transactionCostinEth}</div>
                            <div>transactionCostInHydro: {transactionFee.transactionCostInHydro}</div>
                          </div>
                        }
                    </div>
                </div>
                <div className={s.buttonsBlock}>
                    <div>Amount Received</div>
                    <div className={isLightTheme ? cn(s.amountReceived, s.lightThemeAmount) : cn(s.amountReceived)}>
                        {   leftChainId !== rightChainId
                                ? transactionFee.hydroTokensToBeReceived
                                    ? transactionFee.hydroTokensToBeReceived
                                    : '?'
                                : '?'
                        }
                    </div>
                    {chainID === chainIDs.notSelected &&
                      <button
                        className={isLightTheme
                            ? cn(s.accentLight, s.connectSwapButton, s.lightTheme)
                            : cn(s.accent, s.connectSwapButton)}
                        onClick={connectToMetamaskHandler}
                        disabled={isConnectWalletButtonDisabled()}
                      >Connect Wallet</button>}
                    {chainID !== chainIDs.notSelected &&
                      <button onClick={exchangeHandler}
                              disabled={isSwapButtonDisabled()}
                              className={isLightTheme
                                  ? cn(s.connectSwapButton, s.lightTheme)
                                  : cn(s.connectSwapButton)}
                      >Swap</button>}
                </div>
            </div>
        </div>

    )
}