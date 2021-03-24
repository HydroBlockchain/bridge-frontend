import React, { Component } from 'react'
import EthToBsc from './eth_bsc';
import BscToEth from './bsc_eth';


class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentForm: 'eth to bsc'
    }
  }

 
  

  render() {

    let content = <EthToBsc
    swapAddress = {this.props.swapAddress}
    allowedHydro={this.props.allowedHydro}
    approveFunds={this.props.approveFunds}
    swapHydro={this.props.swapHydro}
    ethToBscSwap ={this.props.ethToBscSwap}
    allowed={this.props.allowed}
    loading_text={this.props.loading_text}
    text={this.props.text}
    swapping={this.props.swapping}

  />
    
    return (
      <div id="content" className="mt-5 swap-form">

        <div className="card mb-4" >

          <div className="card-body main-form">

            {content}

          </div>

        </div>
        
      </div>
    );
  }
}

export default Main;
