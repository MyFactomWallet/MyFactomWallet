import React, { Component } from 'react';
import _flowRight from 'lodash/flowRight';
import LandingPage from './landingPage/LandingPage';
import Header from './header/Header';
import WalletManager from './walletManager/WalletManager';
import AddInitialWallet from './addWallet/AddInitialWallet';
import Vote from './vote/listing/VoteListing';
import ViewVote from './vote/view/ViewVote';
import CreateVoteStepper from './vote/create/CreateVoteStepper';
import { HashRouter as Router, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRootTheme from './withRootTheme';
import WalletController from './context/WalletController';
import SeedController from './context/SeedController';
import FactomCliController from './context/FactomCliController';
import NetworkController from './context/NetworkController';
import LedgerController from './context/LedgerController';
//import Help from './help/Help';
import Disclaimer from './Disclaimer';
//import ManageVoterList from './vote/voterList/ManageVoterList.js';
import Typography from '@material-ui/core/Typography';

class App extends Component {
	render() {
		const { classes } = this.props;

		return (
			<Router>
				<React.Fragment>
					<NetworkController>
						<FactomCliController>
							<React.Fragment>
								<Disclaimer />
								<WalletController>
									<Header />
									<SeedController>
										<LedgerController>
											<div className={classes.body}>
												<Route exact path="/" component={WalletManager} />
												{/* <Route exact path="/" component={LandingPage} />
											<Route path="/wallet/manage/" component={WalletManager} /> */}
												<Route
													path="/wallet/add/"
													component={AddInitialWallet}
												/>
												{/* <Route exact path="/vote" component={ComingSoon} /> 
											<Route exact path="/createVote" component={ComingSoon} />*/}
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
									</SeedController>
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

const ComingSoon = () => {
	return (
		<Typography variant="h5" align="center">
			Coming soon...
		</Typography>
	);
};

const styles = (theme) => ({
	body: {
		width: '1200px',
		margin: '0 auto',
	},
});

const enhancer = _flowRight(withRootTheme, withStyles(styles));

export default enhancer(App);
