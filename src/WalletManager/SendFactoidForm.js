import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

class SendFactoidForm extends Component {
	render() {
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
				/>
				<Typography align="right" variant="caption">
					Use Max
				</Typography>
			</div>
		);
	}
}

export default SendFactoidForm;
