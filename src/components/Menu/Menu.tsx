import React, {useState} from "react";
import s from './Menu.module.scss'
import {NetworkElement} from "./NetworkElement/NetworkElement";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {useDispatch} from "react-redux";
import {changeNetwork, connectToMetamask} from "../../redux/bridge-reducer";

export const Menu = (props: PropsType) => {

    const [inputValue, setInputValue] = useState<string>('')
    const [buttonText, setButtonText] = useState<'Connect Wallet' | 'Swap'>('Connect Wallet')

    const dispatch = useDispatch()

    const connectToMetamaskHandler = () => {
        dispatch(connectToMetamask())
    }

    return (
        <div className={props.className}>
            <div className={s.selectNetwork}>
                <NetworkElement text={'From'}/>
                <div className={s.swapper}><FontAwesomeIcon icon={faArrowRightArrowLeft}/></div>
                <NetworkElement text={'To'}/>
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
                <button>Amount</button>
                <button onClick={connectToMetamaskHandler}>{buttonText}</button>
            </div>
        </div>
    )
}



type PropsType = {
    className: string
}
declare let window: any;

