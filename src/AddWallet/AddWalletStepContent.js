import React from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

const walletTypeOptions = [
	{
		value: 'Factoid',
		label: 'Factoid',
	},
	{
		value: 'Entry Credit',
		label: 'Entry Credit',
		disabled: true,
	},
];

const importMethodOptions = [
	{
		value: 'New Address',
		label: 'Random New Address',
	},
	{
		value: 'Public Address',
		label: 'Import from Public Address',
	},
	{
		value: 'Private Key',
		label: 'Import from Private Key',
	},
	{
		value: 'Ledger',
		label: 'Import from Ledger',
		disabled: true,
	},
];

class AddWalletStepContent extends React.Component {
	render() {
		switch (this.props.activeStep) {
			case 0:
				return (
					<div>
						<SelectWalletType
							handleChange={(e) => this.props.updateWalletType(e)}
							value={this.props.walletType}
						/>
						<SelectImportMethod
							handleChange={this.props.updateImportMethod}
							value={this.props.importMethod}
						/>
						{this.props.importMethod === 'Public Address' && (
							<AddressTextField
								handleChange={(e) => this.props.updatePublicAddress(e)}
								label={this.props.importMethod}
								value={this.props.publicAddress}
							/>
						)}
						{this.props.importMethod === 'Private Key' && (
							<AddressTextField
								handleChange={(e) => this.props.updatePrivateKey(e)}
								label={this.props.importMethod}
								value={this.props.privateKey}
							/>
						)}
					</div>
				);
			case 1:
				return (
					<ConfirmDetails
						walletType={this.props.walletType}
						publicAddress={this.props.publicAddress}
						privateKey={this.props.privateKey}
						importMethod={this.props.importMethod}
					/>
				);
			default:
				return 'Unknown step';
		}
	}
}

const SelectWalletType = (props) => {
	return (
		<TextField
			select
			label="Wallet Type"
			value={props.value}
			margin="normal"
			onChange={props.handleChange()}
			fullWidth
		>
			{walletTypeOptions.map((option) => (
				<MenuItem
					key={option.value}
					value={option.value}
					disabled={option.disabled}
					dense
				>
					{option.label}
				</MenuItem>
			))}
		</TextField>
	);
};

const SelectImportMethod = (props) => {
	return (
		<TextField
			select
			label="Import Method"
			value={props.value}
			margin="normal"
			onChange={props.handleChange()}
			fullWidth
		>
			{importMethodOptions.map((option) => (
				<MenuItem
					disabled={option.disabled}
					key={option.value}
					value={option.value}
					dense
				>
					{option.label}
				</MenuItem>
			))}
		</TextField>
	);
};

const AddressTextField = (props) => {
	return (
		<TextField
			onBlur={props.handleChange()}
			defaultValue={props.value}
			label={props.label}
			margin="normal"
			fullWidth
			multiline
			autoComplete="nope"
		/>
	);
};

const ConfirmDetails = (props) => {
	return (
		<div>
			<Typography variant="body2">Summary</Typography>
			<br />
			{props.walletType && (
				<span>
					<Typography variant="body2">Wallet Type: </Typography>
					<Typography>{props.walletType}</Typography>
				</span>
			)}
			{props.publicAddress && (
				<span>
					<Typography variant="body2">Public Address: </Typography>
					<Typography>{props.publicAddress} </Typography>
				</span>
			)}
			<br />
			{props.privateKey &&
				props.importMethod === 'New Address' && (
					<span>
						<Typography color="secondary">
							Please write down your private key in a SECURE LOCATION.
						</Typography>
						<Typography variant="body2">Private Key: </Typography>
						<Typography>{props.privateKey}</Typography>
					</span>
				)}
		</div>
	);
};

export default AddWalletStepContent;
