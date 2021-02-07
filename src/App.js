
import './App.css';
import React, {Component} from 'react';
import Web3 from 'web3';
import TodoList from './src/build/contracts/TodoList.json'
import Main from './main'

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

    //Get Network ID
	  const networkId = await web3.eth.net.getId()
	  const networkData = TodoList.networks[networkId]
	  if(networkData){
		  //load smart contrcat proper
		 const todoList = new web3.eth.Contract(TodoList.abi, networkData.address)
		  //set TodoList state
		  this.setState({todoList: todoList})

      const taskCount = await todoList.methods.taskCount().call()
      this.setState({taskCount})

      //list out TaskList
      for(var i = 1; i <= taskCount; i++){
        const task = await todoList.methods.tasks(i).call()
        this.setState({
          tasks: [...this.state.tasks, task]
        })
        console.log("tasks: ", this.state.tasks)
      }
} else{
   window.alert('contract was not deployed to test network.')
 }

 this.setState({loading:  false})

}

createTask(content) {
  this.setState({ loading: true })
  this.state.todoList.methods.createTask(content).send({ from: this.state.account })
  .once('receipt', (receipt) => {
    this.setState({ loading: false })
  })
}

checkboxClicked(taskId) {
    this.setState({ loading: true })
    this.state.todoList.methods.checkboxClicked(taskId).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      todoList: null,
      taskCount: 0,
      tasks:[],
      loading: true
    }
    this.createTask = this.createTask.bind(this)
    this.checkboxClicked = this.checkboxClicked.bind(this)
  }
  render(){
    return (
      <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small><a className="nav-link" href="#"><span id="account"></span></a></small>
          </li>
        </ul>
      </nav>
      <br></br>
      <blockquote className="blockquote text-center">
      <p className="mb-0"> <strong> TODO LIST </strong></p>
      <footer className="blockquote-footer">Huncho J</footer>
      </blockquote>

      <div className="container-fluid">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex justify-content-center">
              {this.state.loading
                ?  <div id = "loader" className = "text-center"><p className= "text-center"> Loading....</p></div>
                : <Main
                  tasks = {this.state.tasks}
                  createTask = {this.createTask}
                  checkboxClicked = {this.checkboxClicked}/>
              }
            </main>
          </div>
        </div>
      </div>

    );
  }
}

export default App;
