import React, { Component } from 'react';
import _flowRight from 'lodash/flowRight';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withWalletContext } from '../context/WalletContext';
import { withNetwork } from '../context/NetworkContext';
import AddWalletStepper from './AddWalletStepper';

class AddInitialWallet extends Component {
	componentDidMount() {
		this.props.setReadyToManageWallet(false);
	}

	render() {
		const {
			networkController: { networkProps },
		} = this.props;

		const handleCloseText =
			networkProps.network === 'testnet'
				? 'Manage Testnet Wallet'
				: 'Manage Wallet';

		return (
			<Grid container item xs={12} justify="center">
				<AddWalletStepper
					handleClose={() => this.props.setReadyToManageWallet(true)}
					handleCloseText={handleCloseText}
				/>
			</Grid>
		);
	}
}
AddInitialWallet.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({});

const enhancer = _flowRight(withNetwork, withWalletContext, withStyles(styles));
export default enhancer(AddInitialWallet);
