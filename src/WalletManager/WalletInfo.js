import React from 'react';
import _flowRight from 'lodash/flowRight';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { withWalletContext } from '../Context/WalletContext';
import Typography from '@material-ui/core/Typography';
import WalletInfoHeader from './Shared/WalletInfoHeader';

import isEmpty from 'lodash/isEmpty';

const WalletInfo = (props) => {
	const { classes } = props;

	const { getActiveFctWallet } = props.walletController;
	const activeFctWallet = getActiveFctWallet();

	return (
		<div>
			<WalletInfoHeader wallet={activeFctWallet} />
			<br />
			{!isEmpty(activeFctWallet.transactions) ? (
				<div className={classes.root}>
					<Typography>Your Recent Transactions</Typography>
					{activeFctWallet.transactions.map(function(transaction, index) {
						return (
							<div key={index}>
								<Typography>
									<b>Tx ID:</b> {transaction}
								</Typography>
							</div>
						);
					})}
				</div>
			) : (
				<div>No Recent Transactions</div>
			)}
		</div>
	);
};

WalletInfo.propTypes = {
	classes: PropTypes.object.isRequired,
};
const styles = { root: { textAlign: 'left' } };

const enhancer = _flowRight(withWalletContext, withStyles(styles));

export default enhancer(WalletInfo);
