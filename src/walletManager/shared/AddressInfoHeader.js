import React from 'react';
import _flowRight from 'lodash/flowRight';
import _isNil from 'lodash/isNil';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import SvgIcon from '@material-ui/core/SvgIcon';
import FormatBalance from './BalanceFormatter.js';
import { withWalletContext } from '../../context/WalletContext';
import { withLedger } from '../../context/LedgerContext';
import Tooltip from '@material-ui/core/Tooltip';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import LedgerLogo from '../../component/logo/ledgerLogo.svg';
import { SVGLogo } from '../../component/logo/SVGLogo';

const AddressInfoHeader = (props) => {
	const {
		classes,
		walletController: { getActiveAddress, activeAddressIndex_o },
		ledgerController: { checkAddress },
	} = props;

	const activeAddress_o = getActiveAddress();

	return (
		<Paper className={classes.paper}>
			<Grid container justify="space-between">
				<Grid item>
					<Typography
						data-cy="addressNickname"
						className={classes.bold}
						gutterBottom
					>
						{activeAddress_o.nickname}
					</Typography>
					{!_isNil(activeAddress_o.balance) && (
						<Typography data-cy="balance" variant="h4">
							<FormatBalance
								balance={activeAddress_o.balance}
								type={activeAddressIndex_o.type}
							/>
						</Typography>
					)}
					<Typography data-cy="address">
						{activeAddress_o.address}
						<CopyToClipboard text={activeAddress_o.address}>
							<Tooltip title="Copy" className={classes.pointer}>
								<SvgIcon fontSize="inherit" color="primary">
									<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
								</SvgIcon>
							</Tooltip>
						</CopyToClipboard>
					</Typography>
				</Grid>
				<Grid item>
					{activeAddress_o.importType === 'ledger' && (
						<Tooltip
							title="Verify Ledger Nano X/S Address"
							className={classes.pointer}
						>
							<div className={classes.logoBackground}>
								<SVGLogo
									className={classes.logo}
									src={LedgerLogo}
									alt="Ledger Logo"
									onClick={async () => {
										await checkAddress(
											activeAddress_o,
											activeAddressIndex_o.type
										);
									}}
								/>
							</div>
						</Tooltip>
					)}
				</Grid>
			</Grid>
		</Paper>
	);
};
const styles = () => ({
	ledgerLogo: {
		height: 15,
		opacity: '62%',
	},
	sidebarIcon: {
		height: 16,
		opacity: '62%',
	},
	paper: {
		textAlign: 'left',
		backgroundColor: 'aliceblue',
		padding: '16px',
		marginBottom: '3px',
		boxShadow:
			'inset 0px 0px 5px 0px rgba(0,0,0,0.2), inset 0px 0px 2px 0px rgba(0,0,0,0.14), inset 0px 0px 1px -2px rgba(0,0,0,0.12)',
	},
	pointer: {
		cursor: 'pointer',
	},
	logo: { height: 15 },
	logoBackground: {
		background: '#3f51b545',
		padding: '10px',
		borderRadius: '50%',
		paddingBottom: '5px',
	},
	bold: { fontWeight: 500 },
});

const enhancer = _flowRight(withWalletContext, withLedger, withStyles(styles));

export default enhancer(AddressInfoHeader);
