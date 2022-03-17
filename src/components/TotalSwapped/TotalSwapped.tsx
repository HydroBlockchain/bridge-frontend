import React from 'react'
import s from './TotalSwapped.module.scss'
import {isLightTheme} from '../../common/common'

export const TotalSwapped = () => {
    return <div className={isLightTheme ? `${s.totalSwapped} ${s.lightTheme}` : `${s.totalSwapped}`}>
        Total Hydro Swapped: 0
    </div>
}