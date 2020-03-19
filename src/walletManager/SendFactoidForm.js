import React, { Component } from 'react';
import _flowRight from 'lodash/flowRight';
import _isNil from 'lodash/isNil';
import _get from 'lodash/get';
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
import Paper from '@material-ui/core/Paper';
import CheckCircle from '@material-ui/icons/CheckCircleOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';
import OpenInNew from '@material-ui/icons/OpenInNew';
import Tooltip from '@material-ui/core/Tooltip';
import { isValidPublicFctAddress } from 'factom/dist/factom';

import { withFactomCli } from '../context/FactomCliContext';
import { withWalletContext } from '../context/WalletContext';
import { withSeed } from '../context/SeedContext';
import { withNetwork } from '../context/NetworkContext';
import { withLedger } from '../context/LedgerContext';
import SendTransactionPreview from './SendTransactionPreview';
import AddressInfoHeader from './shared/AddressInfoHeader';
import { ADDRESS_LENGTH, FACTOID_REGEX } from '../constants/WALLET_CONSTANTS';
import { toFactoshis, toFactoids, minusBig } from '../utils';

/**
 * Constants
 */
const sendFactoidAmountPath = 'sendFactoidAmount';
const recipientAddressPath = 'recipientAddress';
const myFctWalletAnchorElPath = 'myFctWalletAnchorEl';
const privateKeyPath = 'privateKey';
const seedPath = 'seed';
const walletImportTypePath = 'walletImportType';

class SendFactoidForm extends Component {
	state = { sendFactoshiFee: null };

	async componentDidMount() {
		const sendFactoshiFee = await this.props.walletController.getFactoshiFee();
		this.setState({ sendFactoshiFee });
	}

	insufficientFundsMessage = () => {
		return `Insufficient Funds (Transaction Fee is ${toFactoids(
			this.state.sendFactoshiFee
		)} ${this.props.networkController.networkProps.factoidAbbreviation})`;
	};

	getMaxFactoshis = (balance, fee) => {
		const maxFactoshis = minusBig(balance, fee);
		if (maxFactoshis < 0) {
			return 0;
		}
		return maxFactoshis;
	};

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
			factomCliController: { factomCli },
			walletController: {
				getFactoidAddresses,
				getActiveAddress,
				updateBalances,
				activeAddressIndex_o,
				addAddressTransaction,
			},
			ledgerController: { signTransaction },
			networkController: { networkProps },
			seedController: { signWithSeed },
		} = this.props;

		const factoidAddresses = getFactoidAddresses();
		const activeAddress_o = getActiveAddress();

		let maxAmount;
		if (this.state.sendFactoshiFee != null) {
			const maxFactoshis = this.getMaxFactoshis(
				activeAddress_o.balance,
				this.state.sendFactoshiFee
			);
			maxAmount = toFactoids(maxFactoshis);
		}

		return (
			<Formik
				enableReinitialize
				initialValues={{
					sendFactoidAmount: '',
					recipientAddress: '',
					myFctWalletAnchorEl: null,
					[privateKeyPath]: '',
					[seedPath]: '',
					[walletImportTypePath]: activeAddress_o.importType,
					transactionID: null,
					ledgerStatus: null,
					transactionError: null,
					addressToReinitialize: activeAddress_o.address,
				}}
				onSubmit={async (values, actions) => {
					const {
						sendFactoidAmount,
						recipientAddress,
						privateKey,
						seed,
					} = values;
					let transaction = {};
					const importType = _get(values, walletImportTypePath);
					const amount = toFactoshis(sendFactoidAmount);
					const toAddr = recipientAddress;
					try {
						if (importType === 'standard') {
							transaction = await factomCli.createFactoidTransaction(
								privateKey,
								toAddr,
								amount
							);
						} else if (importType === 'seed') {
							const mnemonic = seed.trim();
							const index = activeAddress_o.index;
							const type = 'sendFCT';

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
							isValidPublicFctAddress
						),
					[sendFactoidAmountPath]: Yup.number()
						.required('Required')
						.typeError('Must be a number')
						.positive('Must be greater than 0')
						.test(sendFactoidAmountPath, 'Limit 8 decimal places', (value) =>
							(value + '').match(FACTOID_REGEX)
						)
						.max(maxAmount, this.insufficientFundsMessage),
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
										'Recipient ' + networkProps.factoidAbbreviation + ' address'
									}
									fullWidth={true}
									type="text"
									placeholder={
										'Enter ' + networkProps.factoidAbbreviationFull + ' Address'
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
							<Grid item>
								<FactoidAddressMenu
									values={values}
									setFieldValue={setFieldValue}
									factoidAddresses={factoidAddresses}
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
						</Grid>

						<Field name={sendFactoidAmountPath}>
							{({ field, form }) => (
								<TextField
									type="number"
									error={
										errors[sendFactoidAmountPath] &&
										touched[sendFactoidAmountPath]
											? true
											: false
									}
									{...field}
									placeholder={
										'Enter Amount (' + networkProps.factoidAbbreviation + ')'
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
									name={sendFactoidAmountPath}
									render={(msg) => (
										<div className={classes.errorText}>{msg}</div>
									)}
								/>
							</Grid>
							<Grid item>
								<Typography
									variant="caption"
									onClick={() => {
										if (!isSubmitting) {
											setFieldValue(sendFactoidAmountPath, maxAmount);
										}
									}}
									className={classes.pointer}
								>
									Use Max
								</Typography>
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
											inputProps={{
												autoComplete: 'nope',
												// eslint-disable-next-line
												autoComplete: 'off',
											}}
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
							</>
						)}
						{values.sendFactoidAmount && isValid ? (
							<SendTransactionPreview
								networkProps={networkProps}
								factoidAmount={values.sendFactoidAmount}
								sendFactoshiFee={this.state.sendFactoshiFee}
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
											<Typography gutterBottom style={{ display: 'inline' }}>
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
								{'Send ' + networkProps.factoidAbbreviationFull + 's'}
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

function FactoidAddressMenu(props) {
	const { values, setFieldValue, factoidAddresses } = props;

	const addressList = factoidAddresses.map((address_o, index) => (
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

SendFactoidForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = {
	sendButton: {
		width: '50%',
	},
	errorText: { color: 'red', fontSize: '12px', textAlign: 'left' },
	transactionErrorText: { color: 'red', fontSize: '16px' },
	pointer: {
		cursor: 'pointer',
	},
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

export default enhancer(SendFactoidForm);
