import React, { Component } from 'react';
import logo from './logo.png';
import FactomUtil from './factomjsutil';
import styled from 'styled-components';

const Header = styled.div`
background-color: rgb(17, 30, 51);
padding: 20px;
color: white;
display: flex;
align-items: center;
font-size: 2em;
`;

const HeaderLogo = styled.img`
  height: 50px;
  margin-right: 10px;
`;

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header>
          <HeaderLogo src={logo} alt="logo"/>
           MyFactomWallet
        </Header>
      </div>
    );
  }
}

export default App;
