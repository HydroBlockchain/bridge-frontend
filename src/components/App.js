import React, { Component } from 'react'
//import getWeb3 from '../getWeb3';
import Navbar from './Navbar';
import Web3 from 'web3';
import Main from './Main';
import HydroAbi from '../abis/hydro.json';
import EthToBscAbi from '../abis/ethToBsc.json';
import BscToEthAbi from '../abis/bscToEth.json';
import BepHydro from '../abis/bephydro.json';
import './App.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




class App extends Component {

  state = {
    account: '',
    hydroBalance: '0',
    bepBalance: '0',
    allowedHydro: '0',
    allowedBep: '0',
    loading: true,
    hydroInstance: null,
    web3: null,
    hydroAddress: null,
    bepHydroAddress: null,
    ethToBscInstance: null,
    BscToEthInstance: null,
    bepHydroInstance: null,
    currentForm: '',

    swapAddress:'',
    swapInstance:[],
    allowed:0,
    eth_allowed:0,
    blockNumber:0,
    networkID:0,
    text:'',
    wrongNetwork:'',
    API_LINK:'',
    loading_text:'',
    txHash:'',
    tx_Link:'',
    prev_hash:0,
    swapping:false,
    
   
  }

  componentDidMount = async () => {
    try {
      //this.api()
      // Get network provider and web3 instance.
      let ethereum= window.ethereum;
      let web3=window.web3;
    

      if(typeof ethereum !=='undefined'){
       await ethereum.enable();
       web3 = new Web3(ethereum); 
       this.setState({web3})      
      }

      else if (typeof web3 !== 'undefined'){
      console.log('Web3 Detected!')
      window.web3 = new Web3(web3.currentProvider);
      this.setState({web3})
      }
   
      else{console.log('No Web3 Detected')
      window.web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/v3/72e114745bbf4822b987489c119f858b'));  
      this.setState({web3})
    }  
      const networkID = await web3.eth.net.getId();
      this.setState({networkID:networkID})
      
      if(this.state.networkID === 97){
        this.load_Hydro_Bsc(this.state.web3)
      }

      else if(this.state.networkID === 4){
        this.load_Hydro_Eth(this.state.web3)
      }

      else{
        const currrentNetwork = await this.state.web3.eth.net.getNetworkType();
        this.setState({wrongNetwork:'You are on ' + currrentNetwork + ' Network, Please switch to Rinkeby or BSC Network'})
      }


      window.ethereum.on('accountsChanged', function (accounts) {
        window.location.reload();
         })
       
      window.ethereum.on('chainChanged', function (netId) {
        window.location.reload();
         })
    
    } catch (error) {
        this.setState({
        loading: false
      })
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  
  };

  api(values){
    
    let address = values.returnValues.depositor
    let amount = values.returnValues.outputAmount
    console.log(values)
    
    const requestOptions = {
      method:'POST',
      headers: { 'Content-Type': 'application/json',
        'Authorization': process.env.REACT_APP_API_KEY,
        'Origin':'^'
      },

      body: JSON.stringify({ 
        address: address, 
        amount:amount
        })
  };

  if(this.state.prev_hash === 1){
  fetch(this.state.API_LINK, requestOptions)
        .then( async response=>{
          if(response.status === 200){
          const tx_hash = await response.json();
          this.setState({txHash:JSON.parse(tx_hash.receipt)},()=>console.log())
          toast(<a href={this.state.tx_Link + this.state.txHash.transactionHash} target="blank">Swap Success!</a>);
          this.setState({loading_text:'Success, Your Hydro is on the way.',swapping:false,prev_hash:0})
          console.log(response)
          }
         else{

        //this.setState({loading_text:'Success, Your Hydro is on the way.',prev_hash:0})
        console.log('error', this.state.prev_hash)
        setTimeout(()=>this.api(values),10000);

       }
        })
        /*.catch((error) => {
          //console.log('catch',error)
          //setTimeout(()=>this.api(values),1000);
          this.setState({loading_text:'Success, Your Hydro is on the way.',prev_hash:0})

        });*/
      
    }
  }



  async load_Hydro_Bsc(web3){
    
    const currrentNetwork = await this.state.web3.eth.net.getNetworkType();
    const blockNumber = await this.state.web3.eth.getBlockNumber();
    this.setState({
      text:'BEP-20 to ERC-20',
      API_LINK:'https://hydroswap.herokuapp.com/api/send_eth/',
      tx_Link:'https://rinkeby.etherscan.io/tx/',
      loading: false
    })

    const accounts = await this.state.web3.eth.getAccounts();
    const account = accounts[0]
    this.setState({
      account
    })

    const hydroAddress = "0x5B387f4886F043f603f7d0cb55DBd727D6649C73" ;
    this.setState({
      hydroAddress
    })

    const hydroInstance = new web3.eth.Contract(BepHydro, hydroAddress );
    this.setState({
      hydroInstance
    })

    this.state.hydroInstance.events.allEvents({filter:{owner:this.state.account},fromBlock:'latest', toBlock:'latest'})
        .on('data',(log)=>{
          this.displayApprovedFund();
        })

    const swapContract = "0x662D7C30F16a30214f20257bbDd8b3997Ec0204d";
    const swapInstance = new web3.eth.Contract(BscToEthAbi, swapContract);

      this.setState({
        swapAddress:swapContract,
        swapInstance
      })

    
    this.displayApprovedFund();

  }

  
  async load_Hydro_Eth(web3){
    
    const currrentNetwork = await this.state.web3.eth.net.getNetworkType();
    const blockNumber = await this.state.web3.eth.getBlockNumber();
    this.setState({
      text:'ERC-20 to BEP-20',
      API_LINK:'https://hydroswap.herokuapp.com/api/send_bsc/',
      tx_Link:'https://testnet.bscscan.com/tx/',
      loading: false
    })

    const accounts = await this.state.web3.eth.getAccounts();
    const account = accounts[0]
    this.setState({
      account
    })

    const hydroAddress = "0xa8377d8A0ee92120095bC7ae2d8A8E1973CcEa95" ;
    this.setState({
      hydroAddress
    })

    const hydroInstance = new web3.eth.Contract(HydroAbi, hydroAddress );
    this.setState({
      hydroInstance
    })

    this.state.hydroInstance.events.allEvents({filter:{owner:this.state.account}, toBlock:'latest'})
        .on('data',(log)=>{
          this.displayApprovedFund();
        })

    const swapContract = "0xCDEF517c07eB3DF1F0eD4AFCCaC400215Af88959";
    const swapInstance = new web3.eth.Contract(EthToBscAbi, swapContract);

    
      this.setState({
        swapAddress:swapContract,
        swapInstance
      })

    this.displayApprovedFund();

  }

//for erc hydro
  displayApprovedFund= async ()=> {
   const res = await this.state.hydroInstance.methods.balanceOf(this.state.account).call();
   const hydroBalance = this.state.web3.utils.fromWei(res.toString(), 'ether');

   const allowed_swap = await this.state.hydroInstance.methods.allowed(this.state.account, this.state.swapAddress).call();
   this.setState({allowed:this.state.web3.utils.fromWei(allowed_swap.toString(), 'ether')});

   this.setState({hydroBalance})
   
  }



  approveFunds = async ()=> {
   this.setState({loading_text:''})
   await this.state.hydroInstance.methods.approve(this.state.swapAddress, this.state.web3.utils.toWei('1000000000')).send({
      from: this.state.account,   
      })
  }

  swapHydro = async(amount)=> {
    this.setState({loading_text:'Please do not close the browser until you see the successful message.',swapping:true})
    await this.state.swapInstance.methods.swap(this.state.web3.utils.toWei(amount.toString())).send({
      from: this.state.account
    })

    .on('confirmation',(confirmationNumber, receipt)=>{
      if(confirmationNumber === 0){
      this.setState({loading_text:'Swap in progress....Please do not close the browser until you see the successful message.'},()=>console.log())
      }
      if(confirmationNumber === 2){
      //console.log('dsd',confirmationNumber,receipt.events.SwapDeposit.returnValues)
      this.setState({prev_hash:1},()=>this.api(receipt.events.SwapDeposit))
      }
      
  })

  .on('error',(error, receipt)=>{ // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
    this.setState({loading_text:'Transaction error.',
      swapping:false},()=>console.log())
    });
  }



  addBep = async(address, amount)=> {
    console.log(amount)
    let bep_address = '0x662D7C30F16a30214f20257bbDd8b3997Ec0204d';
    await this.state.bepHydroInstance.methods.approve(bep_address, this.state.web3.utils.toWei(amount.toString())).send({
      from: this.state.account
    })

  }


  bscToEthSwap = async(amount)=> {
    console.log(amount)
    await this.state.BscToEthInstance.methods.swap(this.state.web3.utils.toWei(amount.toString())).send({
      from: this.state.account
    })
    

  }

  

  
  render() {
    let content
    if(this.state.loading) {
      if(this.state.networkID === 97 || this.state.networkID === 4){
      content = <p id="loader" className="text-center">Loading...</p>
      }
      else
      content = <p id="network" className="text-center">{this.state.wrongNetwork}</p>
    } else {
      content = <Main
      allowed = {this.state.allowed}
      eth_allowed = {this.state.eth_allowed}
      text = {this.state.text}
      allowedHydro={this.state.hydroBalance}
      bepBalance = {this.state.bepBalance}
      swapAddress = {this.state.swapAddress}
      swapping = {this.state.swapping}

      approveFunds={this.approveFunds}
      swapHydro={this.swapHydro}
      bscToEthSwap={this.bscToEthSwap}
      getCurrentForm={this.getCurrentForm}
      addBep={this.addBep}
      loading_text={this.state.loading_text}/>
      
    }

    return (
      <div>
        <Navbar account={this.state.account} networkId={this.state.networkID}/>
        
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '400px' }}>
              <div className="content mr-auto ml-auto">
              {content}
              <ToastContainer
              position="bottom-left"
              autoClose={50000}
              hideProgressBar={false}
              newestOnTop={false}
              rtl={false}
              pauseOnVisibilityChange
              draggable
              pauseOnHover />
              </div>
            </main>
          </div>
        </div>
        <div className="appfooter">
          <h5>BEP-20 Token: 0x5B387f4886F043f603f7d0cb55DBd727D6649C73</h5>
          <h5>ERC-20 Token: 0xa8377d8A0ee92120095bC7ae2d8A8E1973CcEa95</h5>
        </div>
      </div>
    );
  }
}

export default App;
