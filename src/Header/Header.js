import React from "react";
import styled from "styled-components";
import logo from "../headerLogo.png";
import {Link} from 'react-router-dom';

function HeaderSection(props){
  return(
    <div className={props.className}>
      <HeaderContent>
        <Link to={"/"}>
          <Logo src={logo} alt="logo" />
          <Title>My Factom Wallet</Title>
        </Link>
        <MenuLinks>
          <MenuItem href="#Manage">
            Manage Wallets
          </MenuItem>
          <MenuItem href="#Help">
            Help
          </MenuItem>
        </MenuLinks>
      </HeaderContent>
    </div>
  );
}

const Header = styled(HeaderSection)`
  padding-left: 81px;
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  background-color: #001830;
  height: 90px;
  position:relative;
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Logo = styled.img`
  margin-top: 30px;
  margin-right: 13px;
  width: 39.1px;
  height: 31.4px;
`;

const MenuLinks = styled.div`
  float:right;
  margin-top: 30px;
  margin-right: 51px;
`;

const MenuItem = styled.a`
  padding-left: 16px;
  font-size: 18px;
  color: #ffffff;
  text-decoration: none;
`;

const Title = styled.div`
  display: inline-block;
  padding-top: 35px;
  margin-right:1px;
  color: #ffffff;
  text-decoration: none;
  vertical-align: top;
`;

export default Header;
