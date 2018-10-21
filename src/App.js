import React, { Component } from 'react';
import _flowRight from 'lodash/flowRight';
import LandingPage from './LandingPage/LandingPage';
import Header from './Header/Header';
import WalletManager from './WalletManager/WalletManager';
import AddInitialWallet from './AddWallet/AddInitialWallet';
import Vote from './Vote/Listing/VoteListing';
import ViewVote from './Vote/View/ViewVote';
import CreateVoteStepper from './Vote/Create/CreateVoteStepper';
import { HashRouter as Router, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRootTheme from './withRootTheme';
import WalletController from './Context/WalletController';
import FactomCliController from './Context/FactomCliController';
import NetworkController from './Context/NetworkController';
import LedgerController from './Context/LedgerController';
//import Help from './Help/Help';
//import Disclaimer from './Disclaimer';
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
								{/* <Disclaimer /> */}
								<WalletController>
									<Header />

									<LedgerController>
										<div className={classes.body}>
											<Route exact path="/" component={LandingPage} />
											<Route path="/wallet/manage/" component={WalletManager} />
											<Route path="/wallet/add/" component={AddInitialWallet} />
											<Route exact path="/vote" component={Vote} />
											<Route exact path="/viewVote" component={ViewVote} />
											<Route
												exact
												path="/createVote"
												component={CreateVoteStepper}
											/>
											{/* <Route exact path="/manageVoters" component={ManageVoterList} /> 
											<Route exact path="/help" component={Help} />*/}
										</div>
									</LedgerController>
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
