import React, {useEffect} from 'react'
import s from './TotalSwapped.module.scss'
import {isLightTheme} from '../../common/common'
import {getTotalHydroSwappedThunk, TotalHydroSwappedType} from '../../redux/bridgeReducer'
import {useDispatch, useSelector} from 'react-redux'
import {AppStoreType} from '../../redux/store'

export const TotalSwapped = () => {
    const dispatch = useDispatch()
    const totalHydroSwapped = useSelector<AppStoreType, TotalHydroSwappedType>(state => state.bridge.totalHydroSwapped)
    const isTestNets = useSelector<AppStoreType, boolean>(state => state.app.isTestNets)

    useEffect(() => {
        dispatch(getTotalHydroSwappedThunk())
    }, [])

    return <div className={isLightTheme ? `${s.totalSwapped} ${s.lightTheme}` : `${s.totalSwapped}`}>
        Total Hydro
        Swapped: {isTestNets ? totalHydroSwapped.totalValueSwappedOnTestnet : totalHydroSwapped.totalValueSwappedOnMainnet}
    </div>
}