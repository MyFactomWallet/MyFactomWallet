import React, { Component } from 'react';
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

class Sidebar extends Component {
	render() {
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
		} = this.props;

		const ecAddresses = getEntryCreditAddresses();
		const factoidAddresses = getFactoidAddresses();

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
					<ExpansionPanelSummary>
						<Grid container justify="space-between">
							<Grid item>
								<Typography className={classes.break} style={nicknameStyle}>
									{wallet.nickname}
								</Typography>
							</Grid>
							{!_isNil(wallet.balance) && (
								<Grid item>
									<Typography className={classes.break}>
										<FormatBalance balance={wallet.balance} type="fct" />
									</Typography>
								</Grid>
							)}
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
					<ExpansionPanelSummary>
						<Grid container item xs={12} justify="space-between">
							<Grid item>
								<Typography className={classes.break} style={nicknameStyle}>
									{wallet.nickname}
								</Typography>
							</Grid>
							{!_isNil(wallet.balance) && (
								<Grid item>
									<Typography className={classes.break}>
										<FormatBalance balance={wallet.balance} type="ec" />
									</Typography>
								</Grid>
							)}
						</Grid>
					</ExpansionPanelSummary>
				</ExpansionPanel>
			);
		});

		return (
			<React.Fragment>
				{!_isEmpty(factoidAddresses) && (
					<Paper className={classes.noPadding}>
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
								<div className={classes.listAddrRoot}>
									{listfactoidAddresses}
								</div>
							</ListItem>
						</List>
					</Paper>
				)}
				{!_isEmpty(ecAddresses) && (
					<React.Fragment>
						{!_isEmpty(factoidAddresses) && <br />}
						<Paper className={classes.noPadding}>
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
									<div className={classes.listAddrRoot}>{listecAddresses}</div>
								</ListItem>
							</List>
						</Paper>
					</React.Fragment>
				)}
				<br />
				<div className={classes.flex}>
					<br />
					<AddWalletModal />
				</div>
			</React.Fragment>
		);
	}
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
	listAddrRoot: {
		width: '100%',
		position: 'relative',
		overflow: 'auto',
		maxHeight: 270,
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

const enhancer = _flowRight(withNetwork, withWalletContext, withStyles(styles));

export default enhancer(Sidebar);
