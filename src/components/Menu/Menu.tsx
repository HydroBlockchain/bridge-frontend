import React, {useEffect, useState} from "react";
import s from './Menu.module.scss'
import {NetworkElement} from "./NetworkElement/NetworkElement";
import {useDispatch, useSelector} from "react-redux";
import {connectToMetamaskThunk, InitialStateType} from "../../redux/bridge-reducer";
import {AppRootStateType} from "../../redux/store";
import {Swapper} from "./Swapper/Swapper";

const statusNetwork = (networkID: number) => {
    switch (networkID) {
        case 1:
            return 'eth'
        case 56:
            return 'bsc';
        case 137:
            return 'polygon';
        case 52:
            return 'csc';
        default:
            return ''
    }
}

export const Menu = (props: PropsType) => {

    const [inputValue, setInputValue] = useState<string>('')
    const [buttonText, setButtonText] = useState<'Connect Wallet' | 'Swap'>('Connect Wallet')
    const {networkID} = useSelector<AppRootStateType, InitialStateType>(state => state.bridge)

    const dispatch = useDispatch()

    const connectToMetamaskHandler = () => {
        dispatch(connectToMetamaskThunk())
    }

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
            : setIsSwapperDisabled(false)
    }, [networkID, stateLeft, stateRight])

    const onClickSwapper = () => {
        const tempStateValue = stateLeft
        setStateLeft(stateRight)
        setStateRight(tempStateValue)
    }

    return (
        <div className={props.className}>
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
                    <div>Balance: ?</div>
                </div>
                <div className={s.buttonIn}>
                    <input type="text" placeholder={'Enter amount'} value={inputValue}
                           onChange={e => setInputValue(e.currentTarget.value)}/>
                    <button>MAX</button>
                </div>

            </div>
            <div className={s.buttonsBlock}>
                <div>Amount Received</div>
                <button disabled={isSelAndAmountBtnDisabled}>Amount</button>
                <button className={networkID === 0
                    ? s.accent
                    : ''} onClick={connectToMetamaskHandler}>{buttonText}</button>
            </div>
        </div>
    )
}


type PropsType = {
    className: string
}
declare let window: any;

