import React, { Component } from 'react';
import LandingPage from './LandingPage/LandingPage.js';
import Header from './Header/Header.js';
import WalletManager from './WalletManager/WalletManager.js';
import Help from './Help/Help.js';
import Vote from './Vote/Vote.js';
import ViewVote from './Vote/ViewVote.js';
import CreateVoteStepper from './Vote/CreateVoteStepper.js';
import ManageVoterList from './Vote/ManageVoterList.js';
import { HashRouter as Router, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRootTheme from './withRootTheme';
import fctUtils from 'factomjs-util/dist/factomjs-util';

function Wallet(id, walletType, publicAddress, balance) {
	if (!publicAddress) {
		const privateKey = fctUtils.randomPrivateKey();

		publicAddress = fctUtils.publicFactoidKeyToHumanAddress(
			fctUtils.privateKeyToPublicKey(privateKey)
		);
	}

	this.id = id;
	this.walletType = walletType;
	this.public_address = publicAddress;
	this.balance = balance ? balance : '?';
}

class App extends Component {
	state = {
		activeWalletID: 1,
		wallets: [
			new Wallet(1, 'Factoid', undefined, 5000),
			new Wallet(2, 'Factoid', undefined, 500),
			new Wallet(3, 'Factoid', undefined, 5),
		],
	};

	/*
	async componentDidMount() {
		const cli = new FactomCli({
			host: '178.62.80.38',
		});
		console.log(
			isValidAddress('FA3FCjUbH3qSiaB4JAF3Dpsa8JVCsXwhfMrnyWJMqNe2LrEfDBoi')
		);
		const db = await cli.getDirectoryBlock(
			'f55a19d9562843b642f1a20b34fcbb71e70f438c4d98d223fc2228ca2dd0c54a'
		);
		const json = await db.json();
		console.log(json);
	}
	*/

	render() {
		const { classes } = this.props;

		return (
			<Router>
				<div>
					<Header />
					<div className={classes.body}>
						<Route
							exact
							path="/"
							render={() => <LandingPage addWallet={this.addWallet} />}
						/>
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
						<Route exact path="/viewVote" component={ViewVote} />
						<Route exact path="/createVote" component={CreateVoteStepper} />
						<Route exact path="/manageVoters" component={ManageVoterList} />
						<Route exact path="/help" component={Help} />
					</div>
				</div>
			</Router>
		);
	}

	addWallet = (walletType, publicAddress) => {
		this.setState((prevState) => ({
			wallets: prevState.wallets.concat(
				new Wallet(
					prevState.wallets.length + 1,
					walletType,
					publicAddress,
					undefined
				)
			),
			activeWalletID: prevState.wallets.length + 1,
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
		width: '1200px',
		margin: '0 auto',
	},
});

export default withRootTheme(withStyles(styles)(App));
