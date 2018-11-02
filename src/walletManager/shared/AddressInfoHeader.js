import React from 'react';
import _flowRight from 'lodash/flowRight';
import _isNil from 'lodash/isNil';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import VerifiedUser from '@material-ui/icons/VerifiedUser';
import Grid from '@material-ui/core/Grid';
import SvgIcon from '@material-ui/core/SvgIcon';
import FormatBalance from './BalanceFormatter.js';
import { withWalletContext } from '../../context/WalletContext';
import { withLedger } from '../../context/LedgerContext';
import Tooltip from '@material-ui/core/Tooltip';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const AddressInfoHeader = (props) => {
	const {
		classes,
		walletController: { getActiveAddress, activeAddressIndex_o },
		ledgerController: { checkAddress },
	} = props;

	const activeAddress_o = getActiveAddress();

	return (
		<div className={classes.root}>
			<Paper elevation={2} className={classes.paper}>
				<Grid container justify="space-between">
					<Grid item>
						<Typography>
							<i>Nickname:</i>
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							{activeAddress_o.nickname}
						</Typography>
						<Typography>
							<i>Address:</i>
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							{activeAddress_o.address}
							&nbsp;
							<CopyToClipboard text={activeAddress_o.address}>
								<Tooltip title="Copy" className={classes.pointer}>
									<SvgIcon fontSize="inherit" color="primary">
										<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
									</SvgIcon>
								</Tooltip>
							</CopyToClipboard>
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
					</Grid>
					<Grid item>
						{activeAddress_o.importType === 'ledger' && (
							<Tooltip
								title="Verify Ledger Nano S Address"
								className={classes.pointer}
							>
								<VerifiedUser
									onClick={async () => {
										await checkAddress(
											activeAddress_o,
											activeAddressIndex_o.type
										);
									}}
								/>
							</Tooltip>
						)}
					</Grid>
				</Grid>
			</Paper>
		</div>
	);
};
const styles = (theme) => ({
	root: { textAlign: 'left' },
	paper: { backgroundColor: 'aliceblue', padding: '16px', marginBottom: '3px' },
	pointer: {
		cursor: 'pointer',
	},
});

const enhancer = _flowRight(withWalletContext, withLedger, withStyles(styles));

export default enhancer(AddressInfoHeader);
