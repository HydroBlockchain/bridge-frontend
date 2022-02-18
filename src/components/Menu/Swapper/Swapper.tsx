import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightArrowLeft} from "@fortawesome/free-solid-svg-icons";
import s from './Swapper.module.scss'

export const Swapper = (props: PropsType) => {
    return (
    <div className={props.isDisable
        ? `${s.swapper} ${s.swapperDisabled}`
        : s.swapper
    }
         onClick={() => {
             if (!props.isDisable) props.onClick()
         }}
    ><FontAwesomeIcon icon={faArrowRightArrowLeft}/>
    </div>
    )
}

type PropsType = {
    isDisable: boolean
    onClick: () => void
}