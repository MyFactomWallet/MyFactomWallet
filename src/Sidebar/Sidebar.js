import React, { Component } from "react";
import styled from "styled-components";
import {Link} from 'react-router-dom'
class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeWalletID: 1
    };
  }

  render() {
    const activeWalletID = this.state.activeWalletID;
    const sideBar_o = this;
    const listWallets = this.props.wallets.map(function(item, index){
    if (activeWalletID === item){
      return <Link key={index} to={"/wallet/send/" + item}><WalletSmall onClick={() => {sideBar_o.handleClick(item)}} active id={item}/></Link>
    } else{
      return <Link key={index} to={"/wallet/send/" + item}><WalletSmall onClick={() => {sideBar_o.handleClick(item)}} id={item}/></Link>
    }
    });
    return (
      <span className={this.props.className}>
        {listWallets}
        <AddWallet>+ New Wallet</AddWallet>
      </span>
    );
  }

  handleClick = (walletID) => {
    this.setState({
      activeWalletID: walletID,
    });
  }
}

class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 25,
    };
  }

  render() {
    const amount = this.state.amount;
    const amountStyle = {
      fontSize:'35px'
    };
    return (
      <div className={this.props.className} onClick={this.props.onClick}>
        My Wallet #{this.props.id}
        <br/><br/>
        <span style={amountStyle}>${amount}</span>
        <br/><br/>
        1,000,000 FCT
      </div>
    );
  }
}

const WalletSmall = styled(Wallet)`
    width: 343px;
    height: 150px;
    border-radius: 6px;
    background-color: #103151;
    box-shadow: 0 2px 13px 0 rgba(0, 9, 28, 0.5);
    margin-left:81px;
    color: #ffffff;
    padding-left: 19px;
    padding-top: 17px;
    font-size: 16px;
    text-align: left;
    position: relative;
    margin-Top: 43px;

    ${props => props.active ?
      'background-image: linear-gradient(to bottom, #06c7ff, #0372ff); box-shadow: 0 0 10px 0 #007eff;' :
      ''};
`;

const AddWallet = styled.div`
  width: 150px;
  font-family: Montserrat;
  font-size: 20px;
  line-height: 1.25;
  color: #007eff;
  padding-left: 188px;
  margin-top: 9px;
`;

export default Sidebar;
