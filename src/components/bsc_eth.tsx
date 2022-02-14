import React, {ChangeEvent, Component, MouseEventHandler} from 'react';
import Modal from 'react-modal';
import hydroDrop from '../images/hydro-drop.png';

Modal.setAppElement('#root');

class BscToEth extends Component<PropsType> {
    state = {
        output: '0',
        modal: false,
        addedFund: '0',
        hydroAddress: "0x5B387f4886F043f603f7d0cb55DBd727D6649C73",
        swapAmount: null
    }


    //   componentDidMount = async () => {
    //     alert('kindly ensure you are on bsc test network')


    // }

    handleInputAmount = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            addedFund: e.target.value
        }, () => console.log(this.state.addedFund, "swap"))
    }

    addFund = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        console.log(this.state.swapAmount);
        this.props.addBep(this.state.hydroAddress, this.state.swapAmount);

        console.log(this.state.hydroAddress);

    }

    handleSwapAmount = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            swapAmount: e.target.value

        }, () => console.log(this.state.swapAmount))
    }

    swap = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        // this.props.bscToEthSwap(this.state.swapAmount);
        console.log(this.state.swapAmount, "swap")
    }


    openModal = () => {
        this.setState({
            modal: true
        })
    }

    render() {
        return (
            <div className="tx-interface">

                <button className="open-add-fund"
                        onClick={e => this.addFund}>Approve balance
                </button>
                <form className="mb-3" onSubmit={e => this.swap}>
                    <h3>Bep20 to Erc20</h3>
                    <div>
                        <label className="float-left">Value</label>
                        <div className="float-right text-muted">
                            <span>Bal: {this.props.balance}</span>
                        </div>
                    </div>
                    <div className="input-group mb-4">
                        <input
                            type="text"
                            onChange={(event) => {
                                const amount = event.target.value.toString()
                                this.setState({
                                    // output: amount * 1,
                                    output: amount,
                                    swapAmount: amount
                                })

                            }}
                            // ref={(input) => {
                            //     this.input = input
                            // }}
                            className="form-control form-control-lg"
                            placeholder="0"
                            required/>
                        <div className="input-group-append">
                            <div className="input-group-text">
                                <img src={hydroDrop} height='25' alt="hydro-drop"/>
                            </div>
                        </div>

                    </div>

                    <div className="allowed">
                        <label className="float-right">Allowed for
                            swap: {this.props.bep_allowed.slice(0, 5)} Hydro</label>
                    </div>

                    <div className="mt-3">
                        <label className="float-left">You get</label>

                    </div>
                    <div className="input-group mb-2">
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="0"
                            value={this.state.output}
                            disabled
                        />
                        <div className="input-group-append">
                            <div className="input-group-text">
                                <img src={hydroDrop} height='25' alt="hydro-drop"/>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-block btn-lg swap-btn">Swap</button>
                </form>
            </div>
        );
    }
}

export default BscToEth;

type PropsType = {
    addBep: (value1: string, value2: string | null) => void
    balance: string
    bep_allowed: number[]
}
