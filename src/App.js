import React, { Component } from 'react';
import logo from './headerLogo.png';
import styled from 'styled-components';

import factomUtil from 'factomjs-util/dist/factomjs-util';


const validAddress = ('Fs2S5Ut7ZZhsgFuko2BNsGDMmFaNsX46cVnsE5Y2AmgQ2C31e9DX');
const isValid = factomUtil.isValidAddress(validAddress);

const Header = styled.div`
  padding-left:82.9px;
  width: 284.6px;
  height: 24px;
  font-family: Montserrat;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  color: #ffffff;
`;

const HeaderLogo = styled.img`
  width: 39.1px;
  height: 31.4px;
  margin-top:30px;
  margin-right:13px;
  float:left;
`;

const Outer = styled.div`
  width: 1440px;
  height: 90px;
  background-color: #001830;
`;

const Main = styled.div`
  width: 1440px;
  height: 939px;
  transform: rotate(-180deg);
  background-image: linear-gradient(to bottom, #001830, #002347);
`;

const Title = styled.div`
  padding-top:35px;
`;

const POC = styled.div`
  transform: rotate(180deg);
  color: orange;
  position: fixed;
  bottom: 1px;
  right: 1px;
`;

class App extends Component {
  render() {
    return (
      <span>
      <Outer>
        <Header>
          <HeaderLogo src={logo} alt="logo"/>
           <Title>MyFactomWallet</Title>
        </Header>
      </Outer>
      <Main>
        <POC>{validAddress} = <b>{isValid ? 'true' : 'false'}</b></POC>
      </Main>
    </span>
    );
  }
}

export default App;
