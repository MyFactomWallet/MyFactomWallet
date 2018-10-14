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
					Add Addresses
				</Button>
				<Modal
					aria-labelledby="modal-title"
					open={this.state.open}
					onClose={this.handleClose}
				>
					<div className={classes.modalContent}>
						<AddWalletStepper handleClose={this.handleClose} />
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
	modalContent: {
		position: 'absolute',
		boxShadow: theme.shadows[5],
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
