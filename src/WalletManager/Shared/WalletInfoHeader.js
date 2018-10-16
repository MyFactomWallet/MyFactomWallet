import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { FormatFCTBalance } from './BalanceFormatter.js';
import _isNil from 'lodash/isNil';
import Paper from '@material-ui/core/Paper';

class WalletInfoHeader extends React.Component {
	render() {
		const { classes } = this.props;
		const wallet = this.props.wallet;

		return (
			<div className={classes.root}>
				<Paper elevation={2} className={classes.paper}>
					<Typography>
						<i>Nickname:</i>
						&nbsp;&nbsp;
						{wallet.nickname}
					</Typography>
					{wallet.type === 'ledger' && (
						<Typography>
							<i>Type:</i>
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							{wallet.type}
						</Typography>
					)}
					<Typography>
						<i>Address:</i>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						{wallet.address}
					</Typography>
					{!_isNil(wallet.balance) && (
						<Typography>
							<i>Balance:</i>
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<FormatFCTBalance balance={wallet.balance} />
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
export default withStyles(styles)(WalletInfoHeader);
