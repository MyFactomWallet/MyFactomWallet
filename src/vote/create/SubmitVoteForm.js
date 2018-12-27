import React from 'react';
import { Formik, Form } from 'formik';
import _isNil from 'lodash/isNil';
import _flowRight from 'lodash/flowRight';
import _get from 'lodash/get';
import { withStyles } from '@material-ui/core/styles';
import { withVote } from '../../context/VoteContext';
import { withNetwork } from '../../context/NetworkContext';
import { withFactomCli } from '../../context/FactomCliContext';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import SectionHeader from '../shared/SectionHeader';
import FormTextField from '../../component/form/FormTextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { isValidEcPrivateAddress } from 'factom/dist/factom';
import { computeVoteCreationCost } from 'factom-vote/dist/factom-vote';
import { digital } from 'factom-identity-lib';
import { REGEX_CHAIN_ID } from './VOTE_CONSTANTS';
import { EC_PRIV, IDENTITY } from './VOTE_EXAMPLE_DATA';

/**
 * Constants
 */
const identityChainIDPath = 'identityChainID';
const identityKeyPath = 'identityKey';
const ecPrivateKeyPath = 'ecPrivateKey';
const transactionErrorPath = 'transactionError';
const processingPath = 'processing';

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
		if (!isValidEcPrivateAddress(value)) {
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
		} = this.props;

		return (
			<Formik
				enableReinitialize
				initialValues={{
					identityChainID: '',
					identityKey: '',
					ecPrivateKey: '',
					transactionError: null,
					processing: false,
				}}
				onSubmit={async (values, actions) => {
					actions.setFieldValue(transactionErrorPath, null);
					actions.setFieldValue(processingPath, true);

					// set identity
					const identity = {
						chainId: _get(values, identityChainIDPath),
						key: _get(values, identityKeyPath),
					};

					const voteData = {
						definition: poll.pollJSON,
						registrationChainId: networkProps.voteRegistrationChainID,
						eligibleVoters,
						identity,
					};

					try {
						const result = await this.props.voteController.submitVote(
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
					[identityChainIDPath]: Yup.string()
						.required('Required')
						.matches(REGEX_CHAIN_ID, {
							message: 'Invalid Chain ID',
							excludeEmptyString: true,
						}),
					[identityKeyPath]: Yup.string()
						.required('Required')
						.test(
							identityKeyPath,
							'Invalid Identity Key',
							digital.isValidSecretIdentityKey
						),
				})}
				render={({ isSubmitting, errors, touched, values, setFieldValue }) => (
					<Form>
						<Grid container>
							<Grid item container justify="space-between" xs={12}>
								<SectionHeader disableGutterBottom text="Sign Transaction" />
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
							{!_isNil(_get(values, transactionErrorPath)) && (
								<Grid item xs={12}>
									<br />

									<Typography className={classes.transactionErrorText}>
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
									Submit Poll
									{_get(values, processingPath) && (
										<>
											&nbsp;&nbsp;
											<CircularProgress thickness={5} size={20} />
										</>
									)}
								</Button>
							</Grid>
						</Grid>
					</Form>
				)}
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
	transactionErrorText: { color: 'red', fontSize: '16px' },
});

const enhancer = _flowRight(
	withNetwork,
	withFactomCli,
	withVote,
	withStyles(styles)
);

export default enhancer(SubmitVoteForm);
