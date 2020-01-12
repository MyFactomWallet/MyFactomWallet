import React, { Component } from 'react';
import _flowRight from 'lodash/flowRight';
import { BrowserRouter as Router } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppRouter from './AppRouter';
import Disclaimer from './Disclaimer';
import FactomCliController from './context/FactomCliController';
import Footer from './frame/Footer';
import Header from './frame/Header';
import LedgerController from './context/LedgerController';
import NetworkController from './context/NetworkController';
import PropTypes from 'prop-types';
import SeedController from './context/SeedController';
import TestnetWarningBar from './TestnetWarningBar';
import WalletController from './context/WalletController';
import withRootTheme from './withRootTheme';

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
									<SeedController>
										<LedgerController>
											<div className={classes.pageContainer}>
												<div className={classes.content}>
													<Header />
													<AppRouter />
													<TestnetWarningBar />
													<Footer />
												</div>
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

const styles = (theme) => ({
	content: {
		paddingBottom: '125px',
	},
	pageContainer: {
		position: 'relative',
		minHeight: '100vh',
	},
});

const enhancer = _flowRight(withRootTheme, withStyles(styles));

export default enhancer(App);
