import React from 'react';
import _flowRight from 'lodash/flowRight';
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
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import CustomNodeForm from './CustomNodeForm';
import Modal from '@material-ui/core/Modal';
import { withWalletContext } from '../context/WalletContext';
import { withNetwork } from '../context/NetworkContext';
import { withFactomCli } from '../context/FactomCliContext';
import HelpModal from './HelpModal';

class Header extends React.Component {
	state = {
		networkAnchorEl: null,
		openCustomNodeForm: false,
	};

	handleOpenCustomNodeForm = () => {
		this.setState({ openCustomNodeForm: true });
	};

	handleCloseCustomNodeForm = () => {
		this.setState({ openCustomNodeForm: false });
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
		});
		this.props.walletController.handleNetworkChange('testnet');
	};

	handleMainnet = () => {
		this.setState({
			networkAnchorEl: null,
		});
		this.props.walletController.handleNetworkChange('mainnet');
	};

	handleWallet = () => {
		if (
			!this.props.walletController.readyToManageWallet &&
			!this.props.walletController.isWalletEmpty()
		) {
			this.props.walletController.setReadyToManageWallet(true);
		}
	};

	handleCustomNode = (host, port) => {
		/* this.setState({
			network: host + ':' + port,
		}); */
		this.handleCloseCustomNodeForm();
	};

	render() {
		const {
			classes,
			networkController: { networkProps },
			factomCliController: { isConnected, error, blockHeight },
			disabled,
			greenConnection,
		} = this.props;
		const { networkAnchorEl } = this.state;

		const testnetActive = networkProps.network === 'testnet';

		return (
			<AppBar position="static" className={classes.root} data-cy="appBarHeader">
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

					<Typography variant="h6" className={classes.flex}>
						<Link className={classes.menuText} to="/">
							MyFactomWallet
							{testnetActive && (
								<span className={classes.testnetHeader} data-cy="testnetHeader">
									&nbsp;&nbsp;TESTNET
								</span>
							)}
						</Link>
					</Typography>
					<Link to="/">
						<Button
							onClick={() => {
								if (!disabled) this.handleWallet();
							}}
							className={classes.menuText}
						>
							Wallet
						</Button>
					</Link>

					<HelpModal />
					<Button
						aria-owns={networkAnchorEl ? 'simple-anchor-menu' : null}
						aria-haspopup="true"
						onClick={(e) => {
							if (!disabled) this.handleNetworkClick(e);
						}}
						className={testnetActive ? classes.testnetHeader : classes.menuText}
					>
						{blockHeight ? (
							<span data-cy="blockHeight">{blockHeight}</span>
						) : (
							<div style={{ width: 48 }} />
						)}
						&nbsp;
						{(isConnected && !error) || greenConnection ? (
							<FiberManualRecord
								titleAccess="Network Operational"
								className={classes.connected}
							/>
						) : (
							<>
								?&nbsp;
								<FiberManualRecord
									titleAccess="Network Unavailable"
									className={classes.notConnected}
								/>
							</>
						)}
					</Button>
					<Menu
						id="simple-anchor-menu"
						anchorEl={networkAnchorEl}
						open={Boolean(networkAnchorEl)}
						onClose={this.handleNetworkClose}
					>
						<MenuItem onClick={this.handleMainnet} disabled={!testnetActive}>
							Connect to Mainnet
						</MenuItem>
						<MenuItem onClick={this.handleTestnet} disabled={testnetActive}>
							Connect to Testnet
						</MenuItem>
						{/* <MenuItem
								onClick={() => {
									this.handleNetworkClose();
									this.handleOpenCustomNodeForm();
								}}
							>
								Custom Node
							</MenuItem> */}
					</Menu>
					<Modal
						aria-labelledby="simple-modal-title"
						aria-describedby="simple-modal-description"
						open={this.state.openCustomNodeForm}
						onClose={this.handleCloseCustomNodeForm}
					>
						<div className={classes.modalContent}>
							<CustomNodeForm handleCustomNode={this.handleCustomNode} />
						</div>
					</Modal>
				</Toolbar>
			</AppBar>
		);
	}
}
Header.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
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

	subMenuText: {
		color: 'black',
	},
	modalContent: {
		position: 'absolute',
		width: theme.spacing(50),
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(4),
		top: `50%`,
		left: `50%`,
		transform: `translate(-50%, -50%)`,
	},
	testnetHeader: { color: '#ffa000' },
	connected: { color: '#0ec30e' },
	notConnected: { color: 'red' },
});

const enhancer = _flowRight(
	withNetwork,
	withFactomCli,
	withWalletContext,
	withStyles(styles)
);
export default enhancer(Header);
