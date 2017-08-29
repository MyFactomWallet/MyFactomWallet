import React, { Component } from 'react';
import logo from './logo.png';
import FactomUtil from './factomjsutil';
import styled from 'styled-components';
import './App.css';

const PageTitle = styled.h2`
  color: orange;
`;

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <PageTitle>MyFactomWallet</PageTitle>
        </div>
      </div>
    );
  }
}

export default App;
