import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import WalletCard from './WalletCard.js';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

class Sidebar extends Component {
	render() {
		const activeWalletID = this.props.activeWalletID;
		const sideBar_o = this;
		const { classes } = this.props;

		const listWallets = this.props.wallets.map(function(walletID, index) {
			const isActive = walletID === activeWalletID ? true : false;

			return (
				<ListItem>
					<Link
						className={classes.fullWidth}
						key={index}
						to={'/wallet/manage/'}
					>
						<WalletCard
							amount={10000}
							onClick={() => sideBar_o.props.selectWallet(walletID)}
							active={isActive}
							id={walletID}
						/>
					</Link>
				</ListItem>
			);
		});

		return (
			<List className={classes.addNew}>
				{listWallets}
				<ListItem>
					<Button
						className={classes.fullWidth}
						variant="outlined"
						size="large"
						onClick={() => this.props.addWallet(this.props.wallets.length + 1)}
					>
						+ New Wallet
					</Button>
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
	addNew: {
		paddingLeft: '10px',
	},
};

export default withStyles(styles)(Sidebar);
