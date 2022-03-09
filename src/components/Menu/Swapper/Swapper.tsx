import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightArrowLeft} from "@fortawesome/free-solid-svg-icons";
import s from './Swapper.module.scss'
import cn from "classnames";
import {isLightTheme} from "../../../common/common";

export const Swapper  = (props: PropsType) => {
    return (
    <div className={
        isLightTheme
            ? props.isDisable
                ? cn(s.swapper, s.swapperDisabled, s.lightTheme)
                : cn(s.swapper, s.lightTheme)
            : props.isDisable
                ? cn(s.swapper, s.swapperDisabled)
                : cn(s.swapper)
    }
         onClick={() => {
             if (!props.isDisable) props.onClick()
         }}
    ><FontAwesomeIcon icon={faArrowRightArrowLeft} className={s.icon}/>
    </div>
    )
}

type PropsType = {
    isDisable: boolean
    onClick: () => void
}