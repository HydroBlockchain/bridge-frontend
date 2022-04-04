import React from 'react'
import s from './CommonModal.module.scss'
import {isLightTheme} from '../common'
import cn from 'classnames'

export const CommonModal: React.FC<PropsType> = (props) => {
    return <div className={s.modalBackground}>
        <div className={isLightTheme ? cn(s.swapModal, s.swapModalLight) : s.swapModal}>
            {props.children}
        </div>
    </div>
}

type PropsType = {

}
