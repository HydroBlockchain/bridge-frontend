import React from 'react'
import s from './Log.module.scss'
import {useSelector} from 'react-redux'
import {AppStoreType} from '../../redux/store'
import {LogType} from '../../redux/bridgeReducer'
import {isLightTheme} from '../../common/common'

export const Log = () => {
    const log = useSelector<AppStoreType, Array<LogType>>(state => state.bridge.log)
    return <div className={isLightTheme ? `${s.log} ${s.lightTheme}` : `${s.log}`}>
        {log.length > 0 && log.map(e => {
            return <div key={e.id} className={e.messageType === 'success' ? s.green : s.red}>{e.message}</div>
        })}
    </div>
}