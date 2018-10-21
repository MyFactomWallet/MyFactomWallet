import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withNetwork } from '../Context/NetworkContext';
import _flowRight from 'lodash/flowRight';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddWalletStepContent from './AddWalletStepContent';
import SectionHeader from '../Vote/Shared/SectionHeader.js';
import Paper from '@material-ui/core/Paper';

const getStandardSteps = () => {
	return ['Import Method', 'Address details'];
};

const getLedgerAddressSteps = ({ networkProps }) => {
	return [
		'Import Method',
		networkProps.factoidAbbreviation,
		networkProps.ecAbbreviation,
	];
};
//this.props.networkController.networkProps.factoidAbbreviation
const getSeedAddressSteps = ({ networkProps }) => {
	return [
		'Import Method',
		'Seed Value',
		networkProps.factoidAbbreviation,
		networkProps.ecAbbreviation,
	];
};

const stepMap = {
	importSeed: getSeedAddressSteps,
	new: getSeedAddressSteps,
	ledger: getLedgerAddressSteps,
	fct: getStandardSteps,
	ec: getStandardSteps,
};

class AddWalletStepper extends React.Component {
	initialState = {
		activeStep: 0,
		importType: 'fct',
		getSteps: getStandardSteps,
	};

	state = this.initialState;

	updateImportType = (importType) => {
		this.setState({
			importType: importType,
			getSteps: stepMap[importType],
		});
	};

	handleNext = () => {
		this.setState((state) => ({
			activeStep: state.activeStep + 1,
		}));
	};

	handleBack = () => {
		this.setState((state) => ({
			activeStep: state.activeStep - 1,
		}));
	};

	handleReset = () => {
		this.setState(this.initialState);
	};

	render() {
		const { classes, handleCloseText } = this.props;

		const { activeStep } = this.state;

		const steps = this.state.getSteps(this.props.networkController);

		return (
			<Paper className={classes.paper}>
				<SectionHeader text="Add Address" id="modal-title" />
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
				<React.Fragment>
					{activeStep === steps.length ? (
						<React.Fragment>
							<br />
							<Typography variant="subheading" gutterBottom>
								Address(es) have successfully been added.
							</Typography>
							<br />
							<br />
							<br />
							<div>
								<Button onClick={this.handleReset}>Add Another</Button>
								<Button
									onClick={this.props.handleClose}
									variant="raised"
									color="primary"
								>
									{handleCloseText}
								</Button>
							</div>
						</React.Fragment>
					) : (
						<React.Fragment>
							<br />
							<AddWalletStepContent
								activeStep={activeStep}
								updateImportType={this.updateImportType}
								handleNext={this.handleNext}
								handleBack={this.handleBack}
								importType={this.state.importType}
							/>

							{/*
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
							</div>*/}
						</React.Fragment>
					)}
				</React.Fragment>
			</Paper>
		);
	}
}

const styles = (theme) => ({
	stepper: {
		backgroundColor: '#eeeeee',
	},
	paper: {
		minWidth: 525,
		padding: theme.spacing.unit * 4,
		minHeight: 300,
	},
});

const enhancer = _flowRight(withNetwork, withStyles(styles));

export default enhancer(AddWalletStepper);
