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
          <MainBody>
            <Switch>
              <Route exact path="/" component={Intro}/>
              <Route exact path="/wallet/send/:walletID" component={SendPage}/>
              <Route exact path="/createwallet" component={CreatePage}/>
            </Switch>
          </MainBody>
        </div>
      </Router>
    );
  }
}

const MainBody = styled.div`
  background-image: linear-gradient(to bottom, #002347, #001830);
  height: 939px;
  overflow: auto;
`;

export default App;
