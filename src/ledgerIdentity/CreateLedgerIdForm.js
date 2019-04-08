import React from 'react';
import { Formik, Form, FieldArray, Field } from 'formik';
import _isNil from 'lodash/isNil';
import _flowRight from 'lodash/flowRight';
import _get from 'lodash/get';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';
import LabelImportant from '@material-ui/icons/LabelImportant';
import Grid from '@material-ui/core/Grid';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import SectionHeader from '../vote/shared/SectionHeader';
import FormTextField from '../component/form/FormTextField';
import FormSelectField from '../component/form/FormSelectField';
import { withLedger } from '../context/LedgerContext';
import { withIdentity } from '../context/IdentityContext';
import { withVote } from '../context/VoteContext';
import { withNetwork } from '../context/NetworkContext';
import CircularProgress from '@material-ui/core/CircularProgress';
import { isValidPrivateEcAddress } from 'factom/dist/factom';
import ExplorerLink from '../vote/shared/ExplorerLink';

/**
 * Constants
 */
const transactionErrorPath = 'transactionError';
const workingNamePath = 'workingName';
const numberPath = 'number';
const identityNamesPath = 'identityNames';
const ecPrivateKeyPath = 'ecPrivateKey';
const statusPath = 'status';

const identityChainIdPath = 'identityChainId';
const entryHashPath = 'entryHash';

const MAX_NUMBER = 10;
let NUMBER_VALUES = new Array(MAX_NUMBER);
for (var i = 0; i < MAX_NUMBER; i++) {
	NUMBER_VALUES[i] = { value: i + 1, text: i + 1 + '' };
}

