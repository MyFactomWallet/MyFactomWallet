import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Warning from '@material-ui/icons/Warning';

class ConfirmationDialogRaw extends React.Component {
	constructor(props) {
		super();
		this.state = {
			value: props.value,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.value !== this.props.value) {
			this.setState({ value: nextProps.value });
		}
	}

	handleAgree = () => {
		this.props.onClose(this.state.value);
	};

	handleChange = (event, value) => {
		this.setState({ value });
	};

	render() {
		const { classes, value, ...other } = this.props;

		return (
			<Dialog
				disableBackdropClick
				disableEscapeKeyDown
				aria-labelledby="confirmation-dialog-title"
				{...other}
			>
				<DialogTitle align="center" style={{ backgroundColor: '#f50057' }}>
					<Warning fontSize="large" />
				</DialogTitle>
				<DialogContent className={classes.lessPad}>
					<br />
					<Typography variant="h5" align="center">
						Testnet Warning
					</Typography>
					<br />
					<Typography>
						By using MyFactomWallet.com and/or by clicking 'accept' at the
						bottom, you agree to the following notices:
					</Typography>
					<Typography variant="h5" align="center">
						Notices
					</Typography>
					<ul>
						<li>
							<Typography>
								Never send funds from a mainnet address to a testnet address and
								vice versa. Sending Factoids to the testnet will likely result
								in a loss of factoids. You acknowledge that testnet Testoids and
								Test Credits have no value. All other MyFactomWallet.com notices
								and tips apply.
							</Typography>
						</li>
					</ul>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleAgree} color="primary">
						Accept
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

ConfirmationDialogRaw.propTypes = {
	onClose: PropTypes.func,
	value: PropTypes.string,
};

class ConfirmationDialog extends React.Component {
	state = {
		open: true,
		value: 'Done',
	};

	handleClose = (value) => {
		this.setState({ value, open: false });
	};

	render() {
		return (
			<ConfirmationDialogRaw
				classes={this.props.classes}
				open={this.state.open}
				onClose={this.handleClose}
				value={this.state.value}
			/>
		);
	}
}

ConfirmationDialog.propTypes = {
	classes: PropTypes.object.isRequired,
};
const styles = (theme) => ({
	lessPad: { paddingBottom: '0px' },
});

export default withStyles(styles)(ConfirmationDialog);
