import React, {useEffect, useState} from "react";
import s from './Menu.module.scss'
import {NetworkElement} from "./NetworkElement/NetworkElement";
import {useDispatch, useSelector} from "react-redux";
import {
    approveFundsThunk,
    connectToMetamaskThunk,
    getHydroBalanceThunk,
    InitialStateType
} from "../../redux/bridge-reducer";
import {AppRootStateType} from "../../redux/store";
import {Swapper} from "./Swapper/Swapper";
import {networkIDs} from "../../common/variables";
import {ConversionWayType} from "../../api/localAPI";


export const Menu = (props: PropsType) => {
    const dispatch = useDispatch()

    const {networkID, hydroBalance, hydroBalanceRight} = useSelector<AppRootStateType, InitialStateType>(state => state.bridge)

    const [inputValue, setInputValue] = useState<string>('')
    const [buttonText, setButtonText] = useState<'Connect Wallet' | 'Swap'>('Connect Wallet')
    const [isSupportedNetwork, setIsSupportNetwork] = useState(false)
    const [stateLeft, setStateLeft] = useState(0)
    const [stateRight, setStateRight] = useState(0)
    const [isSelAndAmountBtnDisabled, setIsSelAndAmountBtnDisabled] = useState(true)
    const [isSwapperDisabled, setIsSwapperDisabled] = useState(true)
    const [swapWay, setSwapWay] = useState<undefined | ConversionWayType>(undefined)

    useEffect(() => {
        setStateLeft(networkID)
        if (networkID !== networkIDs.notSelected) {
            setButtonText('Swap')
            setIsSelAndAmountBtnDisabled(false)

        } else {
            setButtonText('Connect Wallet')
            setIsSelAndAmountBtnDisabled(true)
        }
        stateRight === networkIDs.notSelected || stateLeft === stateRight
            ? setIsSwapperDisabled(true)
            : setIsSwapperDisabled(false);

        (networkID === networkIDs.notSelected || networkID === networkIDs.eth || networkID === networkIDs.bsc
            || networkID === networkIDs.mumbaiTest || networkID === networkIDs.rinkebyTest
            || networkID === networkIDs.coinExTest)
            ? setIsSupportNetwork(true) : setIsSupportNetwork(false)

        // for swap conversion way
        if (stateLeft === networkIDs.eth && stateRight === networkIDs.bsc) {
            console.log('eth2bsc')
            setSwapWay('eth2bsc')
        } else if (stateLeft === networkIDs.bsc && stateRight === networkIDs.eth) {
            console.log('bsc2eth')
            setSwapWay('bsc2eth')
        } else if (stateRight === networkIDs.coinExTest) {
            setSwapWay('coinexSmartChainTestnet')
        } else if (stateRight === networkIDs.mumbaiTest) {
            setSwapWay('mumbaiTestnet')
        } else if (stateRight === networkIDs.rinkebyTest) {
            setSwapWay('rinkebyTestnet')
        }

        else setSwapWay(undefined)

        if (stateRight !== 0) { // CORS errors
            console.log('Menu:start position of right state')
            dispatch(getHydroBalanceThunk(true, stateRight))

        }
    }, [networkID, stateLeft, stateRight])

    useEffect(() => {
        if (isSupportedNetwork) {
            dispatch(getHydroBalanceThunk())
        }
    }, [networkID])

    const connectToMetamaskHandler = () => {
        dispatch(connectToMetamaskThunk())
    }

    const exchangeHandler = () => {
        if (swapWay !== undefined) {
            dispatch(approveFundsThunk(inputValue, swapWay))
        }
    }

    const onClickSwapper = () => {
        const tempStateValue = stateLeft
        setStateLeft(stateRight)
        setStateRight(tempStateValue)
    }

    return (
        <div className={`${props.className} ${s.menu}`}>
            <div className={s.selectNetwork}>
                <NetworkElement text={'From'} isMain={true} state={stateLeft} setState={setStateLeft}
                                isDisabled={isSelAndAmountBtnDisabled}/>
                <Swapper isDisable={isSwapperDisabled} onClick={onClickSwapper}/>
                <NetworkElement text={'To'} state={stateRight} setState={setStateRight}
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
                           onChange={e => setInputValue(e.currentTarget.value)}/>
                    <button>MAX</button>
                </div>

            </div>
            <div className={s.buttonsBlock}>
                <div>Amount Received</div>
                <div className={s.amountReceived}>{inputValue !== '' ? inputValue : 0}</div>
                {networkID === networkIDs.notSelected &&
                    <button className={s.accent}
                            onClick={connectToMetamaskHandler}
                            disabled={!isSupportedNetwork}
                    >Connect Wallet</button>}
                {networkID !== networkIDs.notSelected &&
                    <button onClick={exchangeHandler}
                            disabled={swapWay === undefined || Number(inputValue) <= 0}
                    >Swap</button>}
            </div>
        </div>
    )
}


type PropsType = {
    className: string
}

