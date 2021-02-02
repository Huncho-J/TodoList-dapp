
import './App.css';
import React, {Component} from 'react';
import Web3 from 'web3';
import TodoList from './src/build/contracts/TodoList.json'

class App extends Component {

  async componentWillMount() {
		  await this.loadWeb3()
		  await this.loadBlockChainData()
	  }
  async loadWeb3() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
    }
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
    }
      else{
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
    }

  async loadBlockChainData(){
    const web3 = window.web3

	  //load accounts
	  const accounts = await web3.eth.getAccounts()
	  this.setState({account: accounts[0]})
  }

  constructor(props) {
    super(props)
    this.state = {
      account: ''
    }
  }
  render(){
    return (
      <div className="container">
      <h1>Hello, world! </h1>
      <p>Your account: {this.state.account} </p>
      </div>
    );
  }
}

export default App;
