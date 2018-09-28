import React, { Component } from 'react';
import Sidebar from '../Sidebar/Sidebar.js';
import WalletTabContent from './WalletTabContent.js';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

class WalletManager extends Component {
	render() {
		const { classes } = this.props;

		return (
			<Grid container spacing={24}>
				<Grid item xs={4}>
					<Sidebar
						addWallet={this.props.addWallet}
						selectWallet={this.props.selectWallet}
						wallets={this.props.wallets}
						activeWalletID={this.props.activeWalletID}
						factoidWallets={this.props.factoidWallets}
						ecWallets={this.props.ecWallets}
					/>
				</Grid>
				<Grid item xs={8} className={classes.root}>
					<Paper>
						<WalletTabContent />
					</Paper>
				</Grid>
			</Grid>
		);
	}
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
