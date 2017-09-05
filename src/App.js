import React, { Component } from 'react';
import logo from './logo.png';
import styled from 'styled-components';

//---------------------------Pull from NODE_MODULES----------------------------------------------
//1. Uncomment the next line and run "npm start".  This will work and does not use the precompiled version.
import factomUtil from 'factomjs-util'; //OR var factomUtil = require('factomjs-util');
//The above example fails when running "npm run build" because of a failure to minify
//Side Note: It's possible to import the function directly with => import {isValidAddress} from 'factomjs-util';

//2. Uncomment the next line and run "npm start" to use the pre-compiled version.
//import factomUtil from 'factomjs-util/dist/factomjs-util'; //OR var factomUtil = require('factomjs-util/dist/factomjs-util');
//This compiles but errors when calling "isValidAddress" saying it is not a function.
//---------------------------Pull from NODE_MODULES----------------------------------------------


//---------------------------Pull from /src------------------------------------------------------
//3. The next line uses a precompiled version (with compile errors fixed) and results in the same error as #2
//import factomUtil from './sourcefactomjs-util';
//---------------------------Pull from /src------------------------------------------------------


const validAddress = ('Fs2S5Ut7ZZhsgFuko2BNsGDMmFaNsX46cVnsE5Y2AmgQ2C31e9DX');
const isValid = factomUtil.isValidAddress(validAddress);

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
        {validAddress} = <b>{isValid ? 'true' : 'false'}</b>
      </div>
    );
  }
}

export default App;
