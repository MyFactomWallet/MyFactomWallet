import React, { Component } from 'react';
import _flowRight from 'lodash/flowRight';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { withFactomCli } from '../Context/FactomCliContext';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddressInfoHeader from './Shared/AddressInfoHeader';
import { withLedger } from '../Context/LedgerContext';
import { withWalletContext } from '../Context/WalletContext';
import { withNetwork } from '../Context/NetworkContext';
import factombip44 from 'factombip44/dist/factombip44';
import {
	isValidFctPrivateAddress,
	isValidEcPublicAddress,
} from 'factom/dist/factom';

/**
 * Constants
 */
const entryCreditAmountPath = 'entryCreditAmount';
const recipientAddressPath = 'recipientAddress';
const myFctWalletAnchorElPath = 'myFctWalletAnchorEl';
const privateKeyPath = 'privateKey';
const walletImportTypePath = 'walletImportType';
const seedPath = 'seed';

class ConvertECForm extends Component {
	handleKeyPress(event) {
		if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
			event.preventDefault();
		}
	}

	render() {
		const {
			classes,
			walletController: {
				updateBalances,
				getEntryCreditAddresses,
				getActiveAddress,
				getEntryCreditRate,
				signWithSeed,
			},
			ledgerController: { signWithLedger },
			factomCliController: { factomCli },
			networkController: { networkProps },
		} = this.props;

		const activeAddress_o = getActiveAddress();
		const ecAddresses = getEntryCreditAddresses();

		return (
			<Formik
				initialValues={{
					entryCreditAmount: '',
					recipientAddress: '',
					myFctWalletAnchorEl: null,
					privateKey: '',
					[seedPath]: '',
					[walletImportTypePath]: activeAddress_o.importType,
					transactionID: null,
					ledgerStatus: null,
					transactionError: null,
				}}
				onSubmit={async (values, actions) => {
					const {
						entryCreditAmount,
						recipientAddress,
						privateKey,
						seed,
					} = values;
					let transaction = {};
					const importType = _get(values, walletImportTypePath);
					try {
						if (importType === 'standard') {
							transaction = await factomCli.createEntryCreditPurchaseTransaction(
								privateKey,
								recipientAddress,
								entryCreditAmount
							);
						} else if (importType === 'seed') {
							const mnemonic = seed;
							const index = activeAddress_o.index;
							const toAddr = recipientAddress;
							const amount = entryCreditAmount;
							const type = 'convertFCT';

							const seedTrans_o = {
								mnemonic,
								index,
								toAddr,
								amount,
								type,
							};

							transaction = await signWithSeed(seedTrans_o);
						} else if (importType === 'ledger') {
							actions.setFieldValue(
								'ledgerStatus',
								'Connecting to Ledger Nano S'
							);
							const ledgerConnected = await this.props.ledgerController.isLedgerConnected();

							if (ledgerConnected) {
								actions.setFieldValue(
									'ledgerStatus',
									'Waiting for Confirmation'
								);
							} else {
								actions.resetForm();
								actions.setFieldValue(
									'transactionError',
									'Ledger Nano S Not Found. Please connect your Ledger Nano S and try again.'
								);
							}

							const fromAddr = activeAddress_o.address;
							const toAddr = recipientAddress;
							const amount = (await getEntryCreditRate()) * entryCreditAmount;
							const index = activeAddress_o.index;

							const ledgerTrans_o = {
								fromAddr,
								toAddr,
								amount,
								index,
							};

							transaction = await signWithLedger(ledgerTrans_o);
						}

						const txId = await factomCli.sendTransaction(transaction);
						actions.setFieldValue('transactionID', txId);
						updateBalances();
					} catch (err) {
						console.log(err);
						actions.resetForm();

						actions.setFieldValue(
							'transactionError',
							'An error occured. Please try again.'
						);
					}
				}}
				validationSchema={Yup.object().shape({
					[entryCreditAmountPath]: Yup.string().required('Required'),
					[recipientAddressPath]: Yup.string().test(
						recipientAddressPath,
						'Invalid Address',
						isValidEcPublicAddress
					),
					[walletImportTypePath]: Yup.string(),
					[privateKeyPath]: Yup.string().when(walletImportTypePath, {
						is: 'standard',
						then: Yup.string().test(
							privateKeyPath,
							'Invalid Key',
							isValidFctPrivateAddress
						),
						otherwise: Yup.string().notRequired(),
					}),
					[seedPath]: Yup.string().when(walletImportTypePath, {
						is: 'seed',
						then: Yup.string().test(
							seedPath,
							'Invalid Seed Phrase',
							factombip44.validMnemonic
						),
						otherwise: Yup.string().notRequired(),
					}),
				})}
				render={({
					isSubmitting,
					errors,
					touched,
					values,
					setFieldValue,
					handleReset,
					handleChange,
				}) => (
					<Form onKeyPress={this.handleKeyPress}>
						<AddressInfoHeader />

						<Field name={recipientAddressPath}>
							{({ field, form }) => (
								<TextField
									error={
										errors[recipientAddressPath] &&
										touched[recipientAddressPath]
											? true
											: false
									}
									{...field}
									onChange={(e) => {
										handleChange(e);
										setFieldValue('transactionError', null);
									}}
									label={
										'Recipient ' + networkProps.ecAbbreviation + ' address'
									}
									fullWidth={true}
									type="text"
									placeholder={
										'Enter ' + networkProps.ecAbbreviationFull + ' address'
									}
									disabled={isSubmitting}
								/>
							)}
						</Field>
						<Grid container justify="space-between">
							<Grid item>
								<ErrorMessage
									name={recipientAddressPath}
									render={(msg) => (
										<div className={classes.errorText}>{msg}</div>
									)}
								/>
							</Grid>
							{!_isEmpty(ecAddresses) && (
								<Grid item>
									<ECAddressMenu
										values={values}
										setFieldValue={setFieldValue}
										ecAddresses={ecAddresses}
									/>
									<Typography
										variant="caption"
										aria-owns={
											values[myFctWalletAnchorElPath] ? 'simple-menu' : null
										}
										aria-haspopup="true"
										onClick={(event) => {
											setFieldValue('transactionError', null);
											setFieldValue(
												myFctWalletAnchorElPath,
												event.currentTarget
											);
										}}
										className={classes.pointer}
									>
										Send to one of my addresses
									</Typography>
								</Grid>
							)}
						</Grid>

						<Field name={entryCreditAmountPath}>
							{({ field, form }) => (
								<TextField
									type="number"
									error={
										errors[entryCreditAmountPath] &&
										touched[entryCreditAmountPath]
											? true
											: false
									}
									{...field}
									placeholder={
										'Enter Amount (' + networkProps.ecAbbreviation + ')'
									}
									label="Amount"
									fullWidth={true}
									disabled={isSubmitting}
								/>
							)}
						</Field>
						<Grid container justify="space-between">
							<Grid item>
								<ErrorMessage
									name={entryCreditAmountPath}
									render={(msg) => (
										<div className={classes.errorText}>{msg}</div>
									)}
								/>
							</Grid>
							<Grid item>
								<br />
							</Grid>
						</Grid>
						{_get(values, walletImportTypePath) === 'standard' && (
							<React.Fragment>
								<Field name={privateKeyPath}>
									{({ field, form }) => (
										<TextField
											error={
												errors[privateKeyPath] && touched[privateKeyPath]
													? true
													: false
											}
											{...field}
											placeholder={
												'Enter Private Key for ' + activeAddress_o.nickname
											}
											label="Private Key"
											fullWidth={true}
											disabled={isSubmitting}
										/>
									)}
								</Field>
								<ErrorMessage
									name={privateKeyPath}
									render={(msg) => (
										<div className={classes.errorText}>{msg}</div>
									)}
								/>
							</React.Fragment>
						)}
						{_get(values, walletImportTypePath) === 'seed' && (
							<React.Fragment>
								<Field name={seedPath}>
									{({ field, form }) => (
										<TextField
											error={
												_get(errors, seedPath) && _get(touched, seedPath)
													? true
													: false
											}
											{...field}
											placeholder={
												'Enter Seed Phrase for ' + activeAddress_o.nickname
											}
											label="Seed Phrase"
											fullWidth={true}
											disabled={isSubmitting}
										/>
									)}
								</Field>
								<ErrorMessage
									name={seedPath}
									render={(msg) => (
										<div className={classes.errorText}>{msg}</div>
									)}
								/>
							</React.Fragment>
						)}

						<br />
						<br />
						{!_isNil(values.transactionError) && (
							<Typography className={classes.transactionErrorText}>
								{values.transactionError}
							</Typography>
						)}
						<br />

						{isSubmitting ? (
							<div>
								{values.transactionID !== null ? (
									<span>
										<Typography>
											<b>Transaction ID:</b> {values.transactionID}
										</Typography>
										<br />
										<Button
											type="button"
											className="outline"
											color="primary"
											variant="contained"
											onClick={handleReset}
											//disabled={!dirty || isSubmitting}
										>
											New Transaction
										</Button>
									</span>
								) : (
									<React.Fragment>
										<CircularProgress thickness={7} />
										{values.ledgerStatus}
									</React.Fragment>
								)}
							</div>
						) : (
							<Button
								className={classes.sendButton}
								variant="contained"
								color="primary"
								type="submit"
								disabled={isSubmitting}
							>
								{'Convert ' +
									networkProps.factoidAbbreviation +
									' to ' +
									networkProps.ecAbbreviation}
							</Button>
						)}

						<br />
						<br />
						<Typography>
							Please verify all details are correct before hitting send.
							<br />
							Nobody can reverse mistaken transactions.
						</Typography>
					</Form>
				)}
			/>
		);
	}
}

function ECAddressMenu(props) {
	const { values, setFieldValue, ecAddresses } = props;

	const addressList = ecAddresses.map((address_o, index) => (
		<MenuItem
			key={index}
			onClick={() => {
				setFieldValue(myFctWalletAnchorElPath, null);
				setFieldValue(recipientAddressPath, address_o.address);
			}}
		>
			{address_o.nickname}
		</MenuItem>
	));
	return (
		<Menu
			id="simple-menu"
			anchorEl={values[myFctWalletAnchorElPath]}
			open={Boolean(values[myFctWalletAnchorElPath])}
			onClose={() => {
				setFieldValue(myFctWalletAnchorElPath, null);
			}}
		>
			{addressList}
		</Menu>
	);
}

ConvertECForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = {
	sendButton: {
		width: '50%',
		height: '24px',
	},
	errorText: { color: 'red', fontSize: '12px', textAlign: 'left' },
	pointer: {
		cursor: 'pointer',
	},
	transactionErrorText: { color: 'red', fontSize: '16px' },
};

const enhancer = _flowRight(
	withNetwork,
	withLedger,
	withWalletContext,
	withFactomCli,
	withStyles(styles)
);

export default enhancer(ConvertECForm);
