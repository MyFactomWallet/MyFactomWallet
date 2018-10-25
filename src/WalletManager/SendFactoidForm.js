import React, { Component } from 'react';
import _flowRight from 'lodash/flowRight';
import _isNil from 'lodash/isNil';
import _get from 'lodash/get';
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
import AddressInfoHeader from './Shared/AddressInfoHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withWalletContext } from '../Context/WalletContext';
import SendTransactionPreview from './SendTransactionPreview';
import { withNetwork } from '../Context/NetworkContext';
import { withLedger } from '../Context/LedgerContext';
import { isValidFctPublicAddress } from 'factom/dist/factom';
import Paper from '@material-ui/core/Paper';
import CheckCircle from '@material-ui/icons/CheckCircleOutlined';

/**
 * Constants
 */
const sendFactoidAmountPath = 'sendFactoidAmount';
const recipientAddressPath = 'recipientAddress';
const myFctWalletAnchorElPath = 'myFctWalletAnchorEl';
const privateKeyPath = 'privateKey';
const seedPath = 'seed';
const walletImportTypePath = 'walletImportType';

const FACTOSHI_MULTIPLIER = 0.00000001;
const FACTOID_MULTIPLIER = 100000000;
const FCT_ADDRESS_LENGTH = 52;

class SendFactoidForm extends Component {
	state = { sendFactoidFee: null };

	async componentDidMount() {
		const sendFactoidFee = await this.props.walletController.getFactoidFee();
		this.setState({ sendFactoidFee });
	}

	getMaxFCT(balance, fee) {
		const maxFactoids = balance * FACTOSHI_MULTIPLIER - fee;
		if (maxFactoids < 0) {
			return 0;
		}
		return maxFactoids;
	}

	verifyKey = (privateKey) => {
		const activeAddress_o = this.props.walletController.getActiveAddress();

		return this.props.walletController.verifyKey(privateKey, activeAddress_o);
	};

	verifySeed = (seed) => {
		const activeAddress_o = this.props.walletController.getActiveAddress();

		return this.props.walletController.verifySeed(seed, activeAddress_o);
	};

	render() {
		const {
			classes,
			factomCliController: { factomCli },
			walletController: {
				getFactoidAddresses,
				getActiveAddress,
				updateBalances,
				signWithSeed,
				activeAddressIndex_o,
				addAddressTransaction,
			},
			ledgerController: { signWithLedger },
			networkController: { networkProps },
		} = this.props;

		const factoidAddresses = getFactoidAddresses();
		const activeAddress_o = getActiveAddress();

		const maxAmount = this.getMaxFCT(
			activeAddress_o.balance,
			this.state.sendFactoidFee
		);

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
					try {
						if (importType === 'standard') {
							transaction = await factomCli.createFactoidTransaction(
								privateKey,
								recipientAddress,
								FACTOID_MULTIPLIER * sendFactoidAmount
							);
						} else if (importType === 'seed') {
							const mnemonic = seed.trim();
							const index = activeAddress_o.index;
							const toAddr = recipientAddress;
							const amount = sendFactoidAmount * FACTOID_MULTIPLIER;
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
							const amount = sendFactoidAmount * FACTOID_MULTIPLIER;
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
							isValidFctPublicAddress
						),
					[sendFactoidAmountPath]: Yup.number()
						.required('Required')
						.positive('Must be a positive number')
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
				}) => (
					<Form autoComplete="nope">
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
										maxLength: FCT_ADDRESS_LENGTH,
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
											inputProps={{
												spellCheck: false,
												maxLength: FCT_ADDRESS_LENGTH,
												autoComplete: 'nope',
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
							</React.Fragment>
						)}
						{_get(values, walletImportTypePath) === 'seed' && (
							<React.Fragment>
								<Field name={seedPath}>
									{({ field, form }) => (
										<TextField
											inputProps={{
												autoComplete: 'nope',
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
							</React.Fragment>
						)}

						{values.sendFactoidAmount ? (
							<SendTransactionPreview
								networkProps={networkProps}
								factoidAmount={values.sendFactoidAmount}
								sendFactoidFee={this.state.sendFactoidFee}
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
							<React.Fragment>
								{values.transactionID !== null ? (
									<div>
										<Paper className={classes.transaction}>
											<CheckCircle
												nativeColor="#6fbf73"
												className={classes.successIcon}
											/>
											&nbsp;
											<Typography style={{ display: 'inline' }}>
												<b>Transaction ID:</b> {values.transactionID}
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
									<React.Fragment>
										<CircularProgress thickness={7} />
										{values.ledgerStatus}
									</React.Fragment>
								)}
							</React.Fragment>
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
		height: '24px',
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
	withWalletContext,
	withFactomCli,
	withStyles(styles)
);

export default enhancer(SendFactoidForm);
