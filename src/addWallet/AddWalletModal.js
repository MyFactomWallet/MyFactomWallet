import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import AddWalletStepper from './AddWalletStepper';

function AddWalletModal(props) {
	const classes = props.classes;
	const [isOpen, setOpen] = useState(false);

	return (
		<div className={classes.center}>
			<Button
				onClick={() => setOpen(true)}
				className={classes.button}
				variant="outlined"
				color="primary"
			>
				Add Address
			</Button>
			<Modal
				aria-labelledby="modal-title"
				open={isOpen}
				onClose={() => setOpen(false)}
			>
				<div className={classes.modalContent}>
					<AddWalletStepper
						handleClose={() => setOpen(false)}
						handleCloseText="Exit"
					/>
				</div>
			</Modal>
		</div>
	);
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
		minWidth: '490px',
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
