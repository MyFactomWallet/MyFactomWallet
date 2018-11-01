import React, { Component } from 'react';
import _isNil from 'lodash/isNil';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import WhereToVote from '@material-ui/icons/WhereToVoteOutlined';
import AccountBalance from '@material-ui/icons/AccountBalanceOutlined';
import { withWalletContext } from '../context/WalletContext';

class LandingPage extends Component {
	render() {
		const { classes } = this.props;
		const { getActiveAddress } = this.props.walletController;

		const walletPath = _isNil(getActiveAddress()) ? '/wallet/add' : '/';
		//: '/wallet/manage';

		return (
			<div className={classes.body}>
				<Typography variant="h5">
					Choose from the options below to get started
				</Typography>
				<br />

				<Button
					className={classes.button}
					component={Link}
					to={walletPath}
					variant="outlined"
					color="primary"
				>
					Factom Wallet&nbsp;&nbsp;
					<AccountBalance />
				</Button>
				<br />
				<Button
					className={classes.button}
					component={Link}
					to={'/vote'}
					variant="outlined"
					color="primary"
				>
					Factom Vote&nbsp;
					<WhereToVote />
				</Button>
				<br />

				{/* <Typography variant="caption">
					If you aren't sure which option to pick, please consult our
					<a href="#Help"> help guide.</a>
				</Typography> */}
			</div>
		);
	}
}
LandingPage.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	body: {
		textAlign: 'center',
		width: '715px',
		margin: '0 auto',
		marginTop: '20px',
	},
	button: {
		width: '275px;',
		height: '50px',
		marginBottom: '15px',
	},
});

export default withWalletContext(withStyles(styles)(LandingPage));
