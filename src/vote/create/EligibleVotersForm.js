import React from 'react';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _isFinite from 'lodash/isFinite';
import Grid from '@material-ui/core/Grid';
import * as Yup from 'yup';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Formik, Form, FieldArray } from 'formik';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import SectionHeader from '../shared/SectionHeader';
import FormTextField from '../../component/form/FormTextField';
import OpenInNew from '@material-ui/icons/OpenInNew';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import EligibleVotersList from '../shared/EligibleVotersList';
import CircularProgress from '@material-ui/core/CircularProgress';
import { REGEX_CHAIN_ID } from './VOTE_CONSTANTS';

/**
 * Queries
 */
const GET_VOTERS = gql`
	query Voters($chain: String!) {
		eligibleVoters(chain: $chain) {
			voters {
				voterId
				weight
			}
		}
	}
`;

/**
 * Constants
 */
const eligibleVotersPath = 'eligibleVoters';
// form specific fields
const selectedListPath = 'formFields.selectedList';
const workingIdentityChainIdPath = 'formFields.workingIdentityChainId';
const workingWeightPath = 'formFields.workingWeight';
const workingEligibleChainIdPath = 'formFields.workingEligibleChainId';
const loadingVotersPath = 'formFields.loadingVoters';
const loadErrorMessagePath = 'formFields.loadErrorMessage';
const loadSuccessMessagePath = 'formFields.loadSuccessMessage';
const workingFileNamePath = 'formFields.workingFileName';
const workingFilePath = 'formFields.workingFile';

function formatVoter(voterId, weight) {
	return {
		voterId,
		weight,
	};
}

class EligibleVotersForm extends React.Component {
	constructor(props) {
		super(props);

		this.reader = new FileReader();
	}

	componentDidMount() {
		window.scrollTo(0, 0);
	}

