import React, { Component } from 'react';
import LandingPage from './LandingPage/LandingPage.js';
import Header from './Header/Header.js';
import WalletManager from './WalletManager/WalletManager.js';
import CreateWallet from './CreateWallet/CreateWallet.js';
import Help from './Help/Help.js';
import Vote from './Vote/Vote.js';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import factomD from 'factomdjs/dist/factomd';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRootTheme from './withRootTheme';

class App extends Component {
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
							<Route path="/wallet/manage/" component={WalletManager} />
							<Route exact path="/vote" component={Vote} />
							<Route exact path="/help" component={Help} />
						</div>
					</Switch>
				</div>
			</Router>
		);
	}
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
