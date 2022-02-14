import React, {Component} from "react";
import Identicon from "identicon.js";
import bridgeLogo from '../images/hydrobridge.svg';

class Navbar extends Component<PropsType> {

    render() {
        let network = "";

        if (this.props.networkId === 1) {
            network = "Ethereum Main";
        } else if (this.props.networkId === 56) {
            network = "BSC Main";
        } else if (this.props.networkId === 137) {
            network = "Polygon Main";
        } else if (this.props.networkId === 1285) {
            network = "Moonriver Main";
        } else if (this.props.networkId === 52) {
            network = "CoinEx Chain Main";
        } else if (network !== '') network = "Wrong";

        return (
            <nav className="navbar navbar-dark fixed-top flex-md-nowrap p-0 shadow">
        <span className="ml-2">
        <img className='bridge-logo' src={bridgeLogo} alt='bridge'/>
        </span>
                <div className="network-status">{network} Network</div>

                <ul className="navbar-nav px-3">
                    <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                        <small className="text-secondary">
                            <small id="account">
                                {this.props.account
                                    .slice(0, 5)
                                    .concat("...")
                                    .concat(this.props.account.slice(37, 42))}
                            </small>
                        </small>

                        {this.props.account ? (
                            <img
                                className="identicon ml-2"
                                width="20"
                                height="20"
                                src={`data:image/png;base64,${new Identicon(
                                    this.props.account,
                                    30
                                ).toString()}`}
                                alt=""
                            />
                        ) : (
                            <span></span>
                        )}
                    </li>
                </ul>
            </nav>
        );
    }
}

export default Navbar;

type PropsType = {
    account: string
    networkId: number
}