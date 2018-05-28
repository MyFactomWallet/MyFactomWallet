import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import logo from '../headerLogo.png';
import { Link } from 'react-router-dom';

function ButtonAppBar(props) {
	const { classes } = props;
	return (
		<AppBar position="static" className={classes.root}>
			<Toolbar className={classes.toolbar}>
				<Link to="/">
					<IconButton
						className={classes.menuButton}
						color="inherit"
						aria-label="Menu"
					>
						<img className={classes.logo} src={logo} alt="logo" />
					</IconButton>
				</Link>

				<Typography variant="title" color="inherit" className={classes.flex}>
					<Link className={classes.title} to="/">
						MyFactomWallet
					</Link>
				</Typography>

				<Button href="#/wallet/manage" color="inherit">
					Manage Wallets
				</Button>
				<Button href="#help" color="inherit">
					Help
				</Button>
			</Toolbar>
		</AppBar>
	);
}
ButtonAppBar.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = {
	root: {
		flexGrow: 1,
	},
	toolbar: {
		width: '76%',
		margin: '0 auto',
	},
	flex: {
		flex: 1,
	},
	menuButton: {
		marginLeft: -12,
		marginRight: 20,
	},
	logo: {
		width: '39px',
	},
	title: {
		color: 'white',
	},
};

export default withStyles(styles)(ButtonAppBar);
