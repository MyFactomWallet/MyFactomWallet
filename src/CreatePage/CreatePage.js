import React, { Component } from "react";
import styled from "styled-components";

class CreatePage extends Component {

  render() {
    return (
      <Content>
        Creating a new wallet is not yet available.
      </Content>
    );
  }
}

const Content = styled.div`
  text-align: center;
  margin: 0 auto;
  margin-top: 20px;
  font-size: 30px;
  font-weight: 300;
  line-height: 1.37;
  letter-spacing: 0.5px;
  color: #ffffff;
  text-align:center;
`;

export default CreatePage;
