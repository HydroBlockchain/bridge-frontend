import React from "react";
import s from "./NetworkElement.module.scss";
import Select, {StylesConfig} from "react-select";
import {useDispatch} from "react-redux";
import {changeNetwork} from "../../../redux/bridge-reducer";

const options = [
    {value: 'Ethereum', label: 'Ethereum'},
    {value: 'bsc', label: 'Binance Smart Chain'},
    {value: 'polygon', label: 'Polygon'},
    {value: 'Coinex Smart Chain', label: 'Coinex Smart Chain'}
]

const elementColor = '#313647'
const selectByArrowColor = '#203147'

const selectStyles: StylesConfig = {
    control: base => ({
        ...base,
        backgroundColor: elementColor,
    }),
    singleValue: base => ({
        ...base,
        color: 'white'
    }),
    menuList: base => ({
        ...base,
        backgroundColor: elementColor,
    }),
    option: (base, {isSelected, isFocused}) => ({
        ...base,
        backgroundColor: isSelected ? selectByArrowColor : isFocused ? selectByArrowColor : elementColor,
        ":hover": {
            ...base[':hover'],
            backgroundColor: '#4E5260'
        },
    }),
}

export const NetworkElement = (props: PropsType) => {
    const dispatch = useDispatch()

    // todo: fix any
    const selectNetworkHandler = (e: any) => {
        dispatch(changeNetwork(e.value))
    }


    return <div className={s.networkElement}>
        <span>{props.text}</span>
        <div className={s.item}>
            <div className={s.tempCircle}/>
            <Select
                options={options}
                styles={selectStyles}
                components={{IndicatorSeparator: () => null}}
                placeholder="Select Network"
                onChange={e => selectNetworkHandler(e)}
            />
        </div>
    </div>
}

type PropsType = {
    text: string
}