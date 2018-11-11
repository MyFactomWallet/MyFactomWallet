import { HashRouter as Router, Route } from 'react-router-dom';
import _flowRight from 'lodash/flowRight';
import React, { Component } from 'react';
import WalletManager from './walletManager/WalletManager';
import AddInitialWallet from './addWallet/AddInitialWallet';
import Vote from './vote/listing/VoteListing';
import ViewVote from './vote/view/ViewVote';
import CreateVoteStepper from './vote/create/CreateVoteStepper';
import TestnetWarningBar from './TestnetWarningBar';

class AppRouter extends Component {
	render() {
		const {
			classes,
			walletController: {},
		} = this.props;

		return (
			<Router>
				<React.Fragment>
					<Route exact path="/" component={WalletManager} />
					<Route path="/wallet/add/" component={AddInitialWallet} />

					{/*
						<Route exact path="/vote" component={ComingSoon} />
						<Route
								exact
								path="/createVote"
								component={ComingSoon}
						/>
                	*/}

					<Route exact path="/vote" component={Vote} />
					<Route exact path="/viewVote" component={ViewVote} />
					<Route exact path="/createVote" component={CreateVoteStepper} />
					{/* 
					<Route exact path="/manageVoters" component={ManageVoterList} /> 
					<Route exact path="/help" component={Help} />
					<Route exact path="/" component={LandingPage} />
					<Route path="/wallet/manage/" component={WalletManager} />
					*/}
					<Route path="/" component={TestnetWarningBar} />
				</React.Fragment>
			</Router>
		);
	}
}

const enhancer = _flowRight();

export default enhancer(AppRouter);
