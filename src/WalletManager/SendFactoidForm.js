import React, { Component } from 'react';
import _flowRight from 'lodash/flowRight';
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
import WalletInfoHeader from './Shared/WalletInfoHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withWalletContext } from '../Context/WalletContext';
import TransactionPreview from './TransactionPreview';
import Fct from '@factoid.org/hw-app-fct';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import { withNetwork } from '../Context/NetworkContext';
import {
	isValidFctPrivateAddress,
	isValidFctPublicAddress,
	Transaction,
} from 'factom/dist/factom';

/**
 * CONSTANTS
 */
const sendFactoidAmountPath = 'sendFactoidAmount';
const recipientAddressPath = 'recipientAddress';
const myFctWalletAnchorElPath = 'myFctWalletAnchorEl';
const privateKeyPath = 'privateKey';

const FACTOSHI_MULTIPLIER = 0.00000001;
const FACTOID_MULTIPLIER = 100000000;

class SendFactoidForm extends Component {
	handleKeyPress(event) {
		if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
			event.preventDefault();
		}
	}

	getMax(balance, fee) {
		return balance * FACTOSHI_MULTIPLIER - fee;
	}

	signWithLedger = async ({ fromAddr, toAddr, amount, fee, index }) => {
		try {
			let signedTX = {};
			let transport = await TransportU2F.create();

			const bip32Account = this.props.networkController.networkProps
				.bip32Account;
			const path = "44'/131'/" + bip32Account + "'/0'/" + index + "'";

			const ledger = new Fct(transport);

			const unsignedTX = Transaction.builder()
				.input(fromAddr, amount + fee)
				.output(toAddr, amount)
				.build();

			const result = await ledger.signTransaction(
				path,
				unsignedTX.marshalBinarySig.toString('hex')
			);

			if (result) {
				signedTX = Transaction.builder(unsignedTX)
					.rcdSignature(
						Buffer.from(result['r'], 'hex'),
						Buffer.from(result['s'], 'hex')
					)
					.build();
			}
			transport.close();
			return signedTX;
		} catch (err) {
			console.error('Failed signTx from Ledger :', err);
		}
	};

	render() {
		const { classes } = this.props;
		const { factomCli } = this.props.factomCliController;

		const {
			getFctAddresses,
			getActiveFctAddress,
			updateBalances,
			getFactoshiFee,
			activeFctAddressIndex,
			getFactoidFee,
		} = this.props.walletController;

		const factoidAddresses = getFctAddresses();
		const sendFactoidFee = getFactoidFee();
		const activeFctWallet = getActiveFctAddress();

		return (
			<Formik
				enableReinitialize
				initialValues={{
					sendFactoidAmount: '',
					recipientAddress: '',
					myFctWalletAnchorEl: null,
					privateKey: '',
					transactionID: null,
					reinitialize: activeFctAddressIndex,
					walletType: activeFctWallet.type,
				}}
				onSubmit={async (values, actions) => {
					const { sendFactoidAmount, recipientAddress, privateKey } = values;
					let transaction = {};

					if (values.walletType === 'standard') {
						transaction = await factomCli.createFactoidTransaction(
							privateKey,
							recipientAddress,
							FACTOID_MULTIPLIER * sendFactoidAmount
						);
					} else if (values.walletType === 'ledger') {
						const fromAddr = activeFctWallet.address;
						const toAddr = recipientAddress;
						const amount = sendFactoidAmount * FACTOID_MULTIPLIER;
						const fee = getFactoshiFee();
						const index = activeFctWallet.index;

						const ledgerTrans_o = {
							fromAddr,
							toAddr,
							amount,
							fee,
							index,
						};

						transaction = await this.signWithLedger(ledgerTrans_o);
					}

					try {
						if (transaction instanceof Transaction) {
							const txId = await factomCli.sendTransaction(transaction);
							actions.setFieldValue('transactionID', txId);
							updateBalances();
						} else {
							console.log('Not a Transaction');
						}
					} catch (err) {
						console.log(err);
						actions.resetForm();
					}
				}}
				validationSchema={Yup.object().shape({
					sendFactoidAmount: Yup.string().required('Required'),
					recipientAddress: Yup.string().test(
						recipientAddressPath,
						'Invalid Address',
						isValidFctPublicAddress
					),
					walletType: Yup.string(),
					privateKey: Yup.string().when('walletType', {
						is: 'standard',
						then: Yup.string().test(
							privateKeyPath,
							'Invalid Key',
							isValidFctPrivateAddress
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
				}) => (
					<Form onKeyPress={this.handleKeyPress}>
						<WalletInfoHeader wallet={activeFctWallet} />

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
									activeFctWallet={activeFctWallet}
								/>
								<Typography
									variant="caption"
									aria-owns={
										values[myFctWalletAnchorElPath] ? 'simple-menu' : null
									}
									aria-haspopup="true"
									onClick={(event) => {
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
											this.getMax(activeFctWallet.balance, sendFactoidFee)
										);
									}}
									className={classes.pointer}
								>
									Use Max
								</Typography>
							</Grid>
						</Grid>
						{values.walletType === 'standard' && (
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
												'Enter Private Key for ' + activeFctWallet.nickname
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

						{values.sendFactoidAmount ? (
							<TransactionPreview factoidAmount={values.sendFactoidAmount} />
						) : (
							''
						)}
						<br />
						<br />
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
									<CircularProgress thickness={7} />
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
	const { values, setFieldValue, factoidAddresses, activeFctWallet } = props;

	const addressList = factoidAddresses
		.filter((address_o) => address_o.address !== activeFctWallet.address)
		.map((address_o, index) => (
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
	pointer: {
		cursor: 'pointer',
	},
};

const enhancer = _flowRight(
	withNetwork,
	withWalletContext,
	withFactomCli,
	withStyles(styles)
);

export default enhancer(SendFactoidForm);
