import React from 'react';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import _flowRight from 'lodash/flowRight';
import _includes from 'lodash/includes';
import Grid from '@material-ui/core/Grid';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Formik, Form, FieldArray, ErrorMessage } from 'formik';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withVote } from '../../context/VoteContext';
import { withNetwork } from '../../context/NetworkContext';
import { withStyles } from '@material-ui/core/styles';
import { withLedger } from '../../context/LedgerContext';
import SectionHeader from '../shared/SectionHeader';
import ExplorerLink from '../shared/ExplorerLink';
import { isValidEcPrivateAddress } from 'factom/dist/factom';
import {
	REGEX_CHAIN_ID,
	BINARY_CONFIG,
	COMMIT_HMAC_ALGO,
	SINGLE_OPTION_CONFIG,
	APPROVAL_CONFIG,
	INSTANT_RUNOFF_CONFIG,
} from '../create/VOTE_CONSTANTS';
import { digital } from 'factom-identity-lib';
import { EC_PRIV } from '../create/VOTE_EXAMPLE_DATA';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormTextField from '../../component/form/FormTextField';
import OpenInNew from '@material-ui/icons/OpenInNew';
import Save from '@material-ui/icons/Save';
import BinaryVoteForm from './BinaryVoteForm';
import { randomBytes } from 'crypto-browserify';
import Paper from '@material-ui/core/Paper';
import ApprovalVoteForm from './ApprovalVoteForm';
import SingleOptionVoteForm from './SingleOptionVoteForm';
import InstantRunoffVoteForm from './InstantRunoffVoteForm';
import fileDownload from 'js-file-download';
import sanitize from 'sanitize-filename';

const TEST_VOTER_ID = {
	chainId: 'd12c0c85b1731a9a5108b86cd084db6230ced269d86c6aad91168d39955cbf2c',
	key: 'idsec2nMgs9zSUuSvqkMyP28A1kmpbu24oDkoJnYQBJnv1XUpQBmmRG',
};
/**
 * Constants
 */
const MANUAL_SIG = 'manual';
const LEDGER_SIG = 'ledger';

const identityChainIDPath = 'identityChainID';
const identityKeyPath = 'identityKey';
const ecPrivateKeyPath = 'ecPrivateKey';
const transactionErrorPath = 'transactionError';
const processingPath = 'processing';
const votePath = 'vote';
const secretPath = 'secret';
const resultPath = 'result';
const resetAnswerFormPath = 'resetAnswerForm';
const abstainCheckboxPath = 'abstainCheckbox';
const revealDataPath = 'revealData';
const signatureTypePath = 'signatureType';
const ledgerStatusPath = 'ledgerStatus';

const titlePath = 'pollJSON.proposal.title';
const pollChainIdPath = 'pollJSON.voteChainId';
const voteTypePath = 'pollJSON.vote.type';
const maxOptionsPath = 'pollJSON.vote.config.maxOptions';
const textPath = 'pollJSON.proposal.text';
const hrefPath = 'pollJSON.proposal.externalRef.href';
const hashValuePath = 'pollJSON.proposal.externalRef.hash.value';
const hashAlgoPath = 'pollJSON.proposal.externalRef.hash.algo';

