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
import ExpandMore from '@material-ui/icons/ExpandMore';
import CloudDone from '@material-ui/icons/CloudDoneOutlined';
import CustomNodeForm from './CustomNodeForm';
import Modal from '@material-ui/core/Modal';
import { withWalletContext } from '../context/WalletContext';
import { withNetwork } from '../context/NetworkContext';
import { withFactomCli } from '../context/FactomCliContext';
import HelpModal from './HelpModal';

//import CloudOff from '@material-ui/icons/CloudOff';

class ButtonAppBar extends React.Component {
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
			factomCliController: { blockHeight },
		} = this.props;
		const { networkAnchorEl } = this.state;

		const testnetActive = networkProps.network === 'testnet';

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

					<Typography variant="h6" className={classes.flex}>
						<Link className={classes.menuText} to="/">
							MyFactomWallet
							{testnetActive && (
								<span className={classes.testnetHeader}>
									&nbsp;&nbsp;TESTNET
								</span>
							)}
						</Link>
					</Typography>
					<Button
						href="#/"
						onClick={this.handleWallet}
						className={classes.menuText}
					>
						Wallet
					</Button>
					<HelpModal />
					<div className={classes.network}>
						<Button
							aria-owns={networkAnchorEl ? 'simple-anchor-menu' : null}
							aria-haspopup="true"
							onClick={this.handleNetworkClick}
							className={classes.menuText}
						>
							{networkProps.network}: {blockHeight}
							&nbsp;
							<CloudDone
								titleAccess="Network Operational"
								style={{ color: 'green' }}
							/>
							<ExpandMore />
						</Button>
						<Menu
							id="simple-anchor-menu"
							anchorEl={networkAnchorEl}
							open={Boolean(networkAnchorEl)}
							onClose={this.handleNetworkClose}
						>
							<MenuItem onClick={this.handleMainnet} disabled={!testnetActive}>
								Mainnet&nbsp;&nbsp; <CloudDone style={{ color: 'green' }} />
							</MenuItem>
							<MenuItem onClick={this.handleTestnet} disabled={testnetActive}>
								Testnet&nbsp;&nbsp; <CloudDone style={{ color: 'green' }} />
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
					</div>
				</Toolbar>
			</AppBar>
		);
	}
}
ButtonAppBar.propTypes = {
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
	network: {
		borderStyle: 'solid',
		borderWidth: '1px',
		color: 'green',
	},
	subMenuText: {
		color: 'black',
	},
	modalContent: {
		position: 'absolute',
		width: theme.spacing.unit * 50,
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing.unit * 4,
		top: `50%`,
		left: `50%`,
		transform: `translate(-50%, -50%)`,
	},
	testnetHeader: { color: '#ffa000' },
});

const enhancer = _flowRight(
	withNetwork,
	withFactomCli,
	withWalletContext,
	withStyles(styles)
);
export default enhancer(ButtonAppBar);
