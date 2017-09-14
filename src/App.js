import React, { Component } from 'react';
import logo from './headerLogo.png';
import styled from 'styled-components';

import factomUtil from 'factomjs-util/dist/factomjs-util';
import factomD from 'factomdjs/dist/factomd';

class Wallets extends Component {
  constructor(){
    super();
    this.state = {ID: 1};
  }

  render(){
    return (
      <div>
        <WalletSmall>
             My Wallet #{this.state.ID}
        </WalletSmall>
        <WalletSmall>
             My Wallet #{this.state.ID + 1}
        </WalletSmall>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <span>
        <Header>
          <Logo src={logo} alt="logo"/>
           <Title>My Factom Wallet</Title>
        </Header>
        <MainBody>
          <Wallets></Wallets>
        </MainBody>
    </span>
    );
  }
}

const Header = styled.div`
  text-align: left;
  padding-left:81px;
  font-size: 20px;
  font-weight: bold;
  font-family: Montserrat;
  color: #ffffff;
  background-color: #001830;
  width: 1440px;
  height: 90px;
`;

const MainBody = styled.div`
  background-image: linear-gradient(to bottom, #002347, #001830);
  width: 1440px;
  height: 939px;
  overflow: auto;
`;

const WalletSmall = styled.div`
              width: 343px;
              height: 150px;
              border-radius: 6px;
              background-image: linear-gradient(to bottom, #06c7ff, #0372ff);
              box-shadow: 0 0 10px 0 #007eff;
              margin-left:81px;
              color: #ffffff;
              padding-left: 19px;
              padding-top: 17px;
              font-size: 16px;
              text-align: left;
              position: relative;
              margin-Top: 43px;
`;

const Logo = styled.img`
  float: left;
  margin-top: 30px;
  margin-right: 13px;
  width: 39.1px;
  height: 31.4px;
`;

const Title = styled.div`
  padding-top:35px;
`;

export default App;
