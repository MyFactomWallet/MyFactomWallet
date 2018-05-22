import React, { Component } from 'react';
import Sidebar from '../Sidebar/Sidebar.js';
import WalletTabs from './WalletTabs.js';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

class WalletManager extends Component {
	state = {
		wallets: [1, 2],
		activeWalletID: 1,
		sendFactoidAmount: 0,
	};

	render() {
		const { classes } = this.props;
		return (
			<Grid container spacing={24}>
				<Grid item xs={4}>
					<Sidebar
						addWallet={this.addWallet}
						selectWallet={this.selectWallet}
						wallets={this.state.wallets}
						activeWalletID={this.state.activeWalletID}
					/>
				</Grid>
				<Grid item xs={8} className={classes.root}>
					<Paper>
						<WalletTabs
							updateSendFactoidAmount={this.updateSendFactoidAmount}
							sendFactoidAmount={this.state.sendFactoidAmount}
						/>
					</Paper>
				</Grid>
			</Grid>
		);
	}

	addWallet = (newID) => {
		this.setState((prevState) => ({
			wallets: prevState.wallets.concat(newID),
			activeWalletID: newID,
		}));
	};

	updateSendFactoidAmount = (amount) => {
		this.setState((prevState) => ({
			sendFactoidAmount: amount,
		}));
	};

	selectWallet = (walletID) => {
		this.setState((prevState) => ({
			activeWalletID: walletID,
		}));
	};
}
WalletManager.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	root: {
		width: '730px',
		marginTop: '20px',
	},
});

export default withStyles(styles)(WalletManager);
