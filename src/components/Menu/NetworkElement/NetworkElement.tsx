import React, {useEffect} from "react";
import s from "./NetworkElement.module.scss";
import Select, {PropsValue, StylesConfig} from "react-select";
import {useDispatch} from "react-redux";
import {changeNetworkThunk} from "../../../redux/bridge-reducer";
import {networkIDs, networkNames} from "../../../common/variables";

const options = [
    {value: networkIDs.mumbaiTest, label: networkNames.mumbaiTest},
    {value: networkIDs.rinkebyTest, label: networkNames.rinkebyTest},
    {value: networkIDs.coinExTest, label: networkNames.coinExTest},
    {value: networkIDs.eth, label: networkNames.eth},
    {value: networkIDs.bsc, label: networkNames.bsc},
]

const elementColor = '#313647'
const selectByArrowColor = '#203147'

const selectStyles: StylesConfig = {
    control: base => ({
        ...base,
        backgroundColor: elementColor,
        border: 0,
        boxShadow: 'none'
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
        //change network in Metamask
        if (props.isMain && props.state !== networkIDs.notSelected) dispatch(changeNetworkThunk(props.state))
    },[props.state])

    const onChange = (option: PropsValue<Option | Option[]>) => {
        props.setState((option as Option).value);
    }

    const getValue = () => {
        if (options) {
            return options.find((option) => option.value === props.state);
        } else {
            return 0 as any // todo: fix any
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
}