	handleKeyPress(event) {
		if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
			event.preventDefault();
		}
	}

	isValidVoter = (voter_o) => {
		// test weight
		const weight = _get(voter_o, 'weight');
		if (!_isFinite(weight) || !(weight > 0)) {
			return false;
		}

		// test voter Id
		const voterId = _get(voter_o, 'voterId');
		if (!REGEX_CHAIN_ID.test(voterId)) {
			return false;
		}

		return true;
	};

	handleFile = (file) => {
		this.reader.readAsText(file);

		this.reader.onloadend = (e) => {
			const content = this.reader.result;
			const voterList = content.trim().split('\n');

			let newVoterList = [];
			let invalidData = false;

			for (let index = 1; index < voterList.length; index++) {
				const attributes = voterList[index].trim().split(',');
				const voter_o = formatVoter(attributes[0], parseInt(attributes[1]));
				if (this.isValidVoter(voter_o)) {
					newVoterList.push(voter_o);
				} else {
					invalidData = true;
				}
			}

			if (invalidData || _isEmpty(newVoterList)) {
				this.setFieldValue(loadErrorMessagePath, '* Invalid CSV data');
			} else {
				newVoterList.forEach((voter_o) => {
					this.handleVoter(voter_o);
				});
				this.setFieldValue(
					loadSuccessMessagePath,
					newVoterList.length + ' voters loaded'
				);
				this.setFieldValue(workingFilePath, '');
				this.setFieldValue(workingFileNamePath, '');
			}
		};
	};

	handleVoterChainId = async (chain) => {
		try {
			const {
				data: { eligibleVoters },
			} = await this.apolloClient.query({
				query: GET_VOTERS,
				variables: { chain },
			});
			const voterData = _get(eligibleVoters, 'voters');

			if (!_isEmpty(voterData)) {
				// data found
				voterData.forEach(({ voterId, weight }) => {
					this.handleVoter(formatVoter(voterId, weight));
				});
				this.setFieldValue(
					loadSuccessMessagePath,
					voterData.length + ' voters loaded'
				);
				this.setFieldValue(workingEligibleChainIdPath, '');
			} else {
				// no data found
				this.setFieldValue(loadErrorMessagePath, '* No voters found');
			}
		} catch (e) {
			this.setFieldValue(loadErrorMessagePath, '* An Error has occured');
		}
	};

	handleVoter = (voter_o) => {
		if (this.isValidVoter(voter_o)) {
			const voterIndex = this.findVoter(voter_o.voterId);

			// if voter exists
			if (voterIndex !== -1) {
				// replace voter
				this.arrayHelpers.replace(voterIndex, voter_o);
			} else {
				// add new voter
				this.arrayHelpers.push(voter_o);
			}
		}
	};

	findVoter = (voterId) =>
		this.currentEligibleVoters.findIndex(
			(voter_o) => voter_o.voterId === voterId
		);

	resetAddVoterFields = () => {
		this.setFieldValue(workingIdentityChainIdPath, '');
		this.setFieldValue(workingWeightPath, '');
	};

	render() {
		const { eligibleVotersForm, classes, updateParticipants } = this.props;

		return (
			<Formik
				enableReinitialize
				initialValues={eligibleVotersForm}
				onSubmit={(values, actions) => {
					// update participants
					updateParticipants(values);

					// proceed to next page
					this.props.handleNext();
				}}
				validationSchema={Yup.object().shape({
					eligibleVoters: Yup.array().required('* Add at least one voter'),
					formFields: Yup.object().shape({
						workingWeight: Yup.number()
							.transform((currentValue, originalValue) => {
								return originalValue === '' ? undefined : currentValue;
							})
							.moreThan(0, 'Must be a positive number'),
						workingIdentityChainId: Yup.string().matches(REGEX_CHAIN_ID, {
							message: 'Invalid Chain ID',
							excludeEmptyString: true,
						}),
						workingEligibleChainId: Yup.string().matches(REGEX_CHAIN_ID, {
							message: 'Invalid Chain ID',
							excludeEmptyString: true,
						}),
					}),
				})}
				render={({
					values,
					handleChange,
					setFieldValue,
					isSubmitting,
					errors,
					submitCount,
					touched,
				}) => {
					this.setFieldValue = setFieldValue;
					this.currentEligibleVoters = _get(values, eligibleVotersPath);
					this.workingAddVoter_o = formatVoter(
						_get(values, workingIdentityChainIdPath),
						_get(values, workingWeightPath)
					);

					return (
						<Form onKeyPress={this.handleKeyPress}>
							<ApolloConsumer>
								{(client) => {
									this.apolloClient = client;
									return (
										<FieldArray
											name={eligibleVotersPath}
											render={(arrayHelpers) => {
												this.arrayHelpers = arrayHelpers;

												return (
													<Grid container className={classes.pad}>
														<Grid item xs={12}>
															<SectionHeader text="Select Voters" />
														</Grid>
														<Grid item container xs={12}>
															<Grid item xs={12} container>
																<Grid item xs={3}>
																	<FormControl component="fieldset">
																		<RadioGroup
																			name={selectedListPath}
																			value={_get(values, selectedListPath)}
																			onChange={handleChange}
																		>
																			<FormControlLabel
																				value="custom"
																				control={<Radio />}
																				label="Custom List"
																			/>
																			<FormControlLabel
																				value="standing"
																				control={<Radio />}
																				label="Standing Parties"
																				disabled
																			/>
																		</RadioGroup>
																	</FormControl>
																</Grid>
																{_get(values, selectedListPath) === 'custom' ? (
																	<Grid item xs={4} className={classes.borders}>
																		<Typography
																			style={{ fontWeight: 500 }}
																			gutterBottom
																		>
																			Add Voter
																		</Typography>
																		<FormTextField
																			label="Identity Chain ID"
																			name={workingIdentityChainIdPath}
																			error={
																				_get(
																					errors,
																					workingIdentityChainIdPath
																				) &&
																				_get(
																					touched,
																					workingIdentityChainIdPath
																				)
																			}
																			type="text"
																			isNotFast
																			onKeyPress={(e) => {
																				if (
																					e.which === 13 /* Enter */ &&
																					this.isValidVoter(
																						this.workingAddVoter_o
																					)
																				) {
																					this.handleVoter(
																						this.workingAddVoter_o
																					);
																					this.resetAddVoterFields();
																				}
																			}}
																		/>
																		<FormTextField
																			label="Weight"
																			name={workingWeightPath}
																			type="number"
																			error={
																				_get(errors, workingWeightPath) &&
																				_get(touched, workingWeightPath)
																			}
																			isNotFast
																			onKeyPress={(e) => {
																				if (
																					e.which === 13 /* Enter */ &&
																					this.isValidVoter(
																						this.workingAddVoter_o
																					)
																				) {
																					this.handleVoter(
																						this.workingAddVoter_o
																					);
																					this.resetAddVoterFields();
																				}
																			}}
																		/>
																		<br />
																		<br />
																		<Button
																			variant="contained"
																			component="span"
																			onClick={() => {
																				this.handleVoter(
																					this.workingAddVoter_o
																				);
																				this.resetAddVoterFields();
																			}}
																			disabled={
																				!this.isValidVoter(
																					this.workingAddVoter_o
																				)
																			}
																		>
																			{_get(
																				values,
																				workingIdentityChainIdPath
																			) &&
																			this.findVoter(
																				this.workingAddVoter_o.voterId
																			) !== -1
																				? 'Replace'
																				: 'Add'}
																		</Button>
																	</Grid>
																) : (
																	<Grid item xs={4} />
																)}
																{_get(values, selectedListPath) === 'custom' ? (
																	<Grid
																		item
																		xs={5}
																		container
																		className={classes.padLoadVoters}
																	>
																		<Grid item xs={12}>
																			<Typography
																				style={{ fontWeight: 500 }}
																				gutterBottom
																			>
																				Load Voters
																			</Typography>
																		</Grid>
																		<Grid item xs={12}>
																			<FormTextField
																				name={workingFileNamePath}
																				isNotFast
																				type="file"
																				accept=".csv"
																				onChange={(e) => {
																					handleChange(e);

																					// reset working chain ID field
																					setFieldValue(
																						workingEligibleChainIdPath,
																						''
																					);

																					setFieldValue(
																						workingFilePath,
																						e.target.files[0]
																					);
																				}}
																			/>
																			<a
																				target="_blank"
																				rel="noopener noreferrer"
																				href={
																					'https://docs.google.com/spreadsheets/d/1vK0277pI7BlGKGRFf93C5wwBb1O0K1KuFH8XkeB9IFI/edit?usp=sharing'
																				}
																			>
																				<Typography style={{ fontSize: 12 }}>
																					Template
																					<OpenInNew
																						color="primary"
																						style={{
																							fontSize: 13,
																							verticalAlign: 'text-top',
																						}}
																					/>
																				</Typography>
																			</a>
																		</Grid>

																		<Grid item xs={12}>
																			<FormTextField
																				label="Eligible Voters Chain ID"
																				name={workingEligibleChainIdPath}
																				type="text"
																				fullWidth
																				onChange={(e) => {
																					handleChange(e);

																					// reset file field
																					setFieldValue(workingFilePath, '');
																					setFieldValue(
																						workingFileNamePath,
																						''
																					);
																				}}
																				error={
																					_get(
																						errors,
																						workingEligibleChainIdPath
																					) &&
																					_get(
																						touched,
																						workingEligibleChainIdPath
																					)
																				}
																			/>
																			<br />
																			<br />
																		</Grid>
																		<Grid item xs={4}>
																			<Button
																				variant="contained"
																				component="span"
																				onClick={async () => {
																					// start loading indicator
																					setFieldValue(
																						loadingVotersPath,
																						true
																					);
																					setFieldValue(
																						loadErrorMessagePath,
																						''
																					);
																					setFieldValue(
																						loadSuccessMessagePath,
																						''
																					);

																					if (
																						_get(
																							values,
																							workingEligibleChainIdPath
																						)
																					) {
																						// handle voter chain ID
																						this.handleVoterChainId(
																							_get(
																								values,
																								workingEligibleChainIdPath
																							)
																						);
																					} else if (
																						_get(values, workingFileNamePath)
																					) {
																						// handle file upload
																						this.handleFile(
																							_get(values, workingFilePath)
																						);
																					}

																					// stop loading indicator
																					window.setTimeout(() => {
																						setFieldValue(
																							loadingVotersPath,
																							false
																						);
																					}, 500);
																				}}
																				disabled={
																					(!_get(
																						values,
																						workingEligibleChainIdPath
																					) ||
																						!REGEX_CHAIN_ID.test(
																							_get(
																								values,
																								workingEligibleChainIdPath
																							)
																						)) &&
																					!_get(values, workingFileNamePath)
																				}
																			>
																				Load
																				{_get(values, loadingVotersPath) && (
																					<>
																						&nbsp;&nbsp;
																						<CircularProgress
																							thickness={5}
																							size={20}
																						/>
																					</>
																				)}
																			</Button>
																		</Grid>
																		<Grid item xs={8}>
																			{_get(values, loadErrorMessagePath) && (
																				<Typography
																					className={classes.errorText}
																				>
																					{_get(values, loadErrorMessagePath)}
																				</Typography>
																			)}
																			{_get(values, loadSuccessMessagePath) && (
																				<Typography
																					className={classes.successText}
																				>
																					{_get(values, loadSuccessMessagePath)}
																				</Typography>
																			)}
																		</Grid>
																	</Grid>
																) : (
																	<Grid item xs={5} />
																)}
															</Grid>

															{_get(values, selectedListPath) === 'custom' && (
																<Grid item xs={12}>
																	<EligibleVotersList
																		eligibleVoters={_get(
																			values,
																			eligibleVotersPath
																		)}
																		arrayHelpers={arrayHelpers}
																		errorMessage={
																			submitCount > 0 &&
																			typeof _get(
																				errors,
																				eligibleVotersPath
																			) === 'string' ? (
																				<Grid item xs={12}>
																					<br />
																					<Typography
																						className={classes.errorText}
																					>
																						{_get(errors, eligibleVotersPath)}
																					</Typography>
																				</Grid>
																			) : null
																		}
																	/>
																</Grid>
															)}
															<Grid
																item
																xs={12}
																className={classes.stepperButtons}
															>
																<br />
																<Button
																	disabled
																	onClick={this.props.handleBack}
																>
																	Back
																</Button>
																<Button
																	variant="contained"
																	color="primary"
																	type="submit"
																	disabled={isSubmitting}
																>
																	Next
																</Button>
															</Grid>
														</Grid>
													</Grid>
												);
											}}
										/>
									);
								}}
							</ApolloConsumer>
						</Form>
					);
				}}
			/>
		);
	}
}

EligibleVotersForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	pad: {
		padding: '15px',
	},
	borders: {
		borderRightStyle: 'solid',
		borderRightColor: 'lightgray',
		borderRightWidth: '1px',
		borderLeftStyle: 'solid',
		borderLeftColor: 'lightgray',
		borderLeftWidth: '1px',
		padding: '10px',
	},
	padLoadVoters: {
		padding: '10px',
	},
	stepperButtons: {
		marginLeft: '-15px',
	},
	errorText: {
		color: 'red',
		fontSize: '14px',
		borderColor: 'red',
		borderStyle: 'solid',
		padding: 8,
		width: 168,
	},
	successText: {
		color: 'green',
		fontSize: '14px',
		borderColor: 'green',
		borderStyle: 'solid',
		padding: 8,
		width: 168,
	},
});

export default withStyles(styles)(EligibleVotersForm);
