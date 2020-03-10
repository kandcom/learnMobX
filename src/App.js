import React from 'react';
import {observer} from 'mobx-react'
@observer class App extends React.Component {
  handleInc = () => this.props.store.increment()
  handleDec = () => this.props.store.decrement();
  state = {
    name: this.props.store.firstName
  }
  changeName = (e) => {
    console.log(e.target.value)
    this.setState({name: e.target.value})
  }
  addName = name => {
    this.props.store.update(name);
  }
  componentDidMount(){
    // setTimeout(() => {
    //   this.props.todos.push({todo: 'ahah'})
    // }, 3000);
  }
  render(){
    const {age, nickName} = this.props.store;
    const todos = this.props.todos;
    return (
      <div>
        <h1>{age}</h1>
        <p>{nickName}</p>
        <button onClick={this.handleInc}>+1</button>
        <button onClick={this.handleDec}>-1</button>
        <input type="text" value={this.state.name} onChange={(e) => {this.changeName(e)}}/>
        <button onClick={() => this.addName(this.state.name)}>click my</button>
        <ul>
          {todos.map(todo => <li key={todo.todo}>{todo.todo}</li>)}
        </ul>
      </div>
    );
  }
}

export default App
