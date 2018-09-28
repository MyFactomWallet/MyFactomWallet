import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import WalletCard from './WalletCard.js';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AddWalletModal from '../AddWallet/AddWalletModal.js';

class Sidebar extends Component {
	render() {
		const sideBar_o = this;
		const { classes } = sideBar_o.props;
		const activeWalletID = sideBar_o.props.activeWalletID;

		const listFactoidWallets = sideBar_o.props.factoidWallets.map(function(
			wallet,
			index
		) {
			//const walletID = wallet.id;
			//const isActive = walletID === activeWalletID ? true : false;
			const walletID = 1;
			const isActive = true;
			return (
				<ListItem key={index}>
					<Link className={classes.fullWidth} to={'/wallet/manage/'}>
						<WalletCard
							onClick={() => sideBar_o.props.selectWallet(walletID)}
							active={isActive}
							balance={wallet.nickname}
							id={walletID}
							public_address={wallet.address}
						/>
					</Link>
				</ListItem>
			);
		});
		/*
		const listWallets = this.props.wallets.map(function(wallet, index) {
			const walletID = wallet.id;

			const isActive = walletID === activeWalletID ? true : false;

			return (
				<ListItem key={index}>
					<Link className={classes.fullWidth} to={'/wallet/manage/'}>
						<WalletCard
							onClick={() => sideBar_o.props.selectWallet(walletID)}
							active={isActive}
							balance={wallet.balance}
							id={walletID}
							public_address={wallet.public_address}
						/>
					</Link>
				</ListItem>
			);
		});
*/
		return (
			<List className={classes.fullWidth}>
				{listFactoidWallets}
				{/* listWallets */}
				<ListItem>
					<AddWalletModal addWallet={this.props.addWallet} />
				</ListItem>
			</List>
		);
	}
}
Sidebar.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = {
	fullWidth: {
		width: '100%',
	},
};

export default withStyles(styles)(Sidebar);
