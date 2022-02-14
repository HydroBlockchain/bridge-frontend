import React from "react";
import s from "./NetworkElement.module.scss";
import Select, {StylesConfig} from "react-select";

const options = [
    { value: 'Ethereum', label: 'Ethereum' },
    { value: 'Binance Smart Chain', label: 'Binance Smart Chain' },
    { value: 'Polygon', label: 'Polygon' },
    { value: 'Coinex Smart Chain', label: 'Coinex Smart Chain' }
]

const selectStyles: StylesConfig = {
    control: (styles) => ({
        ...styles,
        backgroundColor: '#313647',
        "&:selected": {
            color: 'white'
        }
    }),
    menuList: (base) => ({
        ...base,
        backgroundColor: '#313647',
    }),
    option: (styles) => ({
        ...styles,
        "&:hover": {
            backgroundColor: '#4E5260'
        }
    })

}

export const NetworkElement = (props: PropsType) => {
    return <div className={s.networkElement}>
        <span>{props.text}</span>
        <div className={s.item}>
            <div className={s.tempCircle}/>
            {/*<div>Select Network</div>*/}
            <Select
                options={options}
                styles={selectStyles}
                components={{IndicatorSeparator: () => null}}
                placeholder="Select Network"
            />
        </div>
    </div>
}

type PropsType = {
    text: string
}