import React from 'react';
import { Formik, Form } from 'formik';
import _isNil from 'lodash/isNil';
import _flowRight from 'lodash/flowRight';
import _get from 'lodash/get';
import { withStyles } from '@material-ui/core/styles';
import { withVote } from '../../context/VoteContext';
import { withNetwork } from '../../context/NetworkContext';
import { withFactomCli } from '../../context/FactomCliContext';
import { withLedger } from '../../context/LedgerContext';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import SectionHeader from '../shared/SectionHeader';
import FormTextField from '../../component/form/FormTextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { isValidPrivateEcAddress } from 'factom/dist/factom';
import { computeVoteCreationCost } from 'factom-vote/dist/factom-vote';
import { digital } from 'factom-identity-lib';
import { REGEX_CHAIN_ID } from './VOTE_CONSTANTS';
import { EC_PRIV, IDENTITY } from './VOTE_EXAMPLE_DATA';

/**
 * Constants
 */
const MANUAL_SIG = 'manual';
const LEDGER_SIG = 'ledger';
const identityChainIDPath = 'identityChainID';
const identityKeyPath = 'identityKey';
const ecPrivateKeyPath = 'ecPrivateKey';
const transactionErrorPath = 'transactionError';
const ledgerStatusPath = 'ledgerStatus';
const signatureTypePath = 'signatureType';

const EXAMPLE_IDENTITY = {
	chainId: '039b14a782008c1b1543b1542941756e6f01a0d68372ff61163642382af70fc9',
	key: 'idsec2wH72BNR9QZhTMGDbxwLWGrghZQexZvLTros2wCekkc62N9h7s',
};

class SubmitVoteForm extends React.Component {
	state = { voteCreationCost: null };

	componentDidMount = async () => {
		const voteData = {
			definition: this.props.poll.pollJSON,
			registrationChainId: this.props.networkController.networkProps
				.voteRegistrationChainID,
			eligibleVoters: this.props.eligibleVoters,
			identity: EXAMPLE_IDENTITY,
		};
		const voteCreationCost = await computeVoteCreationCost(voteData);
		this.setState({ voteCreationCost });
	};

	validateEcPrivateKey = async (value) => {
		if (!isValidPrivateEcAddress(value)) {
			return 'Invalid Key';
		}

		const balance = await this.props.factomCliController.factomCli.getBalance(
			value
		);

		if (this.state.voteCreationCost > balance) {
			return 'Insufficient balance of ' + balance + ' Entry Credits.';
		}
	};

