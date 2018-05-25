import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

class LandingPage extends Component {
	render() {
		const { classes } = this.props;

		return (
			<div className={classes.body}>
				<div />
				<Typography variant="headline">
					Choose from the options below to get started
				</Typography>
				<br />
				<Button
					className={classes.button}
					component={Link}
					to={'/createwallet'}
					variant="outlined"
					color="primary"
				>
					Create New Wallet
				</Button>
				<br />
				<Button
					className={classes.button}
					component={Link}
					to={'/wallet/manage/'}
					variant="outlined"
					color="primary"
				>
					Import Wallet
				</Button>
				<br />
				<Button
					className={classes.button}
					component={Link}
					to={'/vote/'}
					variant="outlined"
					color="secondary"
				>
					Vote
				</Button>
				<Typography variant="caption">
					If you aren't sure which option to pick, please consult our
					<a href="#Help"> help guide.</a>
				</Typography>
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
		width: '277px;',
		height: '50px',
		marginBottom: '15px',
	},
});

export default withStyles(styles)(LandingPage);
