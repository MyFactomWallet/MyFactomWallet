import React, { Component } from 'react';
import _flowRight from 'lodash/flowRight';
import _isNil from 'lodash/isNil';
import Sidebar from './Sidebar.js';
import WalletTabContent from './WalletTabContent.js';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withWalletContext } from '../context/WalletContext';

class WalletManager extends Component {
	componentDidMount() {
		this.props.walletController.updateBalances();
	}

	render() {
		const {
			walletController: { getActiveAddress, activeAddressIndex_o },
		} = this.props;

		const activeAddress = getActiveAddress();

		return (
			<React.Fragment>
				{!_isNil(activeAddress) && (
					<Grid container spacing={3} item xs={12}>
						<Grid item xs={4}>
							<Sidebar />
						</Grid>

						<Grid item xs={8}>
							<Paper elevation={2}>
								<WalletTabContent
									type={activeAddressIndex_o.type}
									activeAddress={activeAddress}
								/>
							</Paper>
						</Grid>
					</Grid>
				)}
			</React.Fragment>
		);
	}
}
WalletManager.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({});

const enhancer = _flowRight(withWalletContext, withStyles(styles));
export default enhancer(WalletManager);
