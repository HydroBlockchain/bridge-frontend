import React, {Component} from "react";
import EthToBsc from "./EthToBsc";
import BscToEth from "../BscToEth";
import {Menu} from "./Menu/Menu";

class Main extends Component<PropsType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            currentForm: "eth to bsc",
        };
    }

    render() {
        let content = (
            <EthToBsc
                swapAddress={this.props.swapAddress}
                allowedHydro={this.props.allowedHydro}
                approveFunds={this.props.approveFunds}
                swapHydro={this.props.swapHydro}
                ethToBscSwap={this.props.ethToBscSwap}
                allowed={this.props.allowed}
                loading_text={this.props.loading_text}
                text={this.props.text}
                swapping={this.props.swapping}
                gasFee={this.props.gasFee}
                networkId={this.props.networkId}
            />
        );

        return (
            <div>
                <div className="head">
                    <p>
                        Total Hydro Swapped:{" "}
                        {parseFloat(this.props.totalSwapped).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                        })}
                    </p>
                </div>

                <div id="content" className="mt-5 swap-form">
                    <div className="card mb-4">
                        <Menu className={'card-body main-form'}/>
                    </div>
                   {/* <div className="card mb-4">
                        <div className="card-body main-form">{content}</div>
                    </div>*/}
                </div>
            </div>
        );
    }
}

export default Main;

type PropsType = {
    swapAddress: string
    allowedHydro: string
    approveFunds: () => void
    swapHydro: (amount: number) => Promise<void>
    allowed: string
    loading_text: string
    text: string
    swapping: boolean
    gasFee: number
    networkId: number
    totalSwapped: string
    eth_allowed: number
    bepBalance: string
    bscToEthSwap: (amount: string) => Promise<void>
    addBep: (address: string, amount: string) => Promise<void>
    ethToBscSwap?: () => void
}
