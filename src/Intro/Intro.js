import React, { Component } from "react";
import styled from "styled-components";
import logoIntro from "./combined-shape.png";
import {Link} from 'react-router-dom';
class Intro extends Component {

  render() {
    return (
      <IntroPage>
        <div><img src={logoIntro} alt="logoIntro" /></div>
        You can use MyFactomWallet to hold, send, and receive Factoids.  You don't have a wallet set up yet.
        <IntroSubtext1>
          Choose from the options below to get started
        </IntroSubtext1>
          <Link to={"/createwallet"}><IntroButton>Create New Wallet</IntroButton></Link>
          <Link to={"/wallet/send/1"}><IntroButton>Import</IntroButton></Link>
        <IntroSubtext2>
          If you aren't sure which option to pick, please consult our <a href="#Help">help guide.</a>
        </IntroSubtext2>
      </IntroPage>
    );
  }
}

const IntroPage = styled.div`
  text-align: center;
  width: 680px;
  margin: 0 auto;
  margin-top: 20px;
  font-size: 30px;
  font-weight: 300;
  line-height: 1.37;
  letter-spacing: 0.5px;
  color: #ffffff;
`;

const IntroSubtext1 = styled.div`
  font-size: 16px;
  margin-bottom:27px;
  margin-top:55px;
`;

const IntroSubtext2 = styled.div`
  letter-spacing: 0.4px;
  font-size: 14px;
  color: lightslategray;
  margin-top: 50px;
`;

const IntroButton = styled.div`
  display: inline-block;
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 64px;
  padding-right: 64px;
  margin-top: 15px;
  font-size: 16px;
  color: #ff8600;
  width: 277px;
  height: 50px;
  line-height: 50px;
  border-radius: 8px;
  box-shadow: 0 0 6px 0 #ff8600;
  border: solid 1px #ff8600;
  cursor:pointer;
`;


export default Intro;
