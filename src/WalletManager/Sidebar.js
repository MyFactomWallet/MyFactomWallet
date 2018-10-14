import React, { Component } from 'react';
import _flowRight from 'lodash/flowRight';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AddWalletModal from '../AddWallet/AddWalletModal.js';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {
	FormatFCTBalance,
	FormatECBalance,
} from './Shared/BalanceFormatter.js';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withWalletContext } from '../Context/WalletContext';
import _isEmpty from 'lodash/isEmpty';

class Sidebar extends Component {
	render() {
		const { classes } = this.props;

		const {
			factoidWallets,
			ecWallets,
			activeFctWalletIndex,
			selectFactoidWallet,
		} = this.props.walletController;

		const listFactoidWallets = factoidWallets.map(function(wallet, index) {
			const expanded = activeFctWalletIndex === index;
			const nicknameStyle = expanded ? { fontWeight: 500 } : {};

			return (
				<ExpansionPanel
					key={index}
					expanded={expanded}
					onClick={() => selectFactoidWallet(index)}
					className={expanded ? classes.expanded : ''}
				>
					<ExpansionPanelSummary>
						<Grid container justify="space-between">
							<Grid item>
								<Typography className={classes.break} style={nicknameStyle}>
									{wallet.nickname}
								</Typography>
							</Grid>
							<Grid item>
								<Typography className={classes.break}>
									<FormatFCTBalance balance={wallet.balance} />
								</Typography>
							</Grid>
						</Grid>
					</ExpansionPanelSummary>

					{/* 	<ExpansionPanelDetails>
						<Grid container>
							<Grid item xs={12}>
								<Typography className={classes.break}>
									{wallet.address}
								</Typography>
							</Grid>
						</Grid>
					</ExpansionPanelDetails> */}
				</ExpansionPanel>
			);
		});

		const listECWallets = ecWallets.map(function(wallet, index) {
			return (
				<ListItem divider dense key={index}>
					<Grid container>
						<Grid container item xs={12} justify="space-between">
							<Grid item>{wallet.nickname}</Grid>
							<Grid item>
								<FormatECBalance balance={wallet.balance} />
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<br />
							<Typography className={classes.break}>
								{wallet.address}
							</Typography>
						</Grid>
					</Grid>
				</ListItem>
			);
		});

		return (
			<span>
				<Paper className={classes.noPadding}>
					<List className={classes.addressList}>
						<ListItem className={classes.walletListHeader}>
							<Typography
								className={classes.addressHeading}
								variant="subheading"
							>
								Factoid Addresses
							</Typography>
						</ListItem>
						{!_isEmpty(factoidWallets) ? (
							<ListItem disableGutters className={classes.walletList}>
								<div className={classes.fctRoot}> {listFactoidWallets}</div>
							</ListItem>
						) : (
							<ListItem>
								<Typography color="secondary">
									Please add a Factoid wallet
								</Typography>
							</ListItem>
						)}
					</List>
				</Paper>
				{!_isEmpty(ecWallets) && (
					<span>
						<br />
						<ExpansionPanel defaultExpanded className={classes.addressList}>
							<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
								<Typography
									className={classes.addressHeading}
									variant="subheading"
								>
									Entry Credit Addresses
								</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails className={classes.ecList}>
								<List className={classes.ecRoot}>{listECWallets}</List>
							</ExpansionPanelDetails>
						</ExpansionPanel>
					</span>
				)}
				<br />
				<div className={classes.flex}>
					<br />
					<AddWalletModal />
				</div>
			</span>
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
	ecList: {
		padding: '0px',
		backgroundColor: 'white',
	},
	break: {
		wordWrap: 'break-word',
	},
	expanded: {
		backgroundColor: 'aliceblue',
	},
	fctRoot: {
		width: '100%',
		position: 'relative',
		overflow: 'auto',
		maxHeight: 270,
	},
	ecRoot: {
		width: '100%',
		position: 'relative',
		overflow: 'auto',
		maxHeight: 200,
		paddingBottom: '0px',
	},
	addressHeading: {
		fontWeight: 500,
	},
	headingDivider: {
		borderBottomWidth: '1px',
		borderBottomStyle: 'solid',
		borderBottomColor: theme.palette.primary.light,
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

const enhancer = _flowRight(withWalletContext, withStyles(styles));

export default enhancer(Sidebar);