class CreateLedgerIdForm extends React.Component {
	handleKeyPress(event) {
		if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
			event.preventDefault();
		}
	}

	validateIdentityName = (value) => {
		let error;

		if (this.hasItem(value, this.identityNames)) {
			error = 'Duplicate';
		}

		return error;
	};

	validateEcPrivateKey = async (value) => {
		if (!isValidPrivateEcAddress(value)) {
			return 'Invalid Key';
		}
	};

	hasItem = (item, array) => array.findIndex((value) => value === item) !== -1;

	render() {
		const {
			classes,
			ledgerController: { getLedgerAddresses },
			identityController: { registerIdentity },
			networkController: { networkProps },
		} = this.props;

		const entryHashURL = networkProps.explorerURL + '/entry?hash=';

		return (
			<Formik
				enableReinitialize
				initialValues={{
					workingName: '',
					identityNames: [],
					number: '',
					ecPrivateKey: '',
					transactionError: null,
					status: null,
					identityChainId: null,
					entryHash: null,
				}}
				validationSchema={Yup.object().shape({
					number: Yup.string().required('Required'),
					identityNames: Yup.array().required('Required *'),
				})}
				onSubmit={async (values, actions) => {
					actions.setFieldValue(transactionErrorPath, null);

					actions.setFieldValue(statusPath, 'Connecting to Ledger Nano S');

					try {
						// setup identity data
						let idPubKeys = await getLedgerAddresses(
							0,
							_get(values, numberPath),
							'identity'
						);
						idPubKeys = idPubKeys.map((value) => value.address);

						let reg_id_args = {
							idPubKeys,
							idNames: _get(values, identityNamesPath),
							ecPrivateKey: _get(values, ecPrivateKeyPath),
						};

						actions.setFieldValue(
							statusPath,
							'Registering new identity to Factom blockchain'
						);

						// create identity and get back hash
						const result = await registerIdentity(reg_id_args);

						// success
						const chainId = result.chainId;
						const entryHash = result.entryHash;
						actions.setFieldValue(identityChainIdPath, chainId);
						actions.setFieldValue(entryHashPath, entryHash);
					} catch (e) {
						console.log(e);
						await actions.resetForm();
						await actions.setFieldValue(
							identityNamesPath,
							_get(values, identityNamesPath)
						);
						await actions.setFieldValue(numberPath, _get(values, numberPath));
						await actions.setFieldValue(
							ecPrivateKeyPath,
							_get(values, ecPrivateKeyPath)
						);

						actions.setFieldValue(transactionErrorPath, 'Error: ' + e.message);
					}
				}}
				render={({
					isSubmitting,
					errors,
					touched,
					values,
					setFieldValue,
					submitCount,
					handleReset,
				}) => {
					this.identityNames = _get(values, identityNamesPath);

					return (
						<Form onKeyPress={this.handleKeyPress}>
							<Grid container>
								<Grid item xs={12}>
									<SectionHeader text="1. Select Identity Names" />
								</Grid>
								<Grid item xs={12}>
									{submitCount > 0 && (
										<Field
											name={identityNamesPath}
											render={({ form }) => {
												const error = _get(form.errors, identityNamesPath);
												return error ? (
													<div className={classes.errorText}>{error}</div>
												) : null;
											}}
											disabled={isSubmitting}
										/>
									)}
								</Grid>
								<Grid item xs={12}>
									<Paper elevation={2} className={classes.paper}>
										<List className={classes.identityNameList} dense>
											<FieldArray
												name={identityNamesPath}
												render={(arrayHelpers) => (
													<Grid container>
														<Grid item xs={9}>
															<FormTextField
																name={workingNamePath}
																validate={this.validateIdentityName}
																isNotFast
																label="Identity Name *"
																error={
																	_get(errors, workingNamePath) &&
																	_get(touched, workingNamePath)
																}
																onKeyPress={(e) => {
																	if (
																		e.which === 13 /* Enter */ &&
																		e.target.value.trim() &&
																		_isNil(
																			this.validateIdentityName(e.target.value)
																		)
																	) {
																		arrayHelpers.push(
																			_get(values, workingNamePath)
																		);
																		// reset input
																		setFieldValue(workingNamePath, '');
																	}
																}}
																disabled={isSubmitting}
															/>
														</Grid>
														<Grid item xs={3}>
															<Button
																variant="contained"
																component="span"
																onClick={() => {
																	if (
																		_isNil(
																			this.validateIdentityName(
																				_get(values, workingNamePath)
																			)
																		)
																	) {
																		arrayHelpers.push(
																			_get(values, workingNamePath)
																		);
																		// reset input
																		setFieldValue(workingNamePath, '');
																	}
																}}
																disabled={!_get(values, workingNamePath)}
															>
																Add
															</Button>
														</Grid>

														<Grid item xs={12}>
															{_get(values, identityNamesPath).length > 0
																? _get(values, identityNamesPath).map(
																		(option, index) => (
																			<ListItem
																				key={index}
																				disableGutters
																				divider
																				className={classes.identityNameListItem}
																			>
																				<LabelImportant
																					style={{ fontSize: 15 }}
																				/>
																				<ListItemText primary={option} />
																				<IconButton
																					onClick={() => {
																						arrayHelpers.remove(index);
																					}}
																					aria-label="Clear"
																					disabled={isSubmitting}
																				>
																					<Clear />
																				</IconButton>
																			</ListItem>
																		)
																  )
																: ''}
														</Grid>
													</Grid>
												)}
											/>
										</List>
									</Paper>
								</Grid>

								<Grid item xs={12}>
									<br />
									<br />
									<SectionHeader text="2. Select number of Ledger keys to activate" />
								</Grid>
								<Grid item xs={12}>
									<FormSelectField
										name={numberPath}
										label="Number of keys *"
										type="number"
										isNotFast
										disabled={isSubmitting}
										error={
											_get(errors, numberPath) && _get(touched, numberPath)
										}
										width={215}
										options={NUMBER_VALUES}
										minWidth="200px"
									/>
								</Grid>
								<Grid item xs={12}>
									<br />
									<br />
									<SectionHeader text="3. Enter payment information" />
								</Grid>
								<Grid item xs={12}>
									<FormTextField
										name={ecPrivateKeyPath}
										label="EC Private Key *"
										disabled={isSubmitting}
										error={
											_get(errors, ecPrivateKeyPath) &&
											_get(touched, ecPrivateKeyPath)
										}
										fullWidth
										validate={this.validateEcPrivateKey}
									/>
								</Grid>
								{!_isNil(_get(values, transactionErrorPath)) && (
									<Grid item xs={12}>
										<br />
										<Typography className={classes.errorText}>
											{_get(values, transactionErrorPath)}
										</Typography>
									</Grid>
								)}
								{!_isNil(_get(values, identityChainIdPath)) ? (
									<Grid item xs={12}>
										<br />
										<Paper className={classes.transaction}>
											<SectionHeader text="Success!" color="green" />

											<Typography gutterBottom>
												Your new Factom identity is pending confirmation. The
												entry will be visible in 10-15 minutes, after being
												included in the next block currently being processed by
												the Factom blockchain.
											</Typography>
											<br />
											<Typography variant="subtitle2">
												Remember to copy down your Identity Chain ID.
											</Typography>
											<br />
											<ExplorerLink
												label="Identity Chain ID"
												value={_get(values, identityChainIdPath)}
												href={entryHashURL + _get(values, entryHashPath)}
												extend={true}
											/>
										</Paper>
										<br />
										<Button
											type="button"
											color="primary"
											variant="contained"
											onClick={handleReset}
										>
											Reset
										</Button>
									</Grid>
								) : (
									<Grid item xs={12}>
										<br />
										<br />
										<Button
											type="submit"
											variant="contained"
											color="primary"
											disabled={isSubmitting}
										>
											Create Identity
											{isSubmitting && (
												<>
													&nbsp;&nbsp;
													<CircularProgress thickness={5} size={20} />
												</>
											)}
										</Button>
										{isSubmitting && _get(values, statusPath) && (
											<Typography className={classes.status}>
												{_get(values, statusPath)}
											</Typography>
										)}
									</Grid>
								)}
							</Grid>
						</Form>
					);
				}}
			/>
		);
	}
}

CreateLedgerIdForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	errorText: { color: 'red', fontSize: '16px' },
	status: { display: 'inline-block', paddingLeft: '10px' },
	identityNameList: {
		overflow: 'auto',
	},
	identityNameListItem: {
		padding: '0px',
		wordWrap: 'break-word',
	},
	paper: { padding: 15, width: '50%' },
	transaction: {
		borderColor: '#6fbf73',
		borderStyle: 'solid',
		padding: '10px',
	},
	successIcon: {
		position: 'relative',
		top: '5px',
	},
});

const enhancer = _flowRight(
	withNetwork,
	withVote,
	withIdentity,
	withLedger,
	withStyles(styles)
);

export default enhancer(CreateLedgerIdForm);
