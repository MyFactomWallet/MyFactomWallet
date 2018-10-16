import React, { Component } from 'react';
import _flowRight from 'lodash/flowRight';
import LandingPage from './LandingPage/LandingPage.js';
import Header from './Header/Header.js';
import WalletManager from './WalletManager/WalletManager.js';
import Help from './Help/Help.js';
import Vote from './Vote/Listing/VoteListing.js';
import ViewVote from './Vote/View/ViewVote.js';
import CreateVoteStepper from './Vote/Create/CreateVoteStepper.js';
import { HashRouter as Router, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRootTheme from './withRootTheme';
import WalletController from './Context/WalletController.js';
import FactomCliController from './Context/FactomCliController.js';
import NetworkController from './Context/NetworkController.js';

import { Transaction } from 'factom/dist/factom-struct';
import { FactomCli } from 'factom/dist/factom';
//import ManageVoterList from './Vote/VoterList/ManageVoterList.js';

class App extends Component {
	render() {
		const { classes } = this.props;

		return (
			<Router>
				<React.Fragment>
					<NetworkController>
						<FactomCliController>
							<React.Fragment>
								<Header />
								<WalletController>
									<div className={classes.body}>
										<Route exact path="/" component={LandingPage} />
										<Route path="/wallet/manage/" component={WalletManager} />
										<Route exact path="/vote" component={Vote} />
										<Route exact path="/viewVote" component={ViewVote} />
										<Route
											exact
											path="/createVote"
											component={CreateVoteStepper}
										/>
										{/* <Route exact path="/manageVoters" component={ManageVoterList} /> */}
										<Route exact path="/help" component={Help} />
									</div>
								</WalletController>
							</React.Fragment>
						</FactomCliController>
					</NetworkController>
				</React.Fragment>
			</Router>
		);
	}
}
App.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	body: {
		width: '1200px',
		margin: '0 auto',
	},
});

const enhancer = _flowRight(withRootTheme, withStyles(styles));

export default enhancer(App);
