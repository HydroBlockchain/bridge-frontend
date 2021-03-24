import React, { Component } from 'react'
import Identicon from 'identicon.js';

class Navbar extends Component {

  render() {
    
    let network = '';

    if(this.props.networkId === 4){
      network = 'Rinkeby'
    }
    else if(this.props.networkId === 97){
      network = 'BSC'
    }

    else if(network !== 0) network = 'Wrong'

    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <span className="ml-2">
          Hydro Cross Chain: {network} Network
        </span>
        
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              <small id="account">{this.props.account.slice(0,6).concat('...').concat(this.props.account.slice(12,18)) }</small>
            </small>

            { this.props.account
              ? <img
                className="identicon ml-2"
                width='20'
                height='20'
                src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                alt=""
              />
              : <span></span>
            }

          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
