import React, { useState } from 'react';
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
	return ['Import Method', networkProps.factoidAbbreviationFull];
};

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

function AddWalletStepper(props) {
	const [activeStep, setActiveStep] = useState(0);
	const [importType, setImportType] = useState('fct');
	const [getSteps, setGetSteps] = useState(() => getStandardSteps);

	function handleReset() {
		setActiveStep(0);
		setImportType('fct');
		setGetSteps(() => getStandardSteps);
	}

	function updateImportType(importType) {
		setImportType(importType);
		setGetSteps(() => stepMap[importType]);
	}

	function handleNext() {
		setActiveStep(activeStep + 1);
	}

	function handleBack() {
		setActiveStep(activeStep - 1);
	}

	const {
		classes,
		handleClose,
		handleCloseText,
		networkController: { networkProps },
		walletController: { isWalletEmpty },
	} = props;

	const steps = getSteps(networkProps);

	const sectionHeaderText =
		networkProps.network === 'testnet' ? 'Add Testnet Address' : 'Add Address';

	return (
		<Paper className={classes.paper}>
			<SectionHeader text={sectionHeaderText} id="modal-title" />
			<Stepper activeStep={activeStep} className={classes.stepper}>
				{steps.map((label) => {
					const props = {};
					const labelProps = {};

					return (
						<Step key={label} {...props}>
							<StepLabel {...labelProps}>{label}</StepLabel>
						</Step>
					);
				})}
			</Stepper>

			{activeStep === steps.length ? (
				<>
					<br />
					<FinalStep
						classes={classes}
						isWalletEmpty={isWalletEmpty()}
						network={networkProps.network}
					/>
					<br />
					<br />
					<div>
						{!isWalletEmpty() ? (
							<>
								<Button onClick={handleReset}>Add Another</Button>
								<Button
									onClick={handleClose}
									variant="contained"
									color="primary"
								>
									{handleCloseText}
								</Button>
							</>
						) : (
							<Button variant="outlined" onClick={handleReset}>
								Reset
							</Button>
						)}
					</div>
				</>
			) : (
				<>
					<br />
					<AddWalletStepContent
						activeStep={activeStep}
						updateImportType={updateImportType}
						handleNext={handleNext}
						handleBack={handleBack}
						importType={importType}
					/>
				</>
			)}
		</Paper>
	);
}
AddWalletStepper.propTypes = {
	classes: PropTypes.object.isRequired,
};

const FinalStep = ({ classes, isWalletEmpty, network }) => {
	if (isWalletEmpty) {
		return (
			<Typography variant="subtitle1" gutterBottom>
				No Addresses have been added.
			</Typography>
		);
	} else if (network === 'mainnet') {
		return (
			<Typography variant="subtitle1" gutterBottom>
				You have finished adding an address.
			</Typography>
		);
	} else if (network === 'testnet') {
		return (
			<>
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
			</>
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
