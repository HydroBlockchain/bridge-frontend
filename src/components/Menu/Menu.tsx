import React, {ChangeEvent, useEffect, useState} from "react";
import s from './Menu.module.scss'
import {NetworkElement} from "./NetworkElement/NetworkElement";
import {useDispatch, useSelector} from "react-redux";
import {
    approveFundsThunk,
    connectToMetamaskThunk,
    getHydroBalanceThunk, getTransactionFeeThunk,
    InitialStateType
} from "../../redux/bridge-reducer";
import {AppStoreType} from "../../redux/store";
import {Swapper} from "./Swapper/Swapper";
import {chainIDs} from "../../common/variables";
import {ConversionWayType} from "../../api/localAPI";


export const Menu = (props: PropsType) => {
    const dispatch = useDispatch()

    const {
        chainID,
        hydroBalance,
        hydroBalanceRight,
        transactionFee
    } = useSelector<AppStoreType, InitialStateType>(state => state.bridge)

    const [inputValue, setInputValue] = useState<string>('')
    const [isSupportedChain, setIsSupportChain] = useState(false) // if selected in Metamask chain is not supported in application
    const [outChainId, setOutChainId] = useState(chainIDs.notSelected)
    const [intoChainId, setIntoChainId] = useState(chainIDs.notSelected)
    const [isSelAndAmountBtnDisabled, setIsSelAndAmountBtnDisabled] = useState(true)
    const [isSwapperDisabled, setIsSwapperDisabled] = useState(true)
    const [swapWay, setSwapWay] = useState<undefined | ConversionWayType>(undefined)

    useEffect(() => {
        setOutChainId(chainID)
        chainID === chainIDs.notSelected
            ? setIsSelAndAmountBtnDisabled(true)
            : setIsSelAndAmountBtnDisabled(false);
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
        intoChainId === chainIDs.notSelected || outChainId === intoChainId
            ? setIsSwapperDisabled(true)
            : setIsSwapperDisabled(false);

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
            },1000)
        }
        return () => {
            clearTimeout(timeoutId)
        }
    }, [inputValue])

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

    // begin of dark and light theme switch
    const isDark = window.matchMedia("(prefers-color-scheme:dark)").matches

    const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        console.log('e.currentTarget.value', e.currentTarget.value)
        setInputValue(e.currentTarget.value)



    }

    return (
        <div className={`${props.className} ${s.menu}`}>
            <div className={s.selectNetwork}>
                <NetworkElement text={'From'} isMain={true} state={outChainId} setState={setOutChainId}
                                isDisabled={isSelAndAmountBtnDisabled}/>
                <Swapper isDisable={isSwapperDisabled} onClick={onClickSwapper}/>
                <NetworkElement text={'To'} state={intoChainId} setState={setIntoChainId}
                                isDisabled={isSelAndAmountBtnDisabled}/>
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
                           onChange={(e) => onChangeInput(e)} disabled={isSelAndAmountBtnDisabled}/>
                    <button>MAX</button>
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
                          disabled={!isSupportedChain}
                  >Connect Wallet</button>}
                {chainID !== chainIDs.notSelected &&
                  <button onClick={exchangeHandler}
                          disabled={swapWay === undefined || Number(inputValue) <= 0 || outChainId === intoChainId}
                  >Swap</button>}
            </div>
        </div>
    )
}


type PropsType = {
    className: string
}

