import React from 'react';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _isNumber from 'lodash/isNumber';
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
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import EligibleVotersList from '../shared/EligibleVotersList';
import CircularProgress from '@material-ui/core/CircularProgress';

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
const workingVoterIdPath = 'formFields.workingVoterId';
const workingWeightPath = 'formFields.workingWeight';
const workingVoterChainIDPath = 'formFields.workingVoterChainId';
const loadingVotersPath = 'formFields.loadingVoters';
const loadErrorMessagePath = 'formFields.loadErrorMessage';

class SelectParticipants extends React.Component {
	componentDidMount() {
		window.scrollTo(0, 0);
	}

	handleKeyPress(event) {
		if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
			event.preventDefault();
		}
	}

	render() {
		const { eligibleVotersForm, classes, updateParticipants } = this.props;

		return (
			<Formik
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
							.positive('Must be a positive number'),
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
				}) => (
					<Form onKeyPress={this.handleKeyPress}>
						<ApolloConsumer>
							{(client) => (
								<FieldArray
									name={eligibleVotersPath}
									render={(arrayHelpers) => (
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
																label="Voter ID"
																name={workingVoterIdPath}
																error={
																	_get(errors, workingVoterIdPath) &&
																	_get(touched, workingVoterIdPath)
																}
																type="text"
																isNotFast
																onKeyPress={(e) => {
																	if (
																		e.which === 13 /* Enter */ &&
																		e.target.value.trim() &&
																		_isNumber(_get(values, workingWeightPath))
																	) {
																		arrayHelpers.push({
																			voterId: _get(values, workingVoterIdPath),
																			weight: _get(values, workingWeightPath),
																		});
																		setFieldValue(workingVoterIdPath, '');
																		setFieldValue(workingWeightPath, '');
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
																		e.target.value.trim() &&
																		!_isEmpty(_get(values, workingVoterIdPath))
																	) {
																		arrayHelpers.push({
																			voterId: _get(values, workingVoterIdPath),
																			weight: _get(values, workingWeightPath),
																		});
																		setFieldValue(workingVoterIdPath, '');
																		setFieldValue(workingWeightPath, '');
																	}
																}}
															/>
															<br />
															<br />
															<Button
																variant="contained"
																component="span"
																onClick={() => {
																	arrayHelpers.push({
																		voterId: _get(values, workingVoterIdPath),
																		weight: _get(values, workingWeightPath),
																	});
																	setFieldValue(workingVoterIdPath, '');
																	setFieldValue(workingWeightPath, '');
																}}
																disabled={
																	!_get(values, workingVoterIdPath) ||
																	!_get(values, workingWeightPath)
																}
															>
																Add
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
																<Typography gutterBottom>
																	File: <input disabled type="file" />
																</Typography>
															</Grid>
															<Grid item xs={12}>
																<FormTextField
																	label="Voter Chain ID"
																	name={workingVoterChainIDPath}
																	type="text"
																	fullWidth
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
																		setFieldValue(loadingVotersPath, true);
																		setFieldValue(loadErrorMessagePath, '');

																		try {
																			const { data } = await client.query({
																				query: GET_VOTERS,
																				variables: {
																					chain: _get(
																						values,
																						workingVoterChainIDPath
																					),
																				},
																			});

																			if (
																				!_isEmpty(
																					_get(data, 'eligibleVoters.voters')
																				)
																			) {
																				// data found
																				_get(data, 'eligibleVoters.voters').map(
																					(voter_o) => {
																						arrayHelpers.push({
																							voterId: voter_o.voterId,
																							weight: voter_o.weight,
																						});
																					}
																				);
																				setFieldValue(
																					workingVoterChainIDPath,
																					''
																				);
																			} else {
																				// no data found
																				setFieldValue(
																					loadErrorMessagePath,
																					'No voters found'
																				);
																			}
																		} catch (e) {
																			setFieldValue(
																				loadErrorMessagePath,
																				'An Error has occured'
																			);
																		}

																		// stop loading indicator
																		setFieldValue(loadingVotersPath, false);
																	}}
																	disabled={
																		!_get(values, workingVoterChainIDPath)
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
																	<Typography className={classes.errorText}>
																		{_get(values, loadErrorMessagePath)}
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
															eligibleVoters={_get(values, eligibleVotersPath)}
															arrayHelpers={arrayHelpers}
														/>
													</Grid>
												)}
												{submitCount > 0 &&
													typeof _get(errors, eligibleVotersPath) ===
														'string' && (
														<Grid item xs={12}>
															<br />
															<Typography className={classes.errorText}>
																{_get(errors, eligibleVotersPath)}
															</Typography>
														</Grid>
													)}

												<Grid item xs={12} className={classes.stepperButtons}>
													<br />
													<Button disabled onClick={this.props.handleBack}>
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
									)}
								/>
							)}
						</ApolloConsumer>
					</Form>
				)}
			/>
		);
	}
}

SelectParticipants.propTypes = {
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
	},
});

export default withStyles(styles)(SelectParticipants);
