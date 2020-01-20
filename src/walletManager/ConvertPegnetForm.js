import React, { Component } from 'react';
import _flowRight from 'lodash/flowRight';
import _isNil from 'lodash/isNil';
import _get from 'lodash/get';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { withStyles } from '@material-ui/core/styles';
import { withFactomCli } from '../context/FactomCliContext';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CheckCircle from '@material-ui/icons/CheckCircleOutlined';
import AddressInfoHeader from './shared/AddressInfoHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import OpenInNew from '@material-ui/icons/OpenInNew';
import Tooltip from '@material-ui/core/Tooltip';
import { withWalletContext } from '../context/WalletContext';
import { withSeed } from '../context/SeedContext';
import { withNetwork } from '../context/NetworkContext';
import { withLedger } from '../context/LedgerContext';
import FormTextField from '../component/form/FormTextField';

import {
	FACTOSHI_MULTIPLIER,
	FACTOID_MULTIPLIER,
	ADDRESS_LENGTH,
	AMOUNT_REGEX,
	DISABLE_AUTOCOMPLETE,
} from '../constants/WALLET_CONSTANTS';
import { PFCT_LBL } from '../constants/PEGNET_CONSTANTS';
import axios from 'axios';

const AMOUNT_PATH = 'amount';
const KEY_PATH = 'key';
const KEY_TYPE_PATH = 'keyType';
const SEED_PATH = 'seed';

class convertPegnetForm extends Component {
	state = { sendFactoidFee: null, pFCTBalance: null };

	async componentDidMount() {
		const sendFactoidFee = await this.props.walletController.getFactoidFee();
		this.setState({ sendFactoidFee });

		/* axios
			.post(this.props.networkController.networkProps.pegnetApiUrl, {
				jsonrpc: '2.0',
				id: 0,
				method: 'get-transaction-status',
				params: {
					entryHash:
						'adedfeeb546c4f1f3f77919fff78f2e06af5e91cafee6f78b4aa5fd5756b3827',
				},
			})
			.then((res) => {
				console.log('Response');
				console.log(res);
				console.log(res.data);
			})
			.catch((error) => {
				console.log('Error');

				if (error.response) {
					this.errors(error.response.message);
				} else if (error.request) {
					console.log('error.request');
				} else {
					console.log('Error', error);
				}
				console.log('rejected');
			});
 */
		this.updatepFCTBalance();
	}

	updatepFCTBalance = async () => {
		const activeAddress_o = this.props.walletController.getActiveAddress();

		await axios
			.post(this.props.networkController.networkProps.pegnetApiUrl, {
				jsonrpc: '2.0',
				id: 0,
				method: 'get-pegnet-balances',
				params: {
					address: activeAddress_o.address,
				},
			})
			.then((res) => {
				console.log(res.data);
				this.setState({ pFCTBalance: res.data.result.pFCT });
			})
			.catch((error) => {
				console.log('Error');

				if (error.response) {
					this.errors(error.response.message);
				} else if (error.request) {
					console.log('error.request');
				} else {
					console.log('Error', error);
				}
				console.log('rejected');
			});
	};

	getMaxFCT(balance, fee) {
		const maxFactoids = balance * FACTOSHI_MULTIPLIER - fee;
		if (maxFactoids < 0) {
			return 0;
		}
		return maxFactoids;
	}

