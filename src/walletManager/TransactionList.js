import React from 'react';
import _flowRight from 'lodash/flowRight';
import _isEmpty from 'lodash/isEmpty';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { withWalletContext } from '../context/WalletContext';
import { withNetwork } from '../context/NetworkContext';
import Typography from '@material-ui/core/Typography';
import OpenInNew from '@material-ui/icons/OpenInNew';
import Tooltip from '@material-ui/core/Tooltip';

class TransactionList extends React.Component {
	render() {
		const {
			classes,
			walletController: { getActiveAddress },
			networkController: { networkProps },
		} = this.props;

		const activeAddress_o = getActiveAddress();

		return (
			<>
				{!_isEmpty(activeAddress_o.transactions) && (
					<>
						<Typography variant="h6">Recent Transactions</Typography>
						{activeAddress_o.transactions.map(function(transaction, index) {
							return (
								<Typography
									key={index}
									gutterBottom
									className={classes.transaction}
								>
									<b>Tx ID:</b> {transaction}{' '}
									<Tooltip title="Open Factom Explorer">
										<a
											target="_blank"
											rel="noopener noreferrer"
											href={
												networkProps.explorerURL +
												'/transaction?txid=' +
												transaction
											}
										>
											<OpenInNew color="primary" style={{ fontSize: 15 }} />
										</a>
									</Tooltip>
								</Typography>
							);
						})}
					</>
				)}
			</>
		);
	}
}

TransactionList.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	transaction: { overflowWrap: 'break-word' },
});

const enhancer = _flowRight(withNetwork, withWalletContext, withStyles(styles));

export default enhancer(TransactionList);
