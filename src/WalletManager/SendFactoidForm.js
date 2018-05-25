import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TransactionPreview from './TransactionPreview.js';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

class SendFactoidForm extends Component {
	render() {
		const { classes } = this.props;
		return (
			<div>
				<TextField
					label="Recipient"
					fullWidth={true}
					type="text"
					name="recipientInput"
					placeholder="Enter recipient address"
				/>
				<Typography align="right" variant="caption">
					Send to one of my wallets
				</Typography>
				<br />
				<TextField
					onChange={(event) =>
						this.props.updateSendFactoidAmount(event.target.value)
					}
					placeholder="Enter Amount (FCT)"
					label="Amount"
					fullWidth={true}
					name="amountInput"
					value={
						this.props.sendFactoidAmount === 0
							? ''
							: this.props.sendFactoidAmount
					}
				/>
				<Typography align="right" variant="caption">
					Use Max
				</Typography>
				<TransactionPreview factoidAmount={this.props.sendFactoidAmount} />
				<br />
				<Button className={classes.sendButton} variant="raised" color="primary">
					Send Funds
				</Button>
				<br />
				<br />
				<Typography>
					Please verify all details are correct before hitting send.<br />We can
					not reverse mistaken transactions.
				</Typography>
			</div>
		);
	}
}
SendFactoidForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = {
	sendButton: {
		width: '50%',
		height: '24px',
	},
};

export default withStyles(styles)(SendFactoidForm);
