import React from 'react';
import _flowRight from 'lodash/flowRight';
import _isNil from 'lodash/isNil';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AddWalletModal from '../addWallet/AddWalletModal.js';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormatBalance from './shared/BalanceFormatter.js';
import { withWalletContext } from '../context/WalletContext';
import { withNetwork } from '../context/NetworkContext';
import _isEmpty from 'lodash/isEmpty';
import ledgerLogo from '../component/logo/ledgerLogo.svg';
import { GiAcorn } from 'react-icons/gi';
import { IoIosKey } from 'react-icons/io';

function Sidebar(props) {
	const {
		classes,
		walletController: {
			getEntryCreditAddresses,
			getFactoidAddresses,
			activeAddressIndex_o,
			selectAddress,
			updateBalances,
		},
		networkController: { networkProps },
	} = props;

	const ecAddresses = getEntryCreditAddresses();
	const factoidAddresses = getFactoidAddresses();

	const addressContainer = { paddingRight: '0px' };

	const listfactoidAddresses = factoidAddresses.map(function(wallet, index) {
		const expanded =
			activeAddressIndex_o.index === index &&
			activeAddressIndex_o.type === 'fct';
		const nicknameStyle = expanded ? { fontWeight: 500 } : {};

		return (
			<ExpansionPanel
				key={index}
				expanded={expanded}
				onClick={async () => {
					await selectAddress(index, 'fct');
					updateBalances();
				}}
				className={expanded ? classes.expanded : ''}
			>
				<ExpansionPanelSummary className={classes.addressSummary}>
					<Grid container justify="space-between" style={addressContainer}>
						<Grid item xs={6}>
							<Typography className={classes.break} style={nicknameStyle}>
								{wallet.nickname}
							</Typography>
						</Grid>
						{!_isNil(wallet.balance) && (
							<Grid item xs={5}>
								<Typography className={classes.break}>
									<FormatBalance balance={wallet.balance} type="fct" />
								</Typography>
							</Grid>
						)}
						<StyledAddressIcon importType={wallet.importType} />
					</Grid>
				</ExpansionPanelSummary>
			</ExpansionPanel>
		);
	});

	const listecAddresses = ecAddresses.map(function(wallet, index) {
		const expanded =
			activeAddressIndex_o.index === index &&
			activeAddressIndex_o.type === 'ec';

		const nicknameStyle = expanded ? { fontWeight: 500 } : {};

		return (
			<ExpansionPanel
				key={index}
				expanded={expanded}
				onClick={async () => {
					await selectAddress(index, 'ec');
					updateBalances();
				}}
				className={expanded ? classes.expanded : ''}
			>
				<ExpansionPanelSummary className={classes.addressSummary}>
					<Grid container justify="space-between" style={addressContainer}>
						<Grid item xs={6}>
							<Typography className={classes.break} style={nicknameStyle}>
								{wallet.nickname}
							</Typography>
						</Grid>
						{!_isNil(wallet.balance) && (
							<Grid item xs={5}>
								<Typography className={classes.break}>
									<FormatBalance balance={wallet.balance} type="ec" />
								</Typography>
							</Grid>
						)}
						<StyledAddressIcon importType={wallet.importType} />
					</Grid>
				</ExpansionPanelSummary>
			</ExpansionPanel>
		);
	});

	return (
		<>
			{!_isEmpty(factoidAddresses) && (
				<Paper className={classes.noPadding} elevation={2}>
					<List className={classes.addressList}>
						<ListItem className={classes.walletListHeader}>
							<Typography
								className={classes.addressHeading}
								variant="subtitle1"
							>
								{networkProps.factoidAbbreviationFull + ' Addresses'}
							</Typography>
						</ListItem>

						<ListItem disableGutters className={classes.walletList}>
							<div data-cy="fctAddressList" className={classes.listAddrRoot}>
								{listfactoidAddresses}
							</div>
						</ListItem>
					</List>
				</Paper>
			)}
			{!_isEmpty(ecAddresses) && (
				<>
					{!_isEmpty(factoidAddresses) && <br />}
					<Paper className={classes.noPadding} elevation={2}>
						<List className={classes.addressList}>
							<ListItem className={classes.walletListHeader}>
								<Typography
									className={classes.addressHeading}
									variant="subtitle1"
								>
									{networkProps.ecAbbreviationFull + ' Addresses'}
								</Typography>
							</ListItem>
							<ListItem disableGutters className={classes.walletList}>
								<div data-cy="ecAddressList" className={classes.listAddrRoot}>
									{listecAddresses}
								</div>
							</ListItem>
						</List>
					</Paper>
				</>
			)}
			<br />
			<div className={classes.flex}>
				<br />
				<AddWalletModal />
			</div>
		</>
	);
}
Sidebar.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	noPadding: {
		padding: '0px',
	},
	break: {
		wordWrap: 'break-word',
	},
	expanded: {
		backgroundColor: 'aliceblue',
	},
	iconContainer: {
		paddingTop: '2px',
	},
	listAddrRoot: {
		width: '100%',
		position: 'relative',
		overflow: 'auto',
		maxHeight: 270,
	},
	addressSummary: {
		padding: '0 0 0 24px',
	},
	addressHeading: {
		fontWeight: 500,
	},
	flex: {
		display: 'flex',
	},
	walletList: {
		padding: '6px',
	},
	walletListHeader: {
		paddingTop: '5px',
		paddingBottom: '5px',
	},
	addressList: {
		paddingBottom: '0px',
		backgroundColor: '#ddd',
		borderRadius: '4px',
	},
});

const AddressIcon = (props) => {
	const { classes, importType } = props;

	return (
		<Grid item xs={1} className={classes.iconContainer}>
			{importType === 'seed' && <GiAcorn className={classes.sidebarIcon} />}
			{importType === 'ledger' && (
				<img
					className={classes.ledgerLogo}
					src={ledgerLogo}
					alt="ledger icon"
				/>
			)}
			{importType === 'standard' && (
				<IoIosKey className={classes.sidebarIcon} />
			)}
		</Grid>
	);
};

const StyledAddressIcon = withStyles({
	ledgerLogo: {
		height: 15,
		opacity: '62%',
	},
	sidebarIcon: {
		height: 16,
		opacity: '62%',
	},
})(AddressIcon);

const enhancer = _flowRight(withNetwork, withWalletContext, withStyles(styles));

export default enhancer(Sidebar);
