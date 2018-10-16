import React from 'react';
import _flowRight from 'lodash/flowRight';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import _get from 'lodash/get';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withWalletContext } from '../Context/WalletContext';
import Typography from '@material-ui/core/Typography';
import Fct from '@factoid.org/hw-app-fct';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import { withNetwork } from '../Context/NetworkContext';
import { withLedger } from '../Context/LedgerContext';
import GenerateAddressTable from './GenerateAddressTable';
import CircularProgress from '@material-ui/core/CircularProgress';
import _isNil from 'lodash/isNil';

/**
 * Constants
 */
const ecAddressPath = 'ecAddress';
const fctAddressPath = 'fctAddress';
const ecNicknamePath = 'ecNickname';
const fctNicknamePath = 'fctNickname';

class LedgerForm extends React.Component {
	state = {
		ledgerConnected: false,
		fctAddress: null,
		ecAddress: null,
		ledgerStatus: null,
	};

	handleKeyPress(event) {
		if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
			event.preventDefault();
		}
	}

	componentDidMount() {
		this.verifyLedger();
	}

	verifyLedger = async () => {
		try {
			const ledgerConnected = await this.props.ledgerController.isLedgerConnected();
			if (ledgerConnected) {
				const fctAddress = await this.getFirstFactoidAddress();
				const ecAddress = await this.getFirstECAddress();

				this.setState({ ledgerConnected, fctAddress, ecAddress });
			} else {
				this.setState({
					ledgerConnected,
					ledgerStatus: 'Ledger not found. Please go back and try again.',
				});
			}
		} catch (err) {
			console.log(err);
		}
	};

	getFirstFactoidAddress = async () => {
		const transport = await TransportU2F.create();

		const ledger = new Fct(transport);
		const bip32Account = this.props.networkController.networkProps.bip32Account;

		const fctAddr = await ledger.getAddress(
			"44'/131'/" + bip32Account + "'/0'/0'"
		);

		transport.close();
		return fctAddr.address;
	};

	getFirstECAddress = async () => {
		const transport = await TransportU2F.create();

		const ledger = new Fct(transport);
		const bip32Account = this.props.networkController.networkProps.bip32Account;

		const ecAddr = await ledger.getAddress(
			"44'/132'/" + bip32Account + "'/0'/0'"
		);

		transport.close();
		return ecAddr.address;
	};

	render() {
		const { classes } = this.props;

		const {
			getEcAddresses,
			getFctAddresses,
			addECAddress,
			addFactoidAddress,
			newLedgerAddress,
		} = this.props.walletController;

		//const ecAddresses = getEcAddresses();
		//const factoidAddresses = getFctAddresses();

		return (
			<Formik
				enableReinitialize
				initialValues={{
					ecAddress: this.state.ecAddress,
					fctAddress: this.state.fctAddress,
					ecNickname: '',
					fctNickname: '',
					ledgerConnected: this.state.ledgerConnected,
					ledgerStatus: this.state.ledgerStatus,
				}}
				onSubmit={async (values, actions) => {
					const fctAddress_o = newLedgerAddress(
						_get(values, fctAddressPath),
						_get(values, fctNicknamePath),
						0
					);

					const ecAddress_o = newLedgerAddress(
						_get(values, ecAddressPath),
						_get(values, ecNicknamePath),
						0
					);
					addFactoidAddress(fctAddress_o);

					addECAddress(ecAddress_o);

					// proceed to next page
					this.props.handleNext();
				}}
				validationSchema={Yup.object().shape({
					[ecNicknamePath]: Yup.string()
						.trim()
						.required('Required'),
					[fctNicknamePath]: Yup.string()
						.trim()
						.required('Required'),
				})}
				render={({ isSubmitting, errors, touched, values, setFieldValue }) => (
					<Form onKeyPress={this.handleKeyPress}>
						{values.ledgerConnected ? (
							<React.Fragment>
								{_get(values, fctAddressPath) && (
									<React.Fragment>
										<Typography>
											<b>Ledger Factoid Address:</b>
										</Typography>
										<Typography>{_get(values, fctAddressPath)}</Typography>
										<FormTextField
											error={
												errors[fctNicknamePath] && touched[fctNicknamePath]
													? true
													: false
											}
											name={fctNicknamePath}
											label="Factoid address nickname"
										/>
										<ErrorMessage
											name={ecNicknamePath}
											render={(msg) => (
												<span className={classes.errorText}>{msg}</span>
											)}
										/>
									</React.Fragment>
								)}
								<br />
								<br />
								<br />
								{_get(values, ecAddressPath) && (
									<React.Fragment>
										<Typography>
											<b>Ledger Entry Credit Address:</b>
										</Typography>
										<Typography>{_get(values, ecAddressPath)}</Typography>
										<FormTextField
											error={
												errors[ecNicknamePath] && touched[ecNicknamePath]
													? true
													: false
											}
											name={ecNicknamePath}
											label="Entry Credit address nickname"
										/>
										<ErrorMessage
											name={ecNicknamePath}
											render={(msg) => (
												<span className={classes.errorText}>{msg}</span>
											)}
										/>
									</React.Fragment>
								)}
							</React.Fragment>
						) : (
							<React.Fragment>
								<br />
								{!_isNil(values.ledgerStatus) ? (
									values.ledgerStatus
								) : (
									<React.Fragment>
										<Typography>
											<b>Connect your Ledger</b>
										</Typography>
										<CircularProgress thickness={7} />
									</React.Fragment>
								)}
							</React.Fragment>
						)}

						<br />
						<br />
						<div>
							<Button onClick={this.props.handleBack}>Back</Button>
							<Button
								type="submit"
								disabled={isSubmitting}
								variant="raised"
								color="primary"
							>
								Next
							</Button>
						</div>
					</Form>
				)}
			/>
		);
	}
}

const FormTextField = (props) => {
	return (
		<Field name={props.name}>
			{({ field }) => (
				<TextField
					inputProps={{
						spellCheck: false,
						maxLength: props.maxLength,
					}}
					{...field}
					label={props.label + ' ' + (props.error ? '*' : '')}
					margin="dense"
					fullWidth
					multiline
					error={props.error}
				/>
			)}
		</Field>
	);
};

LedgerForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	errorText: { color: 'red', fontSize: '12px' },
});

const enhancer = _flowRight(
	withNetwork,
	withLedger,
	withWalletContext,
	withStyles(styles)
);

export default enhancer(LedgerForm);