	verifyKey = (key) => {
		const activeAddress_o = this.props.walletController.getActiveAddress();

		return this.props.walletController.verifyKey(key, activeAddress_o);
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
				getActiveAddress,
				updateBalances,
				activeAddressIndex_o,
				addAddressTransaction,
			},
			networkController: { networkProps },
		} = this.props;

		const activeAddress_o = getActiveAddress();

		const maxAmount = activeAddress_o.balance * FACTOSHI_MULTIPLIER;

		const minAmount = this.state.sendFactoidFee;

		return (
			<Formik
				enableReinitialize
				initialValues={{
					[AMOUNT_PATH]: '',
					[KEY_PATH]: '',
					[KEY_TYPE_PATH]: activeAddress_o.importType, // needed for Yup
					[SEED_PATH]: '',
					transactionID: null,
					ledgerStatus: null,
					transactionError: null,
					reinitialize: activeAddress_o.address,
				}}
				onSubmit={async (values, actions) => {
					const { amount, key, seed, keyType } = values;
					const factoshipFCTAmount = Math.round(FACTOID_MULTIPLIER * amount);

					let transaction = {};

					try {
						if (keyType === 'standard') {
							console.log('Standard sign');

							transaction = this.props.walletController.signConvertToPFCT({
								key,
								amount: factoshipFCTAmount,
							});
						} else if (keyType === 'seed') {
							console.log('Seed sign');

							transaction = this.props.seedController.signConvertToPFCT({
								mnemonic: seed.trim(),
								index: activeAddress_o.index,
								amount: factoshipFCTAmount,
							});
						} else if (keyType === 'ledger') {
							console.log('Ledger sign');

							const ledgerController = this.props.ledgerController;

							actions.setFieldValue(
								'ledgerStatus',
								'Connecting to Ledger Nano S'
							);
							const ledgerConnected = await ledgerController.isLedgerConnected();

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

							transaction = await ledgerController.signConvertToPFCT({
								fromAddr: activeAddress_o.address,
								amount: factoshipFCTAmount,
								index: activeAddress_o.index,
							});
						}

						const txId = await factomCli.sendTransaction(transaction, {
							force: true,
						});
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
					[AMOUNT_PATH]: Yup.number()
						.required('Required')
						.typeError('Must be a number')
						.min(
							minAmount,
							'Must be more than ' +
								minAmount +
								' ' +
								networkProps.factoidAbbreviation
						)
						.max(maxAmount, 'Insufficient Funds'),
					[KEY_TYPE_PATH]: Yup.string(),
					[KEY_PATH]: Yup.string().when(KEY_TYPE_PATH, {
						is: 'standard',
						then: Yup.string()
							.required('Required')
							.test(KEY_PATH, 'Invalid Key', this.verifyKey),
						otherwise: Yup.string().notRequired(),
					}),
					[SEED_PATH]: Yup.string().when(KEY_TYPE_PATH, {
						is: 'seed',
						then: Yup.string()
							.trim()
							.required('Required')
							.test(SEED_PATH, 'Invalid Seed Phrase', this.verifySeed),
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
					<Form {...DISABLE_AUTOCOMPLETE}>
						<AddressInfoHeader />
						<br />
						<Paper className={classes.pegnetPaper} elevation={2}>
							<Typography align="left">Pegnet Balances</Typography>
							<br />
							<Typography align="left">
								{!_isNil(this.state.pFCTBalance)
									? this.state.pFCTBalance * FACTOSHI_MULTIPLIER +
									  ' ' +
									  PFCT_LBL
									: 'Loading...'}
							</Typography>
						</Paper>
						<br />
						<FormTextField
							type="number"
							name={AMOUNT_PATH}
							isNotFast
							error={errors[AMOUNT_PATH] && touched[AMOUNT_PATH] ? true : false}
							onChange={(e) => {
								if (
									e.target.value === '' ||
									AMOUNT_REGEX.test(e.target.value)
								) {
									handleChange(e);
								}
							}}
							placeholder={'Enter Amount of (' + PFCT_LBL + ')'}
							label="Amount"
							fullWidth={true}
							disabled={isSubmitting}
						/>

						<Grid container justify="space-between">
							<Grid item />
							<Grid item>
								<Typography
									variant="caption"
									onClick={() => {
										if (!isSubmitting) {
											setFieldValue(AMOUNT_PATH, maxAmount);
										}
									}}
									className={classes.pointer}
								>
									Use Max
								</Typography>
							</Grid>
						</Grid>
						{_get(values, KEY_TYPE_PATH) === 'standard' && (
							<FormTextField
								name={KEY_PATH}
								isNotFast
								error={errors[KEY_PATH] && touched[KEY_PATH] ? true : false}
								placeholder={'Enter Private Key'}
								label="Private Key"
								fullWidth={true}
								disabled={isSubmitting}
								inputProps={{
									spellCheck: false,
									maxLength: ADDRESS_LENGTH,
									...DISABLE_AUTOCOMPLETE,
								}}
							/>
						)}
						{_get(values, KEY_TYPE_PATH) === 'seed' && (
							<FormTextField
								name={SEED_PATH}
								isNotFast
								error={
									_get(errors, SEED_PATH) && _get(touched, SEED_PATH)
										? true
										: false
								}
								inputProps={{
									...DISABLE_AUTOCOMPLETE,
								}}
								placeholder={'Enter mnemonic seed phrase'}
								label="Seed Phrase"
								fullWidth={true}
								disabled={isSubmitting}
							/>
						)}

						{/* {values.sendFactoidAmount ? (
							<SendTransactionPreview
								networkProps={networkProps}
								factoidAmount={values.sendFactoidAmount}
								sendFactoidFee={this.state.sendFactoidFee}
							/>
						) : (
							''
						)} */}

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
												blockchain.
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
								{'Convert to pFCT'}
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

convertPegnetForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = {
	sendButton: {
		width: '50%',
	},
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
	pegnetPaper: {
		padding: '10px',
		boxShadow:
			'inset 0px 0px 5px 0px rgba(0,0,0,0.2), inset 0px 0px 2px 0px rgba(0,0,0,0.14), inset 0px 0px 1px -2px rgba(0,0,0,0.12)',
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

export default enhancer(convertPegnetForm);
