import React from "react";
import Identicon from "identicon.js";
import bridgeLogo from '../assets/images/hydrobridge.svg';
import {useSelector} from "react-redux";
import {AppRootStateType} from "../redux/store";
import {InitialStateType} from "../redux/bridge-reducer";

const statusNetwork = (networkID: number) => {
    switch (networkID) {
        case 1:
            return 'Ethereum Main'
        case 56:
            return 'BSC Main';
        case 137:
            return 'Polygon Main';
        case 1285:
            return 'Moonriver Main';
        case 52:
            return 'CoinEx Chain Main';
        default:
            return 'Please click Connect Wallet and unlock you Metamask'
    }
}

export const Navbar = () => {
    const {networkID, account} = useSelector<AppRootStateType, InitialStateType>(state => state.bridge)

    return (
        <nav className="navbar navbar-dark fixed-top flex-md-nowrap p-0 shadow">
        <span className="ml-2">
        <img className='bridge-logo' src={bridgeLogo} alt='bridge'/>
        </span>
            <div className="network-status">{statusNetwork(networkID)}</div>

            <ul className="navbar-nav px-3">
                <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                    <small className="text-secondary">
                        <small id="account">
                            {account
                                .slice(0, 5)
                                .concat("...")
                                .concat(account.slice(37, 42))}
                        </small>
                    </small>

                    {account ? (<img
                        className="identicon ml-2"
                        width="20"
                        height="20"
                        src={`data:image/png;base64,${new Identicon(account, 30).toString()}`}
                        alt=""
                    />) : (<span> </span>)}
                </li>
            </ul>
        </nav>
    )
}