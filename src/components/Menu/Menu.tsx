import React, {useEffect, useState} from "react";
import s from './Menu.module.scss'
import {NetworkElement} from "./NetworkElement/NetworkElement";
import {useDispatch, useSelector} from "react-redux";
import {approveFundsThunk, connectToMetamaskThunk, InitialStateType} from "../../redux/bridge-reducer";
import {AppRootStateType} from "../../redux/store";
import {Swapper} from "./Swapper/Swapper";
import {localAPI} from "../../api/localAPI";

const statusNetwork = (networkID: number) => {
    switch (networkID) {
        case 1:
            return 'eth'
        case 56:
            return 'bsc'
        case 137:
            return 'polygon'
        case 52:
            return 'csc'
        case 80001: // for testing
            return 'MumbaiTest';
        case 4: // for testing
            return 'RinkebyTest'
        default:
            return ''
    }
}

export const Menu = (props: PropsType) => {
    const dispatch = useDispatch()

    const [inputValue, setInputValue] = useState<string>('')
    const [buttonText, setButtonText] = useState<'Connect Wallet' | 'Swap'>('Connect Wallet')
    const {networkID, hydroBalance} = useSelector<AppRootStateType, InitialStateType>(state => state.bridge)
    const [isSupportedNetwork, setIsSupportNetwork] = useState(false)
    const [stateLeft, setStateLeft] = useState("")
    const [stateRight, setStateRight] = useState("")
    const [isSelAndAmountBtnDisabled, setIsSelAndAmountBtnDisabled] = useState(true)
    const [isSwapperDisabled, setIsSwapperDisabled] = useState(true)

    useEffect(() => {
        setStateLeft(statusNetwork(networkID))
        if (networkID !== 0) {
            setButtonText('Swap')
            setIsSelAndAmountBtnDisabled(false)

        } else {
            setButtonText('Connect Wallet')
            setIsSelAndAmountBtnDisabled(true)
        }
        stateRight === '' || stateLeft === stateRight
            ? setIsSwapperDisabled(true)
            : setIsSwapperDisabled(false);

        (networkID === 0 || networkID === 1 || networkID === 56 || networkID === 137 || networkID === 57)
            ? setIsSupportNetwork(true) : setIsSupportNetwork(false)

    }, [networkID, stateLeft, stateRight])

    useEffect(() => {
        if (networkID !== 0) {
            // localAPI.getHydroBalance()
        }
    }, [networkID])

    const connectToMetamaskHandler = () => {
        dispatch(connectToMetamaskThunk())
    }

    const swapHandler = () => {
        dispatch(approveFundsThunk())
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
                    <div>Balance: {hydroBalance}</div>
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
                <button className={networkID === 0
                    ? s.accent
                    : ''}
                        onClick={networkID === 0 ? connectToMetamaskHandler : swapHandler}
                        disabled={!isSupportedNetwork}
                >{buttonText}</button>
            </div>
        </div>
    )
}


type PropsType = {
    className: string
}
declare let window: any;

