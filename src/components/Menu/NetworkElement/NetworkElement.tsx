import React, {useEffect, useState} from "react";
import s from "./NetworkElement.module.scss";
import Select, {PropsValue, StylesConfig} from "react-select";
import {useDispatch} from "react-redux";
import {changeNetworkThunk} from "../../../redux/bridge-reducer";

const options = [
    {value: 'eth', label: 'Ethereum'},
    {value: 'bsc', label: 'Binance Smart Chain'},
    {value: 'polygon', label: 'Polygon'},
    {value: 'csc', label: 'Coinex Smart Chain'}
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
    useEffect(() => {
        if (props.isMain && props.state !== '') dispatch(changeNetworkThunk(props.state))
    },[props.state])

    const onChange = (option: PropsValue<Option | Option[]>) => {
        props.setState((option as Option).value);
    }

    const getValue = () => {
        if (options) {
            return options.find((option) => option.value === props.state);
        } else {
            return '' as any // todo: fix any
        }
    };

    return <div className={s.networkElement}>
        <span>{props.text}</span>
        <div className={s.item}>
            <div className={s.tempCircle}/>
            <Select
                options={options}
                styles={selectStyles}
                name={"select"}
                onChange={onChange}
                placeholder={"Select Network"}
                value={getValue()}
                isDisabled={props.isDisabled}
            />
        </div>
    </div>
}

type Option = {
    label: string;
    value: string;
}
type PropsType = {
    text: string
    isMain?: boolean
    state: string
    setState: (value: string) => void
    isDisabled: boolean
}
