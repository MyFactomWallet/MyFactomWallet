import React, { Component } from 'react';
import { Container } from '@material-ui/core/';
import { Grid } from '@material-ui/core/';
import _flowRight from 'lodash/flowRight';
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
			<Container>
				<Grid container justify="center">
					<AddWalletStepper
						handleClose={() => this.props.setReadyToManageWallet(true)}
						handleCloseText={handleCloseText}
					/>
				</Grid>
			</Container>
		);
	}
}
AddInitialWallet.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({});

const enhancer = _flowRight(withNetwork, withWalletContext, withStyles(styles));
export default enhancer(AddInitialWallet);
