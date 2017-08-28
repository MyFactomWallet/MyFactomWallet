import React, { Component } from 'react';
import logo from './logo.png';
import FactomUtil from './factomjsutil';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" /> <h2>MyFactomWallet</h2>
        </div>
      </div>
    );
  }
}

export default App;
