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

    const [inputValue, setInputValue] = useState<string>('')
    const [buttonText, setButtonText] = useState<'Connect Wallet' | 'Swap'>('Connect Wallet')
    const {networkID, hydroBalance} = useSelector<AppRootStateType, InitialStateType>(state => state.bridge)
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
        if (stateLeft === networkIDs.eth && stateRight === networkIDs.bsc) {console.log('eth2bsc'); setSwapWay('eth2bsc')}
        else if (stateLeft === networkIDs.bsc && stateRight === networkIDs.eth) {console.log('bsc2eth'); setSwapWay('bsc2eth')}
        else setSwapWay(undefined)
    }, [networkID, stateLeft, stateRight])

    useEffect(() => {
        if (isSupportedNetwork) {
            dispatch(getHydroBalanceThunk())
        }
    }, [networkID])

    /*const swapWay = (): ConversionWayType | undefined => {
        if (stateLeft === networkIDs.eth && stateRight === networkIDs.bsc) return 'eth2bsc'
        if (stateLeft === networkIDs.bsc && stateRight === networkIDs.eth) return 'eth2bsc'
        else return undefined
    }*/

    const connectToMetamaskHandler = () => {
        dispatch(connectToMetamaskThunk())
    }

    const swapHandler = () => {
        dispatch(approveFundsThunk(inputValue))
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
                    <div>Amount</div>
                    <div>HYDRO Balance: {hydroBalance === '' ? '?' : hydroBalance}</div>
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
                >Connect Wallet</button> }
                {networkID !== networkIDs.notSelected &&
                <button onClick={swapHandler}
                        disabled={swapWay === undefined || Number(inputValue) <=0}
                >Swap</button> }
            </div>
        </div>
    )
}


type PropsType = {
    className: string
}
declare let window: any;

