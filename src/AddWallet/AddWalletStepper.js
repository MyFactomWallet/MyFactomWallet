import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddWalletStepContent from './AddWalletStepContent';
import SectionHeader from '../Vote/Shared/SectionHeader.js';
import Paper from '@material-ui/core/Paper';

const getStandardSteps = () => {
	return ['Address Type', 'Address details'];
};

const getLedgerSteps = () => {
	return ['Address Type', 'FCT', 'EC', 'Address details'];
};

const stepMap = {
	ledger: getLedgerSteps,
	fct: getStandardSteps,
	ec: getStandardSteps,
};

class AddWalletStepper extends React.Component {
	static propTypes = {
		classes: PropTypes.object,
	};

	static initialState = () => ({
		activeStep: 0,
		importType: '',
		getSteps: getStandardSteps,
	});

	state = AddWalletStepper.initialState();

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
		this.setState(AddWalletStepper.initialState());
	};

	render() {
		const { classes } = this.props;

		const { activeStep } = this.state;

		const steps = this.state.getSteps();

		return (
			<Paper className={classes.paper}>
				<SectionHeader text="Add Addresses" id="modal-title" />
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
		width: 500,
	},
	paper: {
		width: 575,
		padding: theme.spacing.unit * 4,
	},
});

export default withStyles(styles)(AddWalletStepper);
