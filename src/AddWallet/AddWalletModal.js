import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import AddWalletStepper from './AddWalletStepper';

class AddWalletModal extends React.Component {
	state = {
		open: false,
	};

	handleOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	render() {
		const { classes } = this.props;

		return (
			<div className={classes.center}>
				<Button
					onClick={this.handleOpen}
					className={classes.button}
					variant="outlined"
					color="primary"
				>
					Add Wallet
				</Button>
				<Modal
					aria-labelledby="modal-title"
					open={this.state.open}
					onClose={this.handleClose}
				>
					<div className={classes.paper}>
						<AddWalletStepper
							addWallet={this.props.addWallet}
							handleClose={this.handleClose}
						/>
					</div>
				</Modal>
			</div>
		);
	}
}
AddWalletModal.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	paper: {
		position: 'absolute',
		width: 575,
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing.unit * 4,
		top: `50%`,
		left: `50%`,
		transform: `translate(-50%, -50%)`,
	},
	button: {
		width: '275px;',
		height: '50px',
		marginBottom: '15px',
	},
	center: {
		margin: '0 auto',
	},
});

export default withStyles(styles)(AddWalletModal);
