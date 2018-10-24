import React, { Component } from 'react';
import _flowRight from 'lodash/flowRight';
import _isNil from 'lodash/isNil';
import Sidebar from './Sidebar.js';
import WalletTabContent from './WalletTabContent.js';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withWalletContext } from '../Context/WalletContext';
import { Redirect } from 'react-router-dom';

class WalletManager extends Component {
	componentDidMount() {
		this.props.walletController.updateBalances();
	}

	render() {
		const {
			walletController: {
				getActiveAddress,
				activeAddressIndex_o,
				isWalletEmpty,
			},
		} = this.props;

		return (
			<Grid container>
				{isWalletEmpty() ? (
					<Redirect to="/wallet/add/" />
				) : (
					!_isNil(getActiveAddress()) && (
						<Grid container spacing={24} item xs={12}>
							<Grid item xs={4}>
								<Sidebar />
							</Grid>

							<Grid item xs={8}>
								<Paper>
									<WalletTabContent type={activeAddressIndex_o.type} />
								</Paper>
							</Grid>
						</Grid>
					)
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
