import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withNetwork } from '../context/NetworkContext';
import _flowRight from 'lodash/flowRight';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddWalletStepContent from './AddWalletStepContent';
import SectionHeader from '../component/form/SectionHeader';
import Paper from '@material-ui/core/Paper';
import OpenInNew from '@material-ui/icons/OpenInNew';
import WarningIcon from '@material-ui/icons/Warning';
import { withWalletContext } from '../context/WalletContext';

const getStandardSteps = () => {
	return ['Import Method', 'Address details'];
};

const getLedgerAddressSteps = (networkProps) => {
	return [
		'Import Method',
		networkProps.factoidAbbreviationFull,
		//	networkProps.ecAbbreviationFull,
	];
};
//this.props.networkController.networkProps.factoidAbbreviation
const getSeedAddressSteps = (networkProps) => {
	return [
		'Import Method',
		'Seed Value',
		networkProps.factoidAbbreviationFull,
		networkProps.ecAbbreviationFull,
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
		const {
			classes,
			handleCloseText,
			networkController: { networkProps },
			walletController: { isWalletEmpty },
		} = this.props;

		const { activeStep } = this.state;

		const steps = this.state.getSteps(networkProps);
		const sectionHeaderText =
			networkProps.network === 'testnet'
				? 'Add Testnet Address'
				: 'Add Address';

		return (
			<Paper className={classes.paper}>
				<SectionHeader text={sectionHeaderText} id="modal-title" />
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
							{networkProps.network === 'testnet' ? (
								<TestnetFinalStep
									classes={classes}
									isWalletEmpty={isWalletEmpty()}
								/>
							) : (
								<MainnetFinalStep
									classes={classes}
									isWalletEmpty={isWalletEmpty()}
								/>
							)}
							<br />
							<br />
							<div>
								{!isWalletEmpty() ? (
									<React.Fragment>
										<Button onClick={this.handleReset}>Add Another</Button>
										<Button
											onClick={this.props.handleClose}
											variant="contained"
											color="primary"
										>
											{handleCloseText}
										</Button>
									</React.Fragment>
								) : (
									<Button variant="outlined" onClick={this.handleReset}>
										Reset
									</Button>
								)}
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
						</React.Fragment>
					)}
				</React.Fragment>
			</Paper>
		);
	}
}
AddWalletStepper.propTypes = {
	classes: PropTypes.object.isRequired,
};

const MainnetFinalStep = ({ classes, isWalletEmpty }) => {
	if (isWalletEmpty) {
		return (
			<Typography variant="subtitle1" gutterBottom>
				No Addresses have been added.
			</Typography>
		);
	} else {
		return (
			<Typography variant="subtitle1" gutterBottom>
				You have finished adding an address.
			</Typography>
		);
	}
};

const TestnetFinalStep = ({ classes, isWalletEmpty }) => {
	if (isWalletEmpty) {
		return (
			<Typography variant="subtitle1" gutterBottom>
				No Addresses have been added.
			</Typography>
		);
	} else {
		return (
			<React.Fragment>
				<Typography variant="subtitle1" gutterBottom>
					You have finished adding a Testnet address.
				</Typography>
				<Paper className={classes.testnetWarning}>
					<Typography className={classes.warningText}>
						<WarningIcon className={classes.warningIcon} />
						&nbsp;&nbsp;Use these addresses for Testnet ONLY. Do not send real
						Factoids to these addresses, or you run the risk of losing them.
						Please read all notices.
						<br />
						<br />
						You can use the{' '}
						<a
							target="_blank"
							rel="noopener noreferrer"
							href={'https://faucet.factoid.org/'}
						>
							Factom Testnet Faucet{' '}
							<OpenInNew color="primary" style={{ fontSize: 15 }} />
						</a>{' '}
						to receive Testoids.
					</Typography>
				</Paper>
			</React.Fragment>
		);
	}
};

const styles = (theme) => ({
	stepper: {
		backgroundColor: '#eeeeee',
	},
	paper: {
		minWidth: 565,
		padding: theme.spacing.unit * 4,
		minHeight: 300,
	},
	testnetWarning: {
		borderColor: '#ffa000',
		borderStyle: 'solid',
		padding: 5,
		width: 415,
	},
	warningIcon: {
		color: '#ffa000',
		display: 'inline',
		position: 'relative',
		top: '6px',
	},
	warningText: {
		display: 'inline',
	},
});

const enhancer = _flowRight(withNetwork, withWalletContext, withStyles(styles));

export default enhancer(AddWalletStepper);
