import React, { Component } from 'react';
import _flowRight from 'lodash/flowRight';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withWalletContext } from '../Context/WalletContext';
import AddWalletStepper from './AddWalletStepper';

class AddInitialWallet extends Component {
	navigateToWallet = () => {
		this.props.history.push('/wallet/manage/');
	};

	render() {
		return (
			<Grid container item xs={12} justify="center">
				<AddWalletStepper
					handleClose={this.navigateToWallet}
					handleCloseText="Manage Wallets"
				/>
			</Grid>
		);
	}
}
AddInitialWallet.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({});

const enhancer = _flowRight(withWalletContext, withStyles(styles));
export default enhancer(AddInitialWallet);
