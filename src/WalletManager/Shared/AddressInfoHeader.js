import React from 'react';
import _flowRight from 'lodash/flowRight';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { withWalletContext } from '../../Context/WalletContext';
import FormatBalance from './BalanceFormatter.js';
import _isNil from 'lodash/isNil';
import Paper from '@material-ui/core/Paper';

class AddressInfoHeader extends React.Component {
	render() {
		const {
			classes,
			walletController: { getActiveAddress, activeAddressIndex_o },
		} = this.props;
		const activeAddress_o = getActiveAddress();

		return (
			<div className={classes.root}>
				<Paper elevation={2} className={classes.paper}>
					<Typography>
						<i>Nickname:</i>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						{activeAddress_o.nickname}
					</Typography>
					<Typography>
						<i>Address:</i>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						{activeAddress_o.address}
					</Typography>
					{activeAddress_o.importType === 'ledger' && (
						<Typography>
							<i>Import Type:</i>
							&nbsp;&nbsp;&nbsp;Ledger Nano S
						</Typography>
					)}
					{activeAddress_o.importType === 'seed' && (
						<Typography>
							<i>Import Type:</i>
							&nbsp;&nbsp;&nbsp;Seed Phrase
						</Typography>
					)}
					{activeAddress_o.importType === 'standard' && (
						<Typography>
							<i>Import Type:</i>
							&nbsp;&nbsp;&nbsp;Public Address
						</Typography>
					)}
					{!_isNil(activeAddress_o.balance) && (
						<Typography>
							<i>Balance:</i>
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<FormatBalance
								balance={activeAddress_o.balance}
								type={activeAddressIndex_o.type}
							/>
						</Typography>
					)}
				</Paper>
			</div>
		);
	}
}
const styles = (theme) => ({
	root: { textAlign: 'left', marginBottom: 5 },
	paper: { backgroundColor: 'aliceblue', padding: '16px' },
});

const enhancer = _flowRight(withWalletContext, withStyles(styles));

export default enhancer(AddressInfoHeader);
