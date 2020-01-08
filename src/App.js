import React, { Component } from 'react';
import _flowRight from 'lodash/flowRight';
import Header from './frame/Header';
import { BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRootTheme from './withRootTheme';
import WalletController from './context/WalletController';
import SeedController from './context/SeedController';
import FactomCliController from './context/FactomCliController';
import NetworkController from './context/NetworkController';
import LedgerController from './context/LedgerController';
import Disclaimer from './Disclaimer';
import TestnetWarningBar from './TestnetWarningBar';
import AppRouter from './AppRouter';
import Footer from './frame/Footer';

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
												<AppRouter />
												<TestnetWarningBar />
											</div>
										</LedgerController>
									</SeedController>
									<Footer />
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
