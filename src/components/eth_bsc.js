import React, { Component } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');
class EthToBsc extends Component {
  state = {
      output: '0',
      modal: false,
      addedFund: '0',
      hydroAddress: "0xa8377d8A0ee92120095bC7ae2d8A8E1973CcEa95",
      swapAmount: null
    }
    componentDidMount = async () => {
        alert('Tip: You can switch between BSC Network and Ethereum Network through Metamask.')
       
    }

    handleInputAmount = (e)=> {
      this.setState({
        addedFund: e.target.value
      })
    }

    addFund = (e)=> {
      e.preventDefault();
      this.props.approveFunds(this.props.swapAddress, this.state.swapAmount);      

    }

    handleSwapAmount = (e)=> {
      this.setState({
        swapAmount: e.target.value

      })
    }

    swap = (e)=> {
      e.preventDefault();
      this.props.swapHydro(this.state.swapAmount);
    }

    max = ()=>{
      //<label className="max" onClick={this.max}>MAX</label>
      this.setState({swapAmount:this.props.allowed},()=>console.log(this.state.swapAmount, "swap")
      )
    }

  

  openModal =()=> {
    this.setState({
      modal: true
    })
  }

  render() {

    let disable = this.props.swapping;
    let approve_text = 'Approval Required Before Swapping';

    if (this.props.allowed > 0){  
      approve_text = 'Approved'
    }


    return (
    <div className="tx-interface">
     
      <form className="mb-3" onSubmit={this.swap} >
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
              const amount = this.input.value.toString()
              this.setState({
                output: amount,
                swapAmount: amount
              })

            }}
            ref={(input) => { this.input = input }}
            className="form-control form-control-lg"
            placeholder="0"
            required />
          <div className="input-group-append">
            <div className="input-group-text">
              <img src= "https://raw.githubusercontent.com/HydroBlockchain/projecthydro.org-2021/master/assets/images/hydrologo.png" height='25' alt=""/>
            </div>
          </div>
        </div>
        
        <div>
       
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
            value={this.state.output}
            disabled
          />
          <div className="input-group-append">
            <div className="input-group-text">
              <img src="https://raw.githubusercontent.com/HydroBlockchain/projecthydro.org-2021/master/assets/images/hydrologo.png" height='25' alt=""/> 
            </div>
          </div>
        </div>
        
        {this.props.allowed > 0 ? <button type="submit" disabled={disable} className="btn btn-block btn-lg swap-btn">Swap</button>:<button onClick={this.addFund} className="btn btn-block btn-lg swap-btn">Approve Tokens</button>}

      </form>
      <p className="footer">Tip: You can switch between BSC Network and Ethereum Network through Metamask.</p>
    </div>
    );
  }
}

export default EthToBsc;
