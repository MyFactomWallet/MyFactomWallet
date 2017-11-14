import React, { Component } from "react";
import styled from "styled-components";
import Sidebar from "../Sidebar/Sidebar.js";

class SendPage extends Component{
  constructor(props) {
    super(props);
    this.state = {wallets: [1, 2]}
  }

  render(){
    const walletID = this.props.match.params.walletID;

    return (
      <div>
        <StyledSidebarWallets wallets={this.state.wallets}/>
        <WalletActionHeader>
          <input onClick={this.handleSendClick} type="button" value="Send Factoid"/>
          <input onClick={this.handleReceiveClick} type="button" value="Receive Factoid" />
          <input onClick={this.handleBackupClick} type="button" value="Backup Wallet" />
          <div>Wallet {walletID}</div>
        </WalletActionHeader>
        <SendButton onClick={() => alert('Sent!')}>Send Funds</SendButton>
      </div>
    );
  }

  handleSendClick() {
    console.log('Send Handled');
  }

  handleReceiveClick() {
    console.log('Receive Handled');
  }

  handleBackupClick() {
    console.log('Backup Handled');
  }
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

const WalletActionHeader = styled.div`
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

const StyledSidebarWallets = styled(Sidebar)`
    float:left;
`;

export default SendPage;
