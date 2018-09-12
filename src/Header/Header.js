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
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMore from '@material-ui/icons/ExpandMore';
import CloudDone from '@material-ui/icons/CloudDoneOutlined';
import CloudOff from '@material-ui/icons/CloudOff';

class ButtonAppBar extends React.Component {
	state = {
		voteAnchorEl: null,
		networkAnchorEl: null,
		network: 'Mainnet',
	};

	handleVoteClick = (event) => {
		this.setState({ voteAnchorEl: event.currentTarget });
	};

	handleVoteClose = () => {
		this.setState({ voteAnchorEl: null });
	};

	handleNetworkClick = (event) => {
		this.setState({ networkAnchorEl: event.currentTarget });
	};

	handleNetworkClose = () => {
		this.setState({ networkAnchorEl: null });
	};

	handleTestnet = () => {
		this.setState({
			networkAnchorEl: null,
			network: 'Testnet',
		});
	};

	handleMainnet = () => {
		this.setState({
			networkAnchorEl: null,
			network: 'Mainnet',
		});
	};

	render() {
		const { classes } = this.props;
		const { voteAnchorEl, networkAnchorEl } = this.state;
		const operational = this.state.network === 'Mainnet' ? 'green' : 'red';

		return (
			<AppBar position="static" className={classes.root}>
				<Toolbar className={classes.toolbar}>
					<IconButton
						className={classes.menuButton}
						color="inherit"
						aria-label="Menu"
					>
						<Link to="/">
							<img className={classes.logo} src={logo} alt="logo" />
						</Link>
					</IconButton>

					<Typography variant="title" className={classes.flex}>
						<Link className={classes.menuText} to="/">
							MyFactomWallet
						</Link>
					</Typography>
					<div>
						<Button
							aria-owns={voteAnchorEl ? 'simple-vote-menu' : null}
							aria-haspopup="true"
							onClick={this.handleVoteClick}
							className={classes.menuText}
						>
							Vote
							<ExpandMore />
						</Button>
						<Menu
							id="simple-vote-menu"
							anchorEl={voteAnchorEl}
							open={Boolean(voteAnchorEl)}
							onClose={this.handleVoteClose}
						>
							<MenuItem
								onClick={this.handleVoteClose}
								component={Link}
								to={'/vote'}
							>
								View Polls
							</MenuItem>
							<MenuItem
								component={Link}
								to={'/createVote'}
								onClick={this.handleVoteClose}
							>
								Create Poll
							</MenuItem>
							{/*	<MenuItem
								component={Link}
								to={'/manageVoters'}
								onClick={this.handleVoteClose}
							>
								Manage Voter List
							</MenuItem>*/}
						</Menu>
					</div>
					<Button href="#/wallet/manage" className={classes.menuText}>
						Wallet
					</Button>
					<Button href="#help" className={classes.menuText}>
						Help
					</Button>
					<div className={classes.network} style={{ color: operational }}>
						<Typography
							aria-owns={networkAnchorEl ? 'simple-vote-menu' : null}
							aria-haspopup="true"
							onClick={this.handleNetworkClick}
							className={classes.menuText}
						>
							Network: {this.state.network}
							&nbsp;
							{this.state.network === 'Mainnet' && (
								<CloudDone
									titleAccess="Network Operational"
									style={{
										color: 'green',
										top: '5px',
										position: 'relative',
									}}
								/>
							)}
							{this.state.network === 'Testnet' && (
								<CloudOff
									titleAccess="Network Down"
									style={{
										color: 'red',
										top: '5px',
										position: 'relative',
									}}
								/>
							)}
							<ExpandMore
								style={{
									top: '5px',
									position: 'relative',
								}}
							/>
						</Typography>
						<Menu
							id="simple-vote-menu"
							anchorEl={networkAnchorEl}
							open={Boolean(networkAnchorEl)}
							onClose={this.handleNetworkClose}
						>
							<MenuItem onClick={this.handleMainnet}>
								Mainnet&nbsp;&nbsp; <CloudDone style={{ color: 'green' }} />
							</MenuItem>
							<MenuItem onClick={this.handleTestnet}>
								Testnet&nbsp;&nbsp; <CloudOff style={{ color: 'red' }} />
							</MenuItem>
							<MenuItem onClick={this.handleNetworkClose}>Custom Node</MenuItem>
						</Menu>
					</div>
				</Toolbar>
			</AppBar>
		);
	}
}
ButtonAppBar.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = {
	root: {
		flexGrow: 1,
		marginBottom: '15px',
	},
	toolbar: {
		width: '90%',
		margin: '0 auto',
	},
	flex: {
		flex: 1,
	},
	menuButton: {
		marginTop: 3,
		marginRight: 10,
	},
	logo: {
		width: '39px',
	},
	menuText: {
		color: 'white',
	},
	network: {
		padding: '5px',
		borderStyle: 'solid',
		borderWidth: '1px',
		color: 'white',
		paddingTop: '0px',
	},
	subMenuText: {
		color: 'black',
	},
};

export default withStyles(styles)(ButtonAppBar);
