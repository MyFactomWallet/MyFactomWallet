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
		const { classes } = this.props;

		const activeWalletID = this.props.activeWalletID;
		const sideBar_o = this;

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

		return (
			<List className={classes.fullWidth}>
				{listWallets}
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
