import React from "react";
import s from './SelectNetwork.module.scss'
import {NetworkElement} from "./NetworkElement/NetworkElement";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowRightArrowLeft} from "@fortawesome/free-solid-svg-icons";

export const SelectNetwork = (props: PropsType) => {
    return (
        <div className={`${s.selectNetwork} ${props.className}`}>
            <NetworkElement text={'From'}/>
            <div className={s.swapper}><FontAwesomeIcon icon={faArrowRightArrowLeft}/> </div>
            <NetworkElement text={'To'}/>
        </div>
    )
}

type PropsType = {
    className: string
}