import React, { Component } from 'react';
import Web3 from 'web3';
import Token from '../../build/contracts/Token.json'
import Yuvan from '../../build/contracts/Yuvan.json'
import Nft from '../../build/contracts/Nft.json'
import Auction from '../../build/contracts/Auction.json'
import EthSwap from '../../build/contracts/EthSwap.json'
import Main from './Main'
import './App.css';

import Spotify from './Spotify'


class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      account: '',
      nft:{},
      token: {},
      yuvan:{},
      ethSwap: {},
      auction: {},
      yuvanBalance: '0',
      ethBalance: 0,
      tokenBalance: 0,
      loading: true,
      address: '',
      add:'',
      highest:"0",
      highestbidder: '',
      highest1:"0",
      highestbidder1: ''
    }
  }

  async componentWillMount() {
    await this.loadWeb3()
    // console.log(window.web3);
    await this.loadBlockdata()
  }

  
  async loadWeb3(){
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      window.alert('non etherreum browser');
    }
  }

  async loadBlockdata() {
    const web3 = window.web3
    const accounts = await new web3.eth.getAccounts();
    this.setState({account : accounts[0]});
    // console.log(this.state.account)
    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ethBalance})
    // console.log(this.state.ethBalance)
    const networkId =  await web3.eth.net.getId()
    const yuvanData = Yuvan.networks[networkId]
    const tokenData = Token.networks[networkId]
    const nftData = Nft.networks[networkId]
    const auctionData = Auction.networks[networkId]
    console.log(tokenData.address)
    if(tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address)
      const yuvan = new web3.eth.Contract(Yuvan.abi, yuvanData.address)
      const nft = new web3.eth.Contract(Nft.abi, nftData.address)
      const auction = new web3.eth.Contract(Auction.abi, auctionData.address)
      this.setState({add:auctionData.address})
      this.setState({ yuvan })
      this.setState({ nft })
      this.setState({ token })
      this.setState({ auction })
      let highest = await auction.methods.gethigh(0).call();
      this.setState({ highest: window.web3.utils.fromWei(highest, 'Ether')})
      let high = await auction.methods.gethighB(0).call();
      this.setState({highestbidder:high})

      let highest1 = await auction.methods.gethigh(1).call();
      this.setState({ highest1: window.web3.utils.fromWei(highest1, 'Ether')})
      let high1 = await auction.methods.gethighB(1).call();
      this.setState({highestbidder1:high1})
      // 
      // token.balanceOf.call("0xa40644BEE5907f06a43E6f97cDEd680c15Fc6824").thenthis.setState({tokenBalance: })
      let tokenBalance = await token.methods.balanceOf(this.state.account).call()
      this.setState({ tokenBalance: tokenBalance.toString() })
      let yuvanBalance = await yuvan.methods.balanceOf(this.state.account).call()
      this.setState({ yuvanBalance: yuvanBalance.toString() })
      // let high = await auction.methods.highBidder.call().call()
      // this.setState({ highestbidder: high })
      // console.log(high)
    } else {
      window.alert('Token contract not deployed to detected network.')
    }

    const ethSwapData = EthSwap.networks[networkId]
    if(ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address)
      this.setState({ ethSwap })
      this.setState({ address : ethSwapData.address })
    } else {
      window.alert('EthSwap contract not deployed to detected network.')
    }
    // console.log(ethSwapData.address)
    this.setState({ loading: false })
  }
  buyTokens = (etherAmount) => {
    this.setState({ loading: true })
    this.state.ethSwap.methods.buyTokens().send({ value: etherAmount, from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
      this.loadBlockdata();
    })
  }

  buyyuvan = (amount) => {
    this.setState({ loading: true })
    this.state.token.methods.approve(this.state.address,amount).send({from: this.state.account}).on('transactionHash', (hash) => {
      this.state.ethSwap.methods.exchange(amount).send({from: this.state.account}).on('transactionHash', (hash) => {
        this.setState({ loading: false })
        this.loadBlockdata();
      })
    })
  }

  sellTokens = (tokenAmount) => {
    this.setState({ loading: true })
    // console.log(this.state.account,this.state.address)
    this.state.token.methods.approve(this.state.address,tokenAmount).send({from: this.state.account}).on('transactionHash', (hash) => {
      this.state.ethSwap.methods.sellTokens(tokenAmount).send({from: this.state.account}).on('transactionHash', (hash) => {
        this.setState({ loading: false })
        this.loadBlockdata();
      })
    })
  }

  makenft = (uri,id) => {
    // this.setState({ loading: true })
    this.state.nft.methods.mint(uri,id).send({from : this.state.account}).on('transactionHash', (hash) => {
      // this.setState({ loading: false })
      this.loadBlockdata();
    })
  }
  
  start = (price,id) => {
    this.state.auction.methods.start(price,id).send({from : this.state.account}).on('transactionHash', (hash) => {
      this.loadBlockdata();
    })
  }

  withdraw = (id) => {
    this.state.auction.methods.withdraw(id).send({from : this.state.account}).on('transactionHash', (hash) => {
      this.loadBlockdata();
    })
  }

  bid = (id,val) => {
    this.state.yuvan.methods.approve(this.state.add,val).send({from: this.state.account}).on('transactionHash', (hash) => {
    this.state.auction.methods.bid(id,val).send({from : this.state.account}).on('transactionHash', (hash) => {
      this.loadBlockdata();
    })
  })
  }

  auctionend = (val) => {
    if(val==0){
    this.state.nft.methods.transfer(this.state.highestbidder,val).send({from : this.state.account}).on('transactionHash', (hash) => {
      this.loadBlockdata();
    })  
    // this.state.yuvan.methods.approve(this.state.add,amount).send({from: this.state.account}).on('transactionHash', (hash) => {
    this.state.auction.methods.auctionEnd(val).send({from : this.state.account}).on('transactionHash', (hash) => {
      this.loadBlockdata();
    })
  }
  else{
    console.log(this.state.highestbidder1)
    this.state.nft.methods.transfer(this.state.highestbidder1,val).send({from : this.state.account}).on('transactionHash', (hash) => {
      this.loadBlockdata();
    })  
    // this.state.yuvan.methods.approve(this.state.add,amount).send({from: this.state.account}).on('transactionHash', (hash) => {
    this.state.auction.methods.auctionEnd(val).send({from : this.state.account}).on('transactionHash', (hash) => {
      this.loadBlockdata();
    })
  }
  // })
  }

  render() {
    let content,spot
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main
        ethBalance={this.state.ethBalance}
        tokenBalance={this.state.tokenBalance}
        yuvanBalance={this.state.yuvanBalance}
        buyTokens={this.buyTokens}
        sellTokens={this.sellTokens}
        buyyuvan = {this.buyyuvan}
      />
      spot = <Spotify 
        makenft = {this.makenft}
        start = {this.start}
        bid = {this.bid}
        highest = {this.state.highest}
        highest1 = {this.state.highest1}
        withdraw = {this.withdraw}
        auctionend = {this.auctionend}
      />
    }
    return (
      <div style={{marginTop:"15px"}}>
        <nav className="navbar navbar-dark bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            Test Assignment
          </a>
          <a>{this.state.account}</a>
        </nav>
        
     
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              {content}
              <div style={{marginLeft:"80px"}}></div>
              {spot}
            </main>
          </div>
        </div>
        
      </div>
    );
  }
}

export default App;
// https://github.com/yuvan11/Ethereum-Swap.git
