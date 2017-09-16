import React, { Component } from "react";
import logo from "./headerLogo.png";
import styled from "styled-components";

import factomUtil from "factomjs-util/dist/factomjs-util";
import factomD from "factomdjs/dist/factomd";

//alert(factomD.entryCreditRate(0));

class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 25,
    };
  }

  render() {
    const amount = this.state.amount;
    return (
      <div className={this.props.className}>
        My Wallet #{this.props.id} <br/>
        Amount: {amount}
      </div>
    );
  }
}

function Sidebar(props){
    return (
      <SidebarContainer>
        {props.children}
      </SidebarContainer>
    );
}

const SidebarContainer = styled.div`
    float: left;
    position:fixed;
`;

const MainSendHeader = styled.div`
  width: 730px;
  height: 626px;
  border-radius: 6px;
  box-shadow: 0 2px 13px 0 rgba(0, 16, 53, 0.5);
  margin-top:44px;
  margin-left:500px;
  background-color: #eef1f4;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1.4px;
  padding-top:10px;
`;

function Send(props){
  return (
    <div>
      <MainSendHeader>
          Send Factoid
      </MainSendHeader>
      <SendButton onClick={() => alert('Sent!')}>Send Funds</SendButton>
    </div>
  );
}

const SendButton = styled.button`
  color: #ffffff;
  width: 730px;
  height: 60px;
  border-radius: 6px;
  background-image: linear-gradient(to bottom, #ffa539, #ff8600);
  margin-left:500px;
  margin-top:16px;
  font-size: 20px;
  font-weight: bold;
`;

class App extends Component {
  render() {
    return (
      <div>
        <Header>
          <Logo src={logo} alt="logo" />
          <Title>My Factom Wallet</Title>
          <Help href="#">
            Help
          </Help>
        </Header>
        <MainBody>
          <Sidebar>
            <WalletSmall id={1}/>
            <WalletSmall id={2}/>
          </Sidebar>
          <Send/>
        </MainBody>
      </div>
    );
  }
}



const Header = styled.div`
  text-align: left;
  padding-left: 81px;
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  background-color: #001830;
  height: 90px;
  position:relative;
`;

const MainBody = styled.div`
  background-image: linear-gradient(to bottom, #002347, #001830);
  height: 939px;
  overflow: auto;
`;

const WalletSmall = styled(Wallet)`
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
  padding-top: 35px;
  margin-right:1px;
`;

const Help = styled.a`
  position: absolute;
  right: 51px;
  bottom: 30px;
  font-size: 18px;
  text-align: left;
  color: #ffffff;
  text-decoration: none;
`;

export default App;