	render() {
		const {
			classes,
			poll,
			eligibleVoters,
			updateCreatePollResult,
			handleBack,
			handleNext,
			networkController: { networkProps },
			voteController: { submitVote },
			ledgerController: { signMessageRaw },
		} = this.props;

		return (
			<Formik
				enableReinitialize
				initialValues={{
					identityChainID: '',
					identityKey: '',
					ecPrivateKey: '',
					transactionError: null,
					signatureType: null,
					ledgerStatus: null,
				}}
				onSubmit={async (values, actions) => {
					actions.setFieldValue(transactionErrorPath, null);

					const signatureType = _get(values, signatureTypePath);

					const voteData = {
						definition: poll.pollJSON,
						registrationChainId: networkProps.voteRegistrationChainID,
						eligibleVoters,
					};

					try {
						if (signatureType === MANUAL_SIG) {
							voteData.identity = {
								chainId: _get(values, identityChainIDPath),
								key: _get(values, identityKeyPath),
							};
						} else if (signatureType === LEDGER_SIG) {
							actions.setFieldValue(
								ledgerStatusPath,
								'Connecting to Ledger Nano S'
							);
							const ledgerConnected = await this.props.ledgerController.isLedgerConnected();

							if (ledgerConnected) {
								actions.setFieldValue(
									ledgerStatusPath,
									'Waiting for user to confirm signature two times on Ledger Nano S device.'
								);
							} else {
								throw new Error(
									'Ledger Nano S Not Found. Please connect your Ledger Nano S and try again.'
								);
							}

							const ledgerIdentity_o = await this.props.ledgerController.getLedgerIdentityAddress(
								0
							);

							voteData.identity = {
								chainId: ledgerIdentity_o.chainid,
								key: ledgerIdentity_o.address,
								sign: signMessageRaw,
							};
						}
						const result = await submitVote(
							voteData,
							_get(values, ecPrivateKeyPath)
						);

						console.log(result);

						// update result data
						updateCreatePollResult(result);

						// proceed to next page
						handleNext();
					} catch (e) {
						console.log(e);
						actions.resetForm();
						actions.setFieldValue(transactionErrorPath, 'Error: ' + e.message);
					}
				}}
				validationSchema={Yup.object().shape({
					[signatureTypePath]: Yup.string(),
					[identityChainIDPath]: Yup.string().when(signatureTypePath, {
						is: MANUAL_SIG,
						then: Yup.string()
							.required('Required')
							.matches(REGEX_CHAIN_ID, {
								message: 'Invalid Chain ID',
								excludeEmptyString: true,
							}),
						otherwise: Yup.string().notRequired(),
					}),
					[identityKeyPath]: Yup.string().when(signatureTypePath, {
						is: MANUAL_SIG,
						then: Yup.string()
							.required('Required')
							.test(
								identityKeyPath,
								'Invalid Identity Key',
								digital.isValidSecretIdentityKey
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
					submitCount,
				}) => {
					let title = 'Sign Transaction';
					if (_get(values, signatureTypePath) === LEDGER_SIG) {
						title += ' with Ledger Nano S';
					}

					return (
						<Form>
							<Grid container>
								<Grid item container justify="space-between" xs={12}>
									{_get(errors, signatureTypePath) && submitCount > 0 ? (
										<SectionHeader
											disableGutterBottom
											text={title + ' *'}
											color="red"
										/>
									) : (
										<SectionHeader disableGutterBottom text={title} />
									)}
									<Button
										onClick={() => {
											setFieldValue(identityChainIDPath, IDENTITY.chainId);
											setFieldValue(identityKeyPath, IDENTITY.key);
											setFieldValue(ecPrivateKeyPath, EC_PRIV);
										}}
										variant="contained"
										color="default"
									>
										Use Test Data
									</Button>
								</Grid>
								{_isNil(_get(values, signatureTypePath)) && (
									<Grid xs={12} item>
										<Button
											onClick={() => {
												setFieldValue(transactionErrorPath, null);
												setFieldValue(signatureTypePath, MANUAL_SIG);
											}}
											variant="outlined"
											size="small"
											disabled={isSubmitting}
										>
											Manual Entry
										</Button>
										&nbsp;
										<Button
											onClick={() => {
												setFieldValue(transactionErrorPath, null);
												setFieldValue(signatureTypePath, LEDGER_SIG);
											}}
											variant="outlined"
											size="small"
											disabled={isSubmitting}
										>
											Ledger Nano S
										</Button>
									</Grid>
								)}

								{_get(values, signatureTypePath) === MANUAL_SIG && (
									<Grid xs={12} item container>
										<Grid xs={9} item>
											<FormTextField
												name={identityChainIDPath}
												label="Initiator Identity Chain ID *"
												error={
													_get(errors, identityChainIDPath) &&
													_get(touched, identityChainIDPath)
												}
												fullWidth
											/>
										</Grid>
										<Grid xs={3} item />
										<Grid xs={9} item>
											<FormTextField
												name={identityKeyPath}
												label="Initiator Identity Private Key *"
												error={
													_get(errors, identityKeyPath) &&
													_get(touched, identityKeyPath)
												}
												fullWidth
											/>
										</Grid>
										<Grid xs={3} item />
									</Grid>
								)}
								{_get(values, signatureTypePath) && (
									<Grid item xs={12} container>
										<Grid xs={9} item>
											<FormTextField
												name={ecPrivateKeyPath}
												label="EC Private Key *"
												error={
													_get(errors, ecPrivateKeyPath) &&
													_get(touched, ecPrivateKeyPath)
												}
												fullWidth
												validate={this.validateEcPrivateKey}
											/>
										</Grid>
										<Grid xs={3} item>
											{this.state.voteCreationCost && (
												<>
													<br />
													<Typography>
														{'Cost: ' +
															this.state.voteCreationCost +
															' Entry Credits'}
													</Typography>
												</>
											)}
										</Grid>
									</Grid>
								)}

								{!_isNil(_get(values, transactionErrorPath)) && (
									<Grid item xs={12}>
										<br />

										<Typography className={classes.errorText}>
											{_get(values, transactionErrorPath)}
										</Typography>
									</Grid>
								)}
								<Grid item xs={12} className={classes.stepperButtons}>
									<br />
									<Button onClick={handleBack}>Back</Button>
									<Button
										type="submit"
										variant="contained"
										color="primary"
										disabled={isSubmitting}
									>
										{_get(values, signatureTypePath) === LEDGER_SIG
											? 'Sign and Submit'
											: 'Submit'}
										{isSubmitting && (
											<>
												&nbsp;&nbsp;
												<CircularProgress thickness={5} size={20} />
											</>
										)}
									</Button>
									{isSubmitting && _get(values, ledgerStatusPath) && (
										<Typography className={classes.ledgerStatus}>
											{_get(values, ledgerStatusPath)}
										</Typography>
									)}
								</Grid>
							</Grid>
						</Form>
					);
				}}
			/>
		);
	}
}

SubmitVoteForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	stepperButtons: {
		marginLeft: '-15px',
	},
	errorText: { color: 'red', fontSize: '16px' },
	ledgerStatus: { display: 'inline-block', paddingLeft: '10px' },
});

const enhancer = _flowRight(
	withNetwork,
	withFactomCli,
	withVote,
	withLedger,
	withStyles(styles)
);

export default enhancer(SubmitVoteForm);
