import React from 'react';
import _flowRight from 'lodash/flowRight';
import _isEmpty from 'lodash/isEmpty';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { withWalletContext } from '../Context/WalletContext';
import Typography from '@material-ui/core/Typography';

class TransactionList extends React.Component {
	render() {
		const {
			classes,
			walletController: { getActiveAddress },
		} = this.props;

		const activeAddress_o = getActiveAddress();

		return (
			<React.Fragment>
				{!_isEmpty(activeAddress_o.transactions) && (
					<React.Fragment>
						<Typography variant="h6">Recent Transactions</Typography>
						{activeAddress_o.transactions.map(function(transaction, index) {
							return (
								<Typography
									key={index}
									gutterBottom
									className={classes.transaction}
								>
									<b>Tx ID:</b> {transaction}
								</Typography>
							);
						})}
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}

TransactionList.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	transaction: { overflowWrap: 'break-word' },
});

const enhancer = _flowRight(withWalletContext, withStyles(styles));

export default enhancer(TransactionList);
