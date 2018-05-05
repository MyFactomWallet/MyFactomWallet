import React, { Component } from "react";
import styled from "styled-components";
import Sidebar from "../Sidebar/Sidebar.js";
import {
  Link,
  Route,
  Switch
} from 'react-router-dom'

class WalletManager extends Component{
  state = {wallets: [1,2,3]}

  render(){
    const match = this.props.match;
    const walletID = this.props.match.params.walletID;
    return (
      <div>
        <StyledSidebarWallets wallets={this.state.wallets}/>
        <WalletContainer>
          <WalletContainerTabs>
            <StyledLink to={`${match.url}/send`}>Send Factoid</StyledLink>
            <StyledLink to={`${match.url}/receive`}>Receive Factoid</StyledLink>
            <StyledLink to={`${match.url}/backup`}>Backup Wallet</StyledLink>
          </WalletContainerTabs>
          <Route path={`${match.url}/send`} component={WalletSend}/>
          <Route path={`${match.url}/send`} component={TransactionPreview}/>
        </WalletContainer>
        <Route path={`${match.url}/send`} component={SendButton}/>
      </div>
    );
  }
}

const SendButton = (props) => {
  return(
    <div>
      <Submit onClick={() => alert('Sent!')}>Send Funds</Submit>
      <br/>
      <SendWarning>Please verify all details are correct before hitting send.<br/>We can not reverse mistaken transactions.</SendWarning>
    </div>
  );
}

const TransactionPreview = (props) => {
  return(
    <StyledTransactionPreview>
        Transaction Preview
    </StyledTransactionPreview>
  );
}

class WalletSend extends Component {

  render (){
      return(
        <div>
          <FormItem>
            <Label htmlFor="recipientInput">Recipient</Label>
            <HelpText>Send to one of my wallets</HelpText>
            <br/>
            <SendInput type="text" name="recipientInput" placeholder="Enter recipient address"/>
          </FormItem>
          <br/>
          <FormItem>
            <Label htmlFor="amountInput">Amount</Label>
            <HelpText>Use Max</HelpText>
            <br/>
            <SendInput type="text" name="amountInput" placeholder="Enter Amount ($)"/>
          </FormItem>
        </div>
      );
  }
}

const FormItem = styled.div`
  text-align: left;
  padding-left: 24px;
  padding-right: 40px;
`;

const Label = styled.label`
  width: 33px;
  height: 18px;
  font-weight: bold;
  color: #001830;
`;

const HelpText = styled.div`
  font-size: 12px;
  font-weight: 500;
  text-align: right;
  float:right;
  color: #007eff;
`;

const SendInput = styled.input`
  width: 651px;
  height: 55px;
  border-radius: 6px;
  border: solid 1px #007eff;
  background-color: #eef1f4;
  font-size: 20px;
  font-weight: 300;
  padding-left: 12px;
  margin-top: 7px;
  color: #007eff;
  &:hover{
         background-color: #e6f3ff;
         }
`;

const Submit = styled.button`
  color: #ffffff;
  width: 730px;
  height: 60px;
  border-radius: 6px;
  background-image: linear-gradient(to bottom, #ffa539, #ff8600);
  margin-top:16px;
  font-size: 20px;
  font-weight: bold;
  float: right;
`;

const SendWarning = styled.div`
  width: 730px;
  height: 44px;
  opacity: 0.75;
  font-family: OpenSans;
  font-size: 14px;
  line-height: 1.57;
  color: #ffffff;
  margin-top:16px;
  text-align: center;
  float: right;
`;

const WalletContainer = styled.div`
  width: 730px;
  height: 626px;
  border-radius: 6px;
  box-shadow: 0 2px 13px 0 rgba(0, 16, 53, 0.5);
  margin-top:44px;
  margin-left: 500px;
  background-color: white;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1.4px;
  padding-top:10px;
`;

const WalletContainerTabs = styled.div`
  margin-bottom: 50px;
  background-color: #103152;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  margin-top: -10px;
  text-align: center;
  padding-top: 35px;
  padding-bottom:35px;
`;

const StyledLink = styled(Link)`
  color: #ffffff;
  height: 77px;
  padding: 28px;
  &:hover{
         border-bottom-width: 7px;
         border-bottom-color: white;
         border-bottom-style: solid;
         }
`;

const StyledTransactionPreview = styled.div`
  padding-top: 23px;
  margin-top: 39px;
  height: 250px;
  border-radius: 6px;
  background-color: #eef1f4;
  font-weight: bold;
`;

const StyledSidebarWallets = styled(Sidebar)`
    float:left;
    margin-left:81px;
`;

export default WalletManager;
