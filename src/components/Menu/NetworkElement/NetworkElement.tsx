import React, {useEffect} from 'react'
import s from './NetworkElement.module.scss'
import Select, {PropsValue, StylesConfig} from 'react-select'
import {useDispatch, useSelector} from 'react-redux'
import {changeNetworkThunk, InitialStateType} from '../../../redux/bridgeReducer'
import {isTestChains, chainIDs, chainsNames, isLightTheme} from '../../../common/common'
import {
    backgroundColor,
    backgroundColorLight,
    menuColor,
    menuColorLight,
    swapperAndSwapButtonColor, swapperAndSwapButtonColorLight, textColor, textColorDisabled, textColorLight
} from '../../../common/styles/variables'
import cn from 'classnames'
import {AppStoreType} from '../../../redux/store'
import {RequestStatusType} from '../../../redux/appReducer'
import binanceBNB from '../../../assets/images/chainSymbols/binanceBNB.png'

const options =
    isTestChains
        ? [
            {value: chainIDs.mumbaiTest, label: chainsNames.mumbaiTest},
            {value: chainIDs.rinkebyTest, label: chainsNames.rinkebyTest},
            {value: chainIDs.coinExTest, label: chainsNames.coinExTest},
        ]
        : [
            {value: chainIDs.eth, label: chainsNames.eth},
            {value: chainIDs.bsc, label: chainsNames.bsc},
        ]

const selectByArrowColor = isLightTheme ? menuColorLight : menuColor
const backgroundColorFinal = isLightTheme ? backgroundColorLight : backgroundColor

export const NetworkElement = (props: PropsType) => {
    const {
        chainID
    } = useSelector<AppStoreType, InitialStateType>(state => state.bridge)
    const appStatus = useSelector<AppStoreType, RequestStatusType>(state => state.app.status)

    const selectStyles: StylesConfig = {
        control: base => ({
            ...base,
            backgroundColor: backgroundColorFinal,
            border: 0,
            boxShadow: 'none',
            color: 'red'
        }),
        singleValue: base => ({
            ...base,
            color: appStatus === 'loading'
                ? textColorDisabled
                : isLightTheme ? textColorLight : textColor
        }),
        menuList: base => ({
            ...base,
            backgroundColor: backgroundColorFinal,
        }),
        option: (base, {isSelected, isFocused}) => ({
            ...base,
            backgroundColor: isSelected
                ? selectByArrowColor
                : isFocused
                    ? selectByArrowColor
                    : backgroundColorFinal,
            color: isLightTheme ? textColorLight : textColor,
            ':hover': {
                ...base[':hover'],
                backgroundColor: isLightTheme ? swapperAndSwapButtonColorLight : swapperAndSwapButtonColor,
                color: 'white'
            },
        }),
        dropdownIndicator: base => ({
            ...base,
            color: (chainID === chainIDs.notSelected || appStatus === 'loading')
                ? textColorDisabled
                : isLightTheme ? textColorLight : textColor
        }),
        placeholder: base => ({
            ...base,
            color: (chainID === chainIDs.notSelected || appStatus === 'loading')
                ? textColorDisabled
                : isLightTheme ? textColorLight : textColor
        })
    }

    const dispatch = useDispatch()
    useEffect(() => {
        //change network in Metamask
        if (props.isMain && props.state !== chainIDs.notSelected) dispatch(changeNetworkThunk(props.state))
    }, [props.state])

    const onChange = (option: PropsValue<Option | Option[]>) => {
        props.setState((option as Option).value)
    }

    const getValue = () => {
        if (options) {
            return options.find((option) => option.value === props.state)
        } else {
            return 0 as any // todo: fix any
        }
    }


    return <div className={s.networkElement}>
        <span>{props.text}</span>
        <div className={isLightTheme ? `${s.item} ${s.lightTheme}` : `${s.item}`}>
            <div className={isLightTheme ? cn(s.circle, s.lightTheme) : cn(s.circle)}>
                {
                    props.chainPicture !== '' && <img src={props.chainPicture} alt="chainSymbol" className={s.chainSymbol}/>
                }
            </div>
            <Select
                options={options}
                styles={selectStyles}
                name={'select'}
                onChange={onChange}
                placeholder={'Select Network'}
                value={getValue()}
                isDisabled={props.isDisabled}
                components={{
                    IndicatorSeparator: () => null
                }}
            />
        </div>
    </div>
}

type Option = {
    label: string;
    value: number;
}
type PropsType = {
    text: string
    isMain?: boolean
    state: number
    setState: (value: number) => void
    isDisabled: boolean
    chainPicture: string
}
