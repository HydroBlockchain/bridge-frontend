import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightArrowLeft} from "@fortawesome/free-solid-svg-icons";
import s from './Swapper.module.scss'
import cn from "classnames";
import {isLightTheme} from "../../../common/common";
import {useSelector} from 'react-redux'
import {AppStoreType} from '../../../redux/store'
import {AppStateType} from '../../../redux/appReducer'

export const Swapper  = (props: PropsType) => {
    const { isSwapperDisabled } = useSelector<AppStoreType, AppStateType>(state => state.app)

    return (
    <div className={
        isLightTheme
            ? props.isDisable || isSwapperDisabled
                ? cn(s.swapper, s.swapperDisabled, s.lightTheme)
                : cn(s.swapper, s.lightTheme)
            : props.isDisable || isSwapperDisabled
                ? cn(s.swapper, s.swapperDisabled)
                : cn(s.swapper)
    }
         onClick={() => {
             if (!props.isDisable && !isSwapperDisabled ) props.onClick()
         }}
    >
        <FontAwesomeIcon icon={faArrowRightArrowLeft} className={s.icon}/>
    </div>
    )
}

type PropsType = {
    isDisable: boolean
    onClick: () => void
}