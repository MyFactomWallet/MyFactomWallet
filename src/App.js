import React, { Component } from 'react';
import logo from './logo.png';
import FactomUtil from './factomjsutil';
import {Header} from 'semantic-ui-react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Header as='h2' color='orange'>MyFactomWallet</Header>
        </div>
      </div>
    );
  }
}

export default App;
