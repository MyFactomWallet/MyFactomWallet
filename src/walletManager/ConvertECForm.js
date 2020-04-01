import React, { Component } from 'react';
import _flowRight from 'lodash/flowRight';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import OpenInNew from '@material-ui/icons/OpenInNew';
import Tooltip from '@material-ui/core/Tooltip';
import { isValidPublicEcAddress } from 'factom/dist/factom';
import Paper from '@material-ui/core/Paper';
import CheckCircle from '@material-ui/icons/CheckCircleOutlined';

import { ADDRESS_LENGTH } from '../constants/WALLET_CONSTANTS';
import { toFactoids, minusBig, divideBig } from '../utils';
import { withFactomCli } from '../context/FactomCliContext';
import { withLedger } from '../context/LedgerContext';
import { withNetwork } from '../context/NetworkContext';
import { withSeed } from '../context/SeedContext';
import { withWalletContext } from '../context/WalletContext';
import AddressInfoHeader from './shared/AddressInfoHeader';
import ConvertTransactionPreview from './ConvertTransactionPreview';

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
	state = { sendFactoshiFee: null, ecRate: null };

	async componentDidMount() {
		const sendFactoshiFee = await this.props.walletController.getFactoshiFee();
		const ecRate = await this.props.walletController.getEntryCreditRate();
		this.setState({ sendFactoshiFee, ecRate });
	}

	getMaxEC(balance, fee) {
		const maxFactoshis = minusBig(balance, fee);
		let maxEntryCredits = divideBig(maxFactoshis, this.state.ecRate);
		if (maxEntryCredits < 0) {
			return 0;
		}
		return maxEntryCredits;
	}

	verifyKey = (privateKey) => {
		const activeAddress_o = this.props.walletController.getActiveAddress();

		return this.props.walletController.verifyKey(privateKey, activeAddress_o);
	};

	verifySeed = (seed) => {
		const activeAddress_o = this.props.walletController.getActiveAddress();

		return this.props.seedController.verifySeed(seed, activeAddress_o);
	};

	render() {
		const {
			classes,
			walletController: {
				updateBalances,
				getEntryCreditAddresses,
				getActiveAddress,
				activeAddressIndex_o,
				addAddressTransaction,
			},
			ledgerController: { signTransaction },
			factomCliController: { factomCli },
			networkController: { networkProps },
			seedController: { signWithSeed },
		} = this.props;

		const activeAddress_o = getActiveAddress();
		const ecAddresses = getEntryCreditAddresses();

		let maxAmount;
		if (
			this.state.sendFactoshiFee != null &&
			activeAddress_o.balance != null &&
			this.state.ecRate != null
		) {
			maxAmount = this.getMaxEC(
				activeAddress_o.balance,
				this.state.sendFactoshiFee
			);
		}

		return (
			<Formik
				enableReinitialize
				initialValues={{
					entryCreditAmount: '',
					recipientAddress: '',
					[myFctWalletAnchorElPath]: null,
					privateKey: '',
					[seedPath]: '',
					[walletImportTypePath]: activeAddress_o.importType,
					transactionID: null,
					ledgerStatus: null,
					transactionError: null,
					addressToReinitialize: activeAddress_o.address,
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
							const mnemonic = seed.trim();
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
									'Waiting 30s for Confirmation'
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
							const amount = Math.round(this.state.ecRate * entryCreditAmount);
							const index = activeAddress_o.index;

							const ledgerTrans_o = {
								fromAddr,
								toAddr,
								amount,
								index,
							};

							transaction = await signTransaction(ledgerTrans_o);
						}

						const txId = await factomCli.sendTransaction(transaction);
						await addAddressTransaction(activeAddressIndex_o, txId);

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
					[recipientAddressPath]: Yup.string()
						.required('Required')
						.test(
							recipientAddressPath,
							'Invalid Address',
							isValidPublicEcAddress
						),
					[entryCreditAmountPath]: Yup.number()
						.required('Required')
						.typeError('Must be a number')
						.positive('Must be greater than 0')
						.integer('Must be a whole number')
						.max(maxAmount, 'Insufficient Funds'),
					[walletImportTypePath]: Yup.string(),
					[privateKeyPath]: Yup.string().when(walletImportTypePath, {
						is: 'standard',
						then: Yup.string()
							.required('Required')
							.test(privateKeyPath, 'Invalid Key', this.verifyKey),
						otherwise: Yup.string().notRequired(),
					}),
					[seedPath]: Yup.string().when(walletImportTypePath, {
						is: 'seed',
						then: Yup.string()
							.trim()
							.required('Required')
							.test(seedPath, 'Invalid Seed Phrase', this.verifySeed),
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
					isValid,
				}) => (
					<Form
						autoComplete="nope"
						// eslint-disable-next-line
						autoComplete="off"
					>
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
									inputProps={{
										spellCheck: false,
										maxLength: ADDRESS_LENGTH,
										autoComplete: 'nope',
										// eslint-disable-next-line
										autoComplete: 'off',
									}}
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
											if (!isSubmitting) {
												setFieldValue('transactionError', null);
												setFieldValue(
													myFctWalletAnchorElPath,
													event.currentTarget
												);
											}
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
							<>
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
											inputProps={{
												spellCheck: false,
												maxLength: ADDRESS_LENGTH,
												autoComplete: 'nope',
												// eslint-disable-next-line
												autoComplete: 'off',
											}}
										/>
									)}
								</Field>
								<ErrorMessage
									name={privateKeyPath}
									render={(msg) => (
										<div className={classes.errorText}>{msg}</div>
									)}
								/>
							</>
						)}
						{_get(values, walletImportTypePath) === 'seed' && (
							<>
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
											inputProps={{
												autoComplete: 'nope',
												// eslint-disable-next-line
												autoComplete: 'off',
											}}
										/>
									)}
								</Field>
								<ErrorMessage
									name={seedPath}
									render={(msg) => (
										<div className={classes.errorText}>{msg}</div>
									)}
								/>
							</>
						)}

						{_get(values, entryCreditAmountPath) && isValid ? (
							<ConvertTransactionPreview
								networkProps={networkProps}
								ecAmount={_get(values, entryCreditAmountPath)}
								factoidAmount={
									this.state.ecRate *
									toFactoids(_get(values, entryCreditAmountPath))
								}
								sendFactoidFee={toFactoids(this.state.sendFactoshiFee)}
							/>
						) : (
							''
						)}
						<br />
						{!_isNil(values.transactionError) && (
							<Typography className={classes.transactionErrorText}>
								{values.transactionError}
							</Typography>
						)}
						<br />
						{_get(values, walletImportTypePath) === 'ledger' && (
							<Typography gutterBottom>
								<b>Note</b>: Windows 10 is not supported at this time due to an
								issue out of our control.
							</Typography>
						)}
						{isSubmitting ? (
							<>
								{values.transactionID !== null ? (
									<div>
										<Paper className={classes.transaction} elevation={2}>
											<CheckCircle
												nativeColor="#6fbf73"
												className={classes.successIcon}
											/>
											&nbsp;
											<Typography style={{ display: 'inline' }}>
												<b>Transaction ID:</b> {values.transactionID}
											</Typography>
											<br />
											<br />
											<Typography>
												This transaction will be visible{' '}
												<Tooltip title="Open Factom Explorer">
													<a
														target="_blank"
														rel="noopener noreferrer"
														href={
															networkProps.explorerURL +
															'/transaction?txid=' +
															values.transactionID
														}
													>
														here{' '}
														<OpenInNew
															color="primary"
															style={{ fontSize: 15 }}
														/>
													</a>
												</Tooltip>{' '}
												in 10-15 minutes, after being included in the next
												Factom block currently being processed by the
												blockchain. Funds are available for use immediately.
												<br />
											</Typography>
										</Paper>
										<br />
										<Button
											type="button"
											className="outline"
											color="primary"
											variant="contained"
											onClick={handleReset}
										>
											New Transaction
										</Button>
									</div>
								) : (
									<>
										<CircularProgress thickness={7} />
										{values.ledgerStatus}
									</>
								)}
							</>
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
	},
	errorText: { color: 'red', fontSize: '12px', textAlign: 'left' },
	pointer: {
		cursor: 'pointer',
	},
	transactionErrorText: { color: 'red', fontSize: '16px' },
	transaction: {
		borderColor: '#6fbf73',
		borderStyle: 'solid',

		paddingTop: 3,
		paddingBottom: 8,
	},
	successIcon: {
		position: 'relative',
		top: '5px',
	},
};

const enhancer = _flowRight(
	withNetwork,
	withLedger,
	withSeed,
	withWalletContext,
	withFactomCli,
	withStyles(styles)
);

export default enhancer(ConvertECForm);
