import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import WhereToVote from '@material-ui/icons/WhereToVoteOutlined';
import AccountBalance from '@material-ui/icons/AccountBalanceOutlined';

class LandingPage extends Component {
	render() {
		const { classes } = this.props;

		return (
			<div className={classes.body}>
				<Typography variant="headline">
					Choose from the options below to get started
				</Typography>
				<br />

				<Button
					className={classes.button}
					component={Link}
					to={'/wallet/manage'}
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

export default withStyles(styles)(LandingPage);
