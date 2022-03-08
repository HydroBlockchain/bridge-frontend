import React, {useEffect, useState} from "react";
import s from './Menu.module.scss'
import {NetworkElement} from "./NetworkElement/NetworkElement";
import {useDispatch, useSelector} from "react-redux";
import {
    approveFundsThunk,
    connectToMetamaskThunk,
    getHydroBalanceThunk,
    getTransactionFeeThunk,
    InitialStateType
} from "../../redux/bridge-reducer";
import {AppStoreType} from "../../redux/store";
import {Swapper} from "./Swapper/Swapper";
import {chainIDs} from "../../common/common";
import {ConversionWayType} from "../../api/localAPI";
import {RequestStatusType} from "../../redux/appReducer";


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
    const [outChainId, setOutChainId] = useState(chainIDs.notSelected)
    const [intoChainId, setIntoChainId] = useState(chainIDs.notSelected)
    const [swapWay, setSwapWay] = useState<undefined | ConversionWayType>(undefined)

    useEffect(() => {
        setOutChainId(chainID)
        chainID in chainIDs
            ? setIsSupportChain(true)
            : setIsSupportChain(false)
    }, [chainID])

    useEffect(() => {
        if (isSupportedChain) {
            dispatch(getHydroBalanceThunk())
        }
    }, [outChainId])

    useEffect(() => {
        // for swap conversion way
        if (outChainId === chainIDs.eth && intoChainId === chainIDs.bsc) {
            setSwapWay('eth2bsc')
        } else if (outChainId === chainIDs.bsc && intoChainId === chainIDs.eth) {
            setSwapWay('bsc2eth')
        } else if (intoChainId === chainIDs.coinExTest) {
            setSwapWay('coinexSmartChainTestnet')
        } else if (intoChainId === chainIDs.mumbaiTest) {
            setSwapWay('mumbaiTestnet')
        } else if (intoChainId === chainIDs.rinkebyTest) {
            setSwapWay('rinkebyTestnet')
        } else setSwapWay(undefined)

        if (intoChainId !== 0) {
            dispatch(getHydroBalanceThunk(true, intoChainId))
            dispatch(getTransactionFeeThunk(inputValue, intoChainId))
        }
    }, [outChainId, intoChainId])


    let timeoutId: ReturnType<typeof setTimeout>
    useEffect(() => {
        if (intoChainId !== 0 && inputValue !== '') {
            timeoutId = setTimeout(() => {
                dispatch(getTransactionFeeThunk(inputValue, intoChainId))
            }, 1000)
        }
        return () => {
            clearTimeout(timeoutId)
        }
    }, [inputValue])

    // Handlers:
    const connectToMetamaskHandler = () => {
        dispatch(connectToMetamaskThunk())
    }
    const exchangeHandler = () => {
        if (swapWay !== undefined) {
            dispatch(approveFundsThunk(inputValue, swapWay))
        }
    }
    const onClickSwapper = () => {
        const tempStateValue = outChainId
        setOutChainId(intoChainId)
        setIntoChainId(tempStateValue)
    }
    const maxHandler = () => {
        if (hydroBalance) setInputValue(hydroBalance)
    }

    // Is buttons or elements disabled:
    const isSwapButtonDisabled = () => {
        return swapWay === undefined || Number(inputValue) <= 0 || outChainId === intoChainId
            || (!transactionFee.hydroTokensToBeReceived) || appStatus === 'loading'
    }
    const isMaxButtonDisabled = () => {
        return hydroBalance === '' || appStatus === 'loading'
    }
    const isConnectWalletButtonDisabled = () => {
        return !isSupportedChain || appStatus === 'loading'
    }
    const isSwapperDisabled = () => {
        return intoChainId === chainIDs.notSelected || outChainId === intoChainId || appStatus === 'loading'
    }
    const isChainsSelectorsAndAmountInputDisabled = () => {
        return chainID === chainIDs.notSelected || appStatus === 'loading'
    }

    // begin of dark and light theme switch
    const isDark = window.matchMedia("(prefers-color-scheme:dark)").matches

    return (
        <div className={s.menuContainer}>
            <div className={`${s.menu}`}>
                <div className={s.selectNetwork}>
                    <NetworkElement text={'From'} isMain={true} state={outChainId} setState={setOutChainId}
                                    isDisabled={isChainsSelectorsAndAmountInputDisabled()}/>
                    <Swapper isDisable={isSwapperDisabled()} onClick={onClickSwapper}/>
                    <NetworkElement text={'To'} state={intoChainId} setState={setIntoChainId}
                                    isDisabled={isChainsSelectorsAndAmountInputDisabled()}/>
                </div>
                <div className={s.amount}>
                    <div className={s.headerAndBalance}>
                        <div className={s.amount}>
                            <div className={s.amountHeader}>
                                Amount
                            </div>
                            <div className={s.amountBody}>
                                <div>Left HYDRO Balance: {hydroBalance === '' ? '?' : hydroBalance}</div>
                                <div>Right HYDRO Balance: {hydroBalanceRight === '' ? '?' : hydroBalanceRight}</div>
                            </div>
                        </div>
                    </div>
                    <div className={s.buttonIn}>
                        <input type="text" placeholder={'Enter amount'} value={inputValue}
                               onChange={(e) => setInputValue(e.currentTarget.value)}
                               disabled={isChainsSelectorsAndAmountInputDisabled()}/>
                        <button onClick={maxHandler} disabled={isMaxButtonDisabled()}>MAX</button>
                    </div>
                    <div className={s.transactionFee}>
                        <b>Transaction fee:</b>
                        {!transactionFee.gasPrice && <span> ?</span>}
                        {transactionFee.gasPrice &&
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
                    <div className={s.amountReceived}>
                        {transactionFee.hydroTokensToBeReceived ? transactionFee.hydroTokensToBeReceived : '?'}
                    </div>
                    {chainID === chainIDs.notSelected &&
                      <button className={s.accent}
                              onClick={connectToMetamaskHandler}
                              disabled={isConnectWalletButtonDisabled()}
                      >Connect Wallet</button>}
                    {chainID !== chainIDs.notSelected &&
                      <button onClick={exchangeHandler}
                              disabled={isSwapButtonDisabled()}
                      >Swap</button>}
                </div>
            </div>
        </div>

    )
}