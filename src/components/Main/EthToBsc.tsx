import React, {ChangeEvent, Component, FormEvent, MouseEventHandler, MouseEvent} from 'react';
import Modal from 'react-modal';
import hydroDrop from '../../assets/images/hydro-drop.png';

Modal.setAppElement('#root');

class EthToBsc extends Component<PropsType> {
    state = {
        output: '0',
        modal: false,
        addedFund: '0',
        hydroAddress: "0xa8377d8A0ee92120095bC7ae2d8A8E1973CcEa95",
        swapAmount: ''
    }
    // componentDidMount = async () => {
    //     alert('Tip: You can switch between BSC Network and Ethereum Network through Metamask.')

    // }

    handleInputAmount = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            addedFund: e.target.value
        })
    }

    addFund = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        this.props.approveFunds(this.props.swapAddress, this.state.swapAmount);

    }

    handleSwapAmount = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            swapAmount: e.target.value

        })
    }

    swap = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        this.props.swapHydro(Number(this.state.swapAmount));
    }

    max = () => {
        //<label className="max" onClick={this.max}>MAX</label>
        this.setState({swapAmount: this.props.allowed}, () => console.log(this.state.swapAmount, "swap")
        )
    }


    openModal = () => {
        this.setState({
            modal: true
        })
    }

    render() {

        let disable = this.props.swapping;
        let calculated_Received = Number(this.state.output) - this.props.gasFee;
        let approve_text = 'Approval Required Before Swapping';

        if (Number(this.state.output) < this.props.gasFee) {
            disable = true;
            calculated_Received = 0;
        }

        if (Number(this.props.allowed) > 0) {
            approve_text = 'Approved'
        }


        return (
            <div className="tx-interface">

                <form className="mb-3" onSubmit={e => this.swap}>
                    <h3>{this.props.text}</h3>
                    <p className='success'>{this.props.loading_text}</p>
                    <div>
                        <label className="float-left">Swap</label>
                        <span className="float-right text-muted">
            Bal: {this.props.allowedHydro}
          </span>
                    </div>
                    <div className="input-group mb-4">
                        <input
                            type="number"
                            min="0" max={this.props.allowedHydro} step="0.00000000000000001"
                            onChange={(event) => {
                                const amount = event.target.value.toString()
                                this.setState({
                                    output: amount,
                                    swapAmount: amount
                                })

                            }}
                            // ref={(input) => {
                            //     this.input = input
                            // }}
                            className="form-control form-control-lg"
                            placeholder="0"
                        />
                        <div className="input-group-append">
                            <div className="input-group-text">
                                <img src={hydroDrop} height='25' alt="hydro-drop"/>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="gasfee">Hydro Fee:{this.props.gasFee}</label>

                    </div>

                    <div className="allowed">

                        <label className="float-right">{approve_text}</label>
                    </div>

                    <div className="mt-5">
                        <label className="float-left">You get</label>
                    </div>
                    <div className="input-group mb-2">
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="0"
                            value={calculated_Received}
                            disabled
                        />
                        <div className="input-group-append">
                            <div className="input-group-text">
                                <img src={hydroDrop} height='25' alt="hydro-drop"/>
                            </div>
                        </div>
                    </div>
                    {Number(this.props.allowed) > 0 ? <button type="submit" disabled={disable}
                                                              className="btn btn-block btn-lg swap-btn">Swap</button> :
                        <button onClick={e => this.addFund(e)} className="btn btn-block btn-lg swap-btn">Approve
                            Tokens</button>}

                </form>
                <p className="footer">Tip: You can switch between BSC Network and Ethereum Network through Metamask.</p>
            </div>
        );
    }
}

export default EthToBsc;

type PropsType = {
    swapAddress: string
    allowedHydro: string
    approveFunds: (value1: string, value2: string) => void
    swapHydro: (value: number) => void
    allowed: string
    loading_text: string
    text: string
    swapping: boolean
    gasFee: number
    networkId: number
    ethToBscSwap?: () => void
}