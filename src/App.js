import React, { Component } from "react";
import styled from "styled-components";
import Intro from "./Intro/Intro.js";
import Header from "./Header/Header.js";
import SendPage from "./SendPage/SendPage.js";
import CreatePage from "./CreatePage/CreatePage.js";
import {
  HashRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import factomUtil from "factomjs-util/dist/factomjs-util";
import factomD from "factomdjs/dist/factomd";

class App extends Component {

  render() {
    return (
      <Router>
        <div>
          <Header/>
          <MainBackground>
            <Switch>
              <CenterContent>
                <Route exact path="/" component={Intro}/>
                <Route exact path="/wallet/send/:walletID" component={SendPage}/>
                <Route exact path="/createwallet" component={CreatePage}/>
              </CenterContent>
            </Switch>
          </MainBackground>
        </div>
      </Router>
    );
  }
}

const MainBackground = styled.div`
  background-image: linear-gradient(to bottom, #002347, #001830);
  height: 939px;
  overflow: auto;
`;

const CenterContent = styled.div`
  width: fit-content;
  margin: 0 auto;
`;

export default App;
