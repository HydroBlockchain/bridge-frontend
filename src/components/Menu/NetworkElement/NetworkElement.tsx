import React, {useEffect} from "react";
import s from "./NetworkElement.module.scss";
import Select, {PropsValue, StylesConfig} from "react-select";
import {useDispatch} from "react-redux";
import {changeNetworkThunk} from "../../../redux/bridge-reducer";
import {isTestChains, chainIDs, chainsNames, isLightTheme} from "../../../common/common";
import {elementColor, elementColorLight} from "../../../common/styles/variables";

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

const selectByArrowColor = '#203147'
const elementColorFinal = isLightTheme ? elementColorLight : elementColor

const selectStyles: StylesConfig = {
    control: base => ({
        ...base,
        backgroundColor: elementColorFinal,
        border: 0,
        boxShadow: 'none'
    }),
    singleValue: base => ({
        ...base,
        color: 'white'
    }),
    menuList: base => ({
        ...base,
        backgroundColor: elementColorFinal,
    }),
    option: (base, {isSelected, isFocused}) => ({
        ...base,
        backgroundColor: isSelected ? selectByArrowColor : isFocused ? selectByArrowColor : elementColorFinal,
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
        if (props.isMain && props.state !== chainIDs.notSelected) dispatch(changeNetworkThunk(props.state))
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
        <div className={isLightTheme ? `${s.item} ${s.lightTheme}` : `${s.item}` }>
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
