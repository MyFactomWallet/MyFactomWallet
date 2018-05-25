import React, { Component } from 'react';
import LandingPage from './LandingPage/LandingPage.js';
import Header from './Header/Header.js';
import WalletManager from './WalletManager/WalletManager.js';
import CreateWallet from './CreateWallet/CreateWallet.js';
import Help from './Help/Help.js';
import Vote from './Vote/Vote.js';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRootTheme from './withRootTheme';
import fctUtils from 'factomjs-util/dist/factomjs-util';

function Wallet(id, type, balance) {
	var priv_key = fctUtils.randomPrivateKey();
	var pub_key = fctUtils.privateKeyToPublicKey(priv_key);

	this.id = id;
	this.type = type;
	this.balance = balance;
	this.public_address = fctUtils.publicFactoidKeyToHumanAddress(pub_key);
}

class App extends Component {
	state = {
		activeWalletID: 1,
		wallets: [
			new Wallet(1, 'Factoid', 5000),
			new Wallet(2, 'Factoid', 500),
			new Wallet(3, 'Factoid', 5),
		],
	};

	render() {
		const { classes } = this.props;

		return (
			<Router>
				<div>
					<Header />
					<Switch>
						<div className={classes.body}>
							<Route exact path="/" component={LandingPage} />
							<Route exact path="/createwallet" component={CreateWallet} />
							<Route
								path="/wallet/manage/"
								render={() => (
									<WalletManager
										addWallet={this.addWallet}
										selectWallet={this.selectWallet}
										wallets={this.state.wallets}
										activeWalletID={this.state.activeWalletID}
									/>
								)}
							/>
							<Route exact path="/vote" component={Vote} />
							<Route exact path="/help" component={Help} />
						</div>
					</Switch>
				</div>
			</Router>
		);
	}

	addWallet = (newID) => {
		this.setState((prevState) => ({
			wallets: prevState.wallets.concat(new Wallet(newID, 'Factoid', 0)),
			activeWalletID: newID,
		}));
	};

	selectWallet = (walletID) => {
		this.setState((prevState) => ({
			activeWalletID: walletID,
		}));
	};
}
App.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	body: {
		width: 'fit-content',
		margin: '0 auto',
	},
});

export default withRootTheme(withStyles(styles)(App));
