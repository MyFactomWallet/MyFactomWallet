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
import TransactionPreview from './TransactionPreview';
import factombip44 from 'factombip44/dist/factombip44';
import { withNetwork } from '../Context/NetworkContext';
import { withLedger } from '../Context/LedgerContext';
import {
	isValidFctPrivateAddress,
	isValidFctPublicAddress,
} from 'factom/dist/factom';

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

class SendFactoidForm extends Component {
	state = { sendFactoidFee: null };

	async componentDidMount() {
		const sendFactoidFee = await this.props.walletController.getFactoidFee();
		this.setState({ sendFactoidFee });
	}

	handleKeyPress(event) {
		if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
			event.preventDefault();
		}
	}

	getMax(balance, fee) {
		return balance * FACTOSHI_MULTIPLIER - fee;
	}

	render() {
		const {
			classes,
			factomCliController: { factomCli },
			walletController: {
				getFactoidAddresses,
				getActiveAddress,
				updateBalances,
				signWithSeed,
			},
			ledgerController: { signWithLedger },
		} = this.props;

		const factoidAddresses = getFactoidAddresses();
		const activeAddress_o = getActiveAddress();

		return (
			<Formik
				initialValues={{
					sendFactoidAmount: '',
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
							const mnemonic = seed;
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
					[sendFactoidAmountPath]: Yup.string().required('Required'),
					[recipientAddressPath]: Yup.string().test(
						recipientAddressPath,
						'Invalid Address',
						isValidFctPublicAddress
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
									label="Recipient FCT address"
									fullWidth={true}
									type="text"
									placeholder="Enter Factoid Address"
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
										setFieldValue('transactionError', null);
										setFieldValue(myFctWalletAnchorElPath, event.currentTarget);
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
									placeholder="Enter Amount (FCT)"
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
									onClick={(event) => {
										setFieldValue(
											sendFactoidAmountPath,
											this.getMax(
												activeAddress_o.balance,
												this.state.sendFactoidFee
											)
										);
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

						{values.sendFactoidAmount ? (
							<TransactionPreview
								factoidAmount={values.sendFactoidAmount}
								sendFactoidFee={this.state.sendFactoidFee}
							/>
						) : (
							''
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
											variant="raised"
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
								variant="raised"
								color="primary"
								type="submit"
								disabled={isSubmitting}
							>
								Send Factoids
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
};

const enhancer = _flowRight(
	withNetwork,
	withLedger,
	withWalletContext,
	withFactomCli,
	withStyles(styles)
);

export default enhancer(SendFactoidForm);
