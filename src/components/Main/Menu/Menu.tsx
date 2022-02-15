import React from "react";
import s from './Menu.module.scss'
import {NetworkElement} from "./NetworkElement/MenuComponent";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightArrowLeft} from "@fortawesome/free-solid-svg-icons";

export const Menu = (props: PropsType) => {
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
                    <input type="text" placeholder={'Enter amount'}/>
                    <button>MAX</button>
                </div>

            </div>
            <div className={s.buttonsBlock}>
                <div>Amount Received</div>
                <button>Amount</button>
                <button>Connect Wallet</button>
            </div>
        </div>
    )
}

type PropsType = {
    className: string
}