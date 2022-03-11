import React from "react";
import Identicon from "identicon.js";
import bridgeLogo from '../../assets/images/hydrobridge.svg';
import bridgeLogoLight from '../../assets/images/hydrobridge_light.svg';
import {useSelector} from "react-redux";
import {AppStoreType} from "../../redux/store";
import {InitialStateType} from "../../redux/bridgeReducer";
import s from './Navbar.module.scss'
import {chainIDs, chainsNames, isLightTheme} from "../../common/common";
import cn from "classnames";

const statusNetwork = (chainID: number) => {
    switch (chainID) {
        case chainIDs.notSelected: {
            return chainsNames.notSelected
        }
        case chainIDs.eth:
            return chainsNames.eth
        case chainIDs.bsc:
            return chainsNames.bsc
        case chainIDs.mumbaiTest:
            return chainsNames.mumbaiTest
        case chainIDs.rinkebyTest:
            return chainsNames.rinkebyTest
        case chainIDs.coinExTest:
            return chainsNames.coinExTest
        default:
            return 'This network is not supported yet.'
    }
}

export const Navbar = () => {
    const {chainID, account} = useSelector<AppStoreType, InitialStateType>(state => state.bridge)

    return (
        <div className={s.navbar}>
            <img className='bridge-logo' src={isLightTheme ? bridgeLogoLight : bridgeLogo} alt='bridge'/>
            <div className={
                chainID === 0
                    ? isLightTheme
                        ? cn(s.networkStatus, s.lightThemeAccent)
                        : cn(s.networkStatus, s.accent)
                    : isLightTheme
                        ? cn(s.networkStatus, s.lightTheme)
                        : s.networkStatus
            }>{statusNetwork(chainID)}
            </div>
            <div className={isLightTheme ? cn(s.account, s.lightTheme) : s.account}>
                {account
                    .slice(0, 5)
                    .concat("...")
                    .concat(account.slice(37, 42))}
                {account ? (<img
                    className="identicon ml-2"
                    width="20"
                    height="20"
                    src={`data:image/png;base64,${new Identicon(account, 30).toString()}`}
                    alt=""
                />) : (<span> </span>)}
            </div>
        </div>
    )
}