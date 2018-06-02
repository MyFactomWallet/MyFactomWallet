import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddWalletStepContent from './AddWalletStepContent';
import fctUtils from 'factomjs-util/dist/factomjs-util';
import {
	isValidFctPrivateAddress,
	isValidFctPublicAddress,
} from 'factom/dist/factom.js';

function getSteps() {
	return ['Select options', 'Confirm details'];
}

class AddWalletStepper extends React.Component {
	static propTypes = {
		classes: PropTypes.object,
	};

	static initialState = () => ({
		activeStep: 0,
		walletType: '',
		importMethod: '',
		publicAddress: null,
		privateKey: null,
	});

	state = AddWalletStepper.initialState();

	updateWalletType = () => (event) => {
		this.setState({
			walletType: event.target.value,
		});
	};

	updateImportMethod = () => (event) => {
		this.setState({
			importMethod: event.target.value,
			privateKey: null,
			publicAddress: null,
		});
	};

	updatePublicAddress = () => (event) => {
		if (event.target.value && isValidFctPublicAddress(event.target.value)) {
			this.setState({
				publicAddress: event.target.value,
			});
		} else {
			this.setState({
				publicAddress: null,
			});
		}
	};

	updatePrivateKey = () => (event) => {
		if (event.target.value && isValidFctPrivateAddress(event.target.value)) {
			this.setState({
				privateKey: fctUtils.privateHumanAddressStringToPrivate(
					event.target.value
				),
			});
		} else {
			this.setState({
				privateKey: null,
			});
		}
	};

	handleNext = () => {
		const { activeStep } = this.state;
		const steps = getSteps();

		// private key form
		if (activeStep === 0 && this.state.importMethod === 'Private Key') {
			var humanPublic = null;

			if (this.state.privateKey) {
				humanPublic = fctUtils.publicFactoidKeyToHumanAddress(
					fctUtils.privateKeyToPublicKey(this.state.privateKey)
				);
			}

			this.setState({
				publicAddress: humanPublic,
				privateKey: null,
			});
		}

		// random address form
		if (activeStep === 0 && this.state.importMethod === 'New Address') {
			const privateKey = fctUtils.randomPrivateKey();
			const humanSecret = fctUtils.privateFactoidKeyToHumanAddress(privateKey);
			const humanPublic = fctUtils.publicFactoidKeyToHumanAddress(
				fctUtils.privateKeyToPublicKey(privateKey)
			);

			this.setState({
				publicAddress: humanPublic,
				privateKey: humanSecret,
			});
		}

		// confirmed
		if (activeStep === steps.length - 1) {
			this.props.addWallet(this.state.walletType, this.state.publicAddress);
		}

		this.setState({
			activeStep: activeStep + 1,
		});
	};

	handleBack = () => {
		const { activeStep } = this.state;

		this.setState({
			activeStep: activeStep - 1,
		});
	};

	handleReset = () => {
		this.setState(AddWalletStepper.initialState());
	};

	render() {
		const { classes } = this.props;
		const steps = getSteps();
		const { activeStep } = this.state;

		return (
			<div>
				<Typography variant="title" id="modal-title">
					Add Wallet
				</Typography>
				<br />
				<Stepper activeStep={activeStep} className={classes.stepper}>
					{steps.map((label, index) => {
						const props = {};
						const labelProps = {};

						return (
							<Step key={label} {...props}>
								<StepLabel {...labelProps}>{label}</StepLabel>
							</Step>
						);
					})}
				</Stepper>
				<div>
					{activeStep === steps.length ? (
						<div>
							<Typography variant="subheading" gutterBottom>
								Wallet has successfully been added.
							</Typography>
							<div>
								<Button onClick={this.handleReset}>Add Another</Button>
								<Button
									onClick={this.props.handleClose}
									variant="raised"
									color="primary"
								>
									Exit
								</Button>
							</div>
						</div>
					) : (
						<div>
							<AddWalletStepContent
								activeStep={activeStep}
								walletType={this.state.walletType}
								importMethod={this.state.importMethod}
								publicAddress={this.state.publicAddress}
								privateKey={this.state.privateKey}
								updateWalletType={this.updateWalletType}
								updateImportMethod={this.updateImportMethod}
								updatePublicAddress={this.updatePublicAddress}
								updatePrivateKey={this.updatePrivateKey}
							/>
							<br />
							<div>
								<Button disabled={activeStep === 0} onClick={this.handleBack}>
									Back
								</Button>
								<Button
									onClick={this.handleNext}
									variant="raised"
									color="primary"
								>
									{activeStep === steps.length - 1 ? 'Add Wallet' : 'Next'}
								</Button>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}
}

const styles = (theme) => ({
	stepper: {
		backgroundColor: '#eeeeee',
		width: 500,
	},
});

export default withStyles(styles)(AddWalletStepper);
