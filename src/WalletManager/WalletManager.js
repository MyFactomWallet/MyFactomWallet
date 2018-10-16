import React, { Component } from 'react';
import _flowRight from 'lodash/flowRight';
import Sidebar from './Sidebar.js';
import WalletTabContent from './WalletTabContent.js';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import isEmpty from 'lodash/isEmpty';
import AddWalletStepper from '../AddWallet/AddWalletStepper';
import { withWalletContext } from '../Context/WalletContext';

class WalletManager extends Component {
	render() {
		const { getFctAddresses, getEcAddresses } = this.props.walletController;

		const ecAddresses = getEcAddresses();
		const factoidAddresses = getFctAddresses();

		return (
			<Grid container>
				{!isEmpty(ecAddresses) || !isEmpty(factoidAddresses) ? (
					<Grid container spacing={24} item xs={12}>
						<Grid item xs={4}>
							<Sidebar />
						</Grid>

						<Grid item xs={8}>
							<Paper>
								<WalletTabContent
									hasFactoidWallet={!isEmpty(factoidAddresses)}
								/>
							</Paper>
						</Grid>
					</Grid>
				) : (
					<Grid container item xs={12}>
						<Grid item xs={2} />
						<Grid item xs={8}>
							<AddWalletStepper />
						</Grid>
						<Grid item xs={2} />
					</Grid>
				)}
			</Grid>
		);
	}
}
WalletManager.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({});

const enhancer = _flowRight(withWalletContext, withStyles(styles));
export default enhancer(WalletManager);