class CommitVoteForm extends React.Component {
	handleKeyPress(event) {
		if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
			event.preventDefault();
		}
	}

	render() {
		const {
			classes,
			poll,
			proposalEntries,
			voteController: { commitVote, getPollType },
			networkController: { networkProps },
			ledgerController: { signMessageRaw },
		} = this.props;

		const voterList = proposalEntries.map((value) => value.voterId);

		const entryHashURL = networkProps.explorerURL + '/entry?hash=';

		const revealFileName = sanitize('Reveal_' + _get(poll, titlePath) + '.txt');

		const pollType_o = getPollType(
			_get(poll, voteTypePath),
			_get(poll, maxOptionsPath)
		);

		let AnswerForm;
		if (pollType_o.name === BINARY_CONFIG.name) {
			AnswerForm = BinaryVoteForm;
		} else if (pollType_o.name === SINGLE_OPTION_CONFIG.name) {
			AnswerForm = SingleOptionVoteForm;
		} else if (pollType_o.name === APPROVAL_CONFIG.name) {
			AnswerForm = ApprovalVoteForm;
		} else if (pollType_o.name === INSTANT_RUNOFF_CONFIG.name) {
			AnswerForm = InstantRunoffVoteForm;
		} else {
			AnswerForm = NoFormFound;
		}

		return (
			<Formik
				initialValues={{
					vote: [],
					secret: randomBytes(16).toString('hex'),
					identityChainID: '',
					identityKey: '',
					ecPrivateKey: '',
					processing: false,
					transactionError: null,
					result: null,
					resetAnswerForm: false,
					abstainCheckbox: false,
					revealData: '',
					signatureType: null,
					ledgerStatus: null,
				}}
				onSubmit={async (values, actions) => {
					actions.setFieldValue(transactionErrorPath, null);
					actions.setFieldValue(processingPath, true);

					const signatureType = _get(values, signatureTypePath);
					let identityChainId;

					const commit_args = {
						voteChainId: _get(poll, pollChainIdPath),
						vote: {
							vote: _get(values, votePath),
							secret: _get(values, secretPath),
							hmacAlgo: COMMIT_HMAC_ALGO,
						},
						ecPrivateAddress: _get(values, ecPrivateKeyPath),
					};

					try {
						// set voter identity
						if (signatureType === MANUAL_SIG) {
							identityChainId = _get(values, identityChainIDPath);

							commit_args.voter = {
								chainId: identityChainId,
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
									'Waiting for user to confirm signature on Ledger Nano S device.'
								);
							} else {
								throw new Error(
									'Ledger Nano S Not Found. Please connect your Ledger Nano S and try again.'
								);
							}

							const ledgerIdentity_o = await this.props.ledgerController.getLedgerIdentityAddress(
								0
							);

							identityChainId = ledgerIdentity_o.chainid;

							commit_args.voter = {
								chainId: ledgerIdentity_o.chainid,
								key: ledgerIdentity_o.address,
								sign: signMessageRaw,
							};
						}
						console.log('Commit Vote Args');
						console.log(commit_args);

						//commit vote
						const result = await commitVote(commit_args);

						actions.setFieldValue(resultPath, result);
						actions.setFieldValue(processingPath, false);

						// setup reveal file data
						const reveal_args = {
							voteChainId: _get(poll, pollChainIdPath),
							vote: {
								vote: _get(values, votePath),
								secret: _get(values, secretPath),
								hmacAlgo: COMMIT_HMAC_ALGO,
							},
							voterId: identityChainId,
						};

						actions.setFieldValue(revealDataPath, JSON.stringify(reveal_args));
					} catch (e) {
						console.log(e);
						await actions.setFieldValue(resetAnswerFormPath, true);
						await actions.resetForm();
						actions.setFieldValue(transactionErrorPath, 'Error: ' + e.message);
					}
				}}
				validationSchema={Yup.object().shape({
					[abstainCheckboxPath]: Yup.boolean(),
					[votePath]: Yup.array().when(abstainCheckboxPath, {
						is: false,
						then: Yup.array().required('Required'),
						otherwise: Yup.array().notRequired(),
					}),
					[signatureTypePath]: Yup.string(),
					[identityChainIDPath]: Yup.string().when(signatureTypePath, {
						is: MANUAL_SIG,
						then: Yup.string()
							.required('Required')
							.matches(REGEX_CHAIN_ID, {
								message: 'Invalid Chain ID',
								excludeEmptyString: true,
							})
							.test(identityChainIDPath, 'Not an eligible voter', (value) =>
								_includes(voterList, value)
							),
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
					[ecPrivateKeyPath]: Yup.string()
						.required('Required')
						.test(ecPrivateKeyPath, 'Invalid Key', isValidEcPrivateAddress),
				})}
				render={({
					values,
					setFieldValue,
					isSubmitting,
					errors,
					submitCount,
					touched,
					resetForm,
				}) => {
					let signTransactionTitle = 'Sign Transaction';
					if (_get(values, signatureTypePath) === LEDGER_SIG) {
						signTransactionTitle += ' with Ledger Nano S';
					}
					return (
						<Form onKeyPress={this.handleKeyPress}>
							<Grid container className={classes.pad}>
								<Grid item container xs={12}>
									<SectionHeader text="Question" />
								</Grid>
								<Grid item container xs={12}>
									{_get(poll, textPath) && (
										<Typography>{_get(poll, textPath)}</Typography>
									)}
									{_get(poll, hrefPath) && (
										<Grid container item xs={12}>
											<Grid item xs={2} className={classes.smallGridColumn}>
												<Typography gutterBottom>URL Link:</Typography>
											</Grid>
											<Grid item xs={10}>
												<a
													href={_get(poll, hrefPath)}
													target="_blank"
													rel="noopener noreferrer"
												>
													<Typography>
														{_get(poll, hrefPath)}&nbsp;
														<OpenInNew
															color="primary"
															style={{
																fontSize: 15,
																position: 'relative',
																top: '1px',
															}}
														/>
													</Typography>
												</a>
											</Grid>
											<Grid item xs={2} className={classes.smallGridColumn}>
												<Typography gutterBottom>
													Hash Algorithm:&nbsp;
												</Typography>
											</Grid>
											<Grid item xs={10}>
												<Typography>{_get(poll, hashAlgoPath)}</Typography>
											</Grid>
											<Grid item xs={2} className={classes.smallGridColumn}>
												<Typography gutterBottom>Hash Value:&nbsp;</Typography>
											</Grid>
											<Grid item xs={10}>
												<Typography>{_get(poll, hashValuePath)}</Typography>
											</Grid>
										</Grid>
									)}
								</Grid>
								<Grid item xs={12}>
									<br />
									{_get(errors, votePath) && submitCount > 0 ? (
										<>
											<SectionHeader
												disableGutterBottom
												text="Answer *"
												color="red"
											/>
											<Typography className={classes.errorText}>
												Required
											</Typography>
										</>
									) : (
										<SectionHeader text="Answer" />
									)}
								</Grid>
								<Grid container item xs={12}>
									<FieldArray
										name={votePath}
										render={(arrayHelpers) => (
											<AnswerForm
												poll={poll}
												parentArrayHelpers={arrayHelpers}
												parentIsSubmitting={isSubmitting}
												parentReset={_get(values, resetAnswerFormPath)}
												parentSetFieldValue={setFieldValue}
												parentVoteArray={_get(values, votePath)}
											/>
										)}
									/>
									<br />
									<br />
								</Grid>
								<Grid item container justify="space-between" xs={12}>
									{_get(errors, signatureTypePath) && submitCount > 0 ? (
										<SectionHeader
											disableGutterBottom
											text={signTransactionTitle + ' *'}
											color="red"
										/>
									) : (
										<SectionHeader
											disableGutterBottom
											text={signTransactionTitle}
										/>
									)}

									<Button
										onClick={() => {
											setFieldValue(identityChainIDPath, TEST_VOTER_ID.chainId);
											setFieldValue(identityKeyPath, TEST_VOTER_ID.key);
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
												label="Voter Identity Chain ID *"
												error={
													_get(errors, identityChainIDPath) &&
													_get(touched, identityChainIDPath)
												}
												disabled={isSubmitting}
												fullWidth
											/>
										</Grid>
										<Grid xs={3} item />
										<Grid xs={9} item>
											<FormTextField
												name={identityKeyPath}
												label="Voter Identity Private Key *"
												error={
													_get(errors, identityKeyPath) &&
													_get(touched, identityKeyPath)
												}
												disabled={isSubmitting}
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
												disabled={isSubmitting}
												fullWidth
											/>
										</Grid>
										<Grid xs={3} item />
									</Grid>
								)}

								{!_isNil(_get(values, transactionErrorPath)) && (
									<Grid item xs={12}>
										<br />

										<Typography className={classes.transactionErrorText}>
											{_get(values, transactionErrorPath)}
										</Typography>
									</Grid>
								)}
								{_get(values, resultPath) && (
									<Grid item xs={12}>
										<br />
										<Paper className={classes.transaction}>
											<SectionHeader text="Success!" color="green" />

											<Typography gutterBottom>
												Your vote is pending confirmation. The entry will be
												visible in 10-15 minutes, after being included in the
												next block currently being processed by the Factom
												blockchain.
											</Typography>
											<br />
											<ExplorerLink
												label="Vote Commit"
												value={_get(values, resultPath).entryHash}
												href={entryHashURL + _get(values, resultPath).entryHash}
											/>
											<br />

											<div>
												<Button
													variant="contained"
													color="secondary"
													onClick={() => {
														fileDownload(
															_get(values, revealDataPath),
															revealFileName
														);
													}}
												>
													<Save />
													&nbsp; Download Reveal File
												</Button>
											</div>
										</Paper>
									</Grid>
								)}
								<Grid item xs={12}>
									<br />
									<Button
										type="submit"
										variant="contained"
										color="primary"
										disabled={isSubmitting}
									>
										{_get(values, signatureTypePath) === LEDGER_SIG
											? 'Sign and Submit'
											: 'Submit'}
										{_get(values, processingPath) && (
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
									{isSubmitting && _get(values, resultPath) && (
										<Button
											variant="outlined"
											className={classes.resetButton}
											onClick={async () => {
												await setFieldValue(resetAnswerFormPath, true);
												await resetForm();
											}}
										>
											Reset
										</Button>
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

const NoFormFound = (props) => (
	<div>
		<Typography style={{ color: 'red' }}>Invalid Vote Configuration</Typography>
	</div>
);

CommitVoteForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	pad: {
		padding: '15px',
	},
	transaction: {
		borderColor: '#6fbf73',
		borderStyle: 'solid',
		padding: 10,
	},
	transactionErrorText: { color: 'red', fontSize: '16px' },
	errorText: { color: 'red', fontSize: '13px' },
	ledgerStatus: { display: 'inline-block', paddingLeft: '10px' },
	resetButton: { marginLeft: 2 },
});

const enhancer = _flowRight(
	withNetwork,
	withVote,
	withLedger,
	withStyles(styles)
);
export default enhancer(CommitVoteForm);
