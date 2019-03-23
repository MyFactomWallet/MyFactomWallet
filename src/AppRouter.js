import { HashRouter as Router, Route } from 'react-router-dom';
import _flowRight from 'lodash/flowRight';
import React, { Component } from 'react';
import { withWalletContext } from './context/WalletContext';
import WalletManager from './walletManager/WalletManager';
import AddInitialWallet from './addWallet/AddInitialWallet';
import VoteListing from './vote/listing/VoteListing';
import VoteTabContent from './vote/view/VoteTabContent';
import CreateVoteStepper from './vote/create/CreateVoteStepper';
// import ManageVoterList from './vote/voterList/ManageVoterList.js';

class AppRouter extends Component {
	render() {
		const {
			walletController: {
				readyToManageWallet,
				isWalletEmpty,
				setReadyToManageWallet,
			},
		} = this.props;

		return (
			<Router>
				<React.Fragment>
					<Route
						exact
						path="/"
						render={() =>
							readyToManageWallet && !isWalletEmpty() ? (
								<WalletManager />
							) : (
								<AddInitialWallet
									setReadyToManageWallet={setReadyToManageWallet}
								/>
							)
						}
					/>

					<Route exact path="/vote" component={VoteListing} />
					<Route exact path="/viewVote" component={VoteTabContent} />
					<Route exact path="/createVote" component={CreateVoteStepper} />
					{/* <Route exact path="/manageVoters" component={ManageVoterList} /> */}
				</React.Fragment>
			</Router>
		);
	}
}

const enhancer = _flowRight(withWalletContext);

export default enhancer(AppRouter);
