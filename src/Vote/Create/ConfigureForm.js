import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Formik, Field, FastField, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import LabelImportant from '@material-ui/icons/LabelImportant';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';
import Button from '@material-ui/core/Button';
import get from 'lodash/get';
import omit from 'lodash/omit';
import SectionHeader from '../Shared/SectionHeader';

import {
	SINGLE_OPTION_VOTING,
	APPROVAL_VOTING,
	INSTANT_RUNOFF_VOTING,
	ALL_ELIGIBLE_VOTERS,
	PARTICIPANTS_ONLY,
} from './VOTE_CONSTANTS';

// poll config fields
const titlePath = 'pollJSON.proposal.title';
const commitStartPath = 'pollJSON.vote.phasesBlockHeights.commitStart';
const commitEndPath = 'pollJSON.vote.phasesBlockHeights.commitEnd';
const revealStartPath = 'pollJSON.vote.phasesBlockHeights.revealStart';
const revealEndPath = 'pollJSON.vote.phasesBlockHeights.revealEnd';
const proposalPath = 'pollJSON.proposal';
const externalRefPath = 'pollJSON.proposal.externalRef';
//const hrefPath = 'pollJSON.proposal.externalRef.href';
const textPath = 'pollJSON.proposal.text';
const voteTypePath = 'pollJSON.vote.type';
const minOptionsPath = 'pollJSON.vote.config.minOptions';
const maxOptionsPath = 'pollJSON.vote.config.maxOptions';
const configPath = 'pollJSON.vote.config';
const optionsPath = 'pollJSON.vote.config.options';
const abstentionPath = 'pollJSON.vote.config.allowAbstention';
const computeResultsAgainstPath = 'pollJSON.vote.config.computeResultsAgainst';
const acceptanceCriteriaPath = 'pollJSON.vote.config.acceptanceCriteria';

// form specific fields
const voteTypeTextPath = 'formFields.voteTypeText';
const questionSourcePath = 'formFields.questionSource';
const workingOptionPath = 'formFields.workingOption';
const workingHrefPath = 'formFields.workingHref';
const checkedTurnoutPath = 'formFields.checkedTurnout';
const checkedSupportPath = 'formFields.checkedSupport';
const workingWeightMinTurnoutPath = 'formFields.workingWeightMinTurnout';
const workingUnweightMinTurnoutPath = 'formFields.workingUnweightMinTurnout';
const workingWeightMinSupportPath = 'formFields.workingWeightMinSupport';
const workingUnweightMinSupportPath = 'formFields.workingUnweightMinSupport';
const workingMinSupportOption = 'formFields.workingMinSupportOption';
const applyMinSupportToAllOptions = 'formFields.applyMinSupportToAllOptions';

class ConfigureVoteForm extends React.Component {
	componentDidMount() {
		window.scrollTo(0, 0);
	}

	handleKeyPress(event) {
		if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
			event.preventDefault();
		}
	}

	displayError = (errors, touched, path) => {
		if (get(errors, path) && get(touched, path)) {
			return true;
		} else {
			return false;
		}
	};

	errorStar = (errors, touched, path) => {
		if (this.displayError(errors, touched, path)) {
			return <span style={{ color: 'red' }}>&nbsp;*</span>;
		}
	};

	errorText = (errors, touched, path, classes) => {
		if (this.displayError(errors, touched, path)) {
			return <div className={classes.invalidFeedback}>{get(errors, path)}</div>;
		}
	};

	errorClass = (errors, touched, path, classes) => {
		if (this.displayError(errors, touched, path)) {
			return `${classes.isInvalid}`;
		}
	};

	criteriaStyle = (values, path) => {
		return !get(values, path) ? 'gray' : '';
	};

	render() {
		const { pollForm, updatePoll, classes } = this.props;

		return (
			<Formik
				initialValues={pollForm}
				validationSchema={Yup.object().shape({
					pollJSON: Yup.object().shape({
						proposal: Yup.object().shape({
							//title: Yup.string().required('Required'),
						}),
						vote: Yup.object().shape({
							phasesBlockHeights: Yup.object().shape({
								/* commitStart: Yup.number()
									.transform((currentValue, originalValue) => {
										return originalValue === '' ? undefined : currentValue;
									})
									.required('Required'),
								commitEnd: Yup.number()
									.transform((currentValue, originalValue) => {
										return originalValue === '' ? undefined : currentValue;
									})
									.required('Required'),
								revealStart: Yup.number()
									.transform((currentValue, originalValue) => {
										return originalValue === '' ? undefined : currentValue;
									})
									.required('Required'),
								revealEnd: Yup.number()
									.transform((currentValue, originalValue) => {
										return originalValue === '' ? undefined : currentValue;
									})
									.required('Required'), */
							}),
						}),
					}),
				})}
				onSubmit={(values, actions) => {
					/*
					* Handle text vs externalRef
					*/
					if (get(values, textPath)) {
						// delete href
						values = omit(values, externalRefPath);
					} else {
						// delete text
						values = omit(values, textPath);

						// add externalRef config
						get(values, proposalPath).externalRef = {
							href: get(values, workingHrefPath),
							hash: { value: '', algo: '' },
						};
					}

					/*
					* Handle acceptance criteria
					*/
					if (
						get(values, checkedTurnoutPath) ||
						get(values, checkedSupportPath)
					) {
						// reset acceptance criteria
						get(values, configPath).acceptanceCriteria = {};
					} else {
						// no acceptance criteria
						values = omit(values, acceptanceCriteriaPath);
					}

					// add turnout criteria
					if (get(values, checkedTurnoutPath)) {
						get(values, acceptanceCriteriaPath).minTurnout = {
							weighted: get(values, workingWeightMinTurnoutPath),
							unweighted: get(values, workingUnweightMinTurnoutPath),
						};
					}

					// add support criteria
					if (get(values, checkedSupportPath)) {
						get(values, acceptanceCriteriaPath).minSupport = {};

						if (get(values, applyMinSupportToAllOptions)) {
							// add criteria for all options
							for (let option of get(values, optionsPath)) {
								get(values, acceptanceCriteriaPath).minSupport[option] = {
									weighted: get(values, workingWeightMinSupportPath),
									unweighted: get(values, workingUnweightMinSupportPath),
								};
							}
						} else {
							// add criteria for specific option
							get(values, acceptanceCriteriaPath).minSupport = {
								[get(values, workingMinSupportOption)]: {
									weighted: get(values, workingWeightMinSupportPath),
									unweighted: get(values, workingUnweightMinSupportPath),
								},
							};
						}
					}

					// add Support Criteria

					// update Poll
					updatePoll(values);

					// proceed to next page
					this.props.handleNext();
				}}
				render={({
					errors,
					touched,
					isSubmitting,
					values,
					setFieldValue,
					handleChange,
					handleBlur,
				}) => (
					<Grid container className={classes.pad}>
						<Grid item xs={12}>
							<SectionHeader text="Configure Poll" />
						</Grid>
						<Grid item xs={12}>
							<Form onKeyPress={this.handleKeyPress}>
								<Grid container>
									<Grid container item xs={12}>
										<Grid item xs={3}>
											<Typography gutterBottom>
												Title:
												{this.errorStar(errors, touched, titlePath)}
											</Typography>
										</Grid>
										<Grid item xs={6} className={classes.moveLeft}>
											<FastField
												type="text"
												name={titlePath}
												size="35"
												className={this.errorClass(
													errors,
													touched,
													titlePath,
													classes
												)}
											/>
											{this.errorText(errors, touched, titlePath, classes)}
										</Grid>
										<Grid item xs={3}>
											{/*<input
											type="button"
											onClick={handleReset}
											disabled={!dirty || isSubmitting}
											style={{ display: 'inline-block' }}
											value="Fill [Test]"
										/>*/}
										</Grid>
										<Grid item xs={3}>
											<Typography gutterBottom>
												Commit Start Block:
												{this.errorStar(errors, touched, commitStartPath)}
											</Typography>
										</Grid>
										<Grid item xs={9} className={classes.moveLeft}>
											<Field
												type="number"
												name={commitStartPath}
												className={this.errorClass(
													errors,
													touched,
													commitStartPath,
													classes
												)}
											/>
											{this.errorText(
												errors,
												touched,
												commitStartPath,
												classes
											)}
										</Grid>
										<Grid item xs={3}>
											<Typography gutterBottom>
												Commit End Block:
												{this.errorStar(errors, touched, commitEndPath)}
											</Typography>
										</Grid>
										<Grid item xs={9} className={classes.moveLeft}>
											<Field
												type="number"
												name={commitEndPath}
												className={this.errorClass(
													errors,
													touched,
													commitEndPath,
													classes
												)}
											/>
											{this.errorText(errors, touched, commitEndPath, classes)}
										</Grid>
										<Grid item xs={3}>
											<Typography gutterBottom>
												Reveal Start Block:
												{this.errorStar(errors, touched, revealStartPath)}
											</Typography>
										</Grid>
										<Grid item xs={9} className={classes.moveLeft}>
											<Field
												type="number"
												name={revealStartPath}
												className={this.errorClass(
													errors,
													touched,
													revealStartPath,
													classes
												)}
											/>
											{this.errorText(
												errors,
												touched,
												revealStartPath,
												classes
											)}
										</Grid>
										<Grid item xs={3}>
											<Typography gutterBottom>
												Reveal End Block:
												{this.errorStar(errors, touched, revealEndPath)}
											</Typography>
										</Grid>
										<Grid item xs={9} className={classes.moveLeft}>
											<Field
												type="number"
												name={revealEndPath}
												className={this.errorClass(
													errors,
													touched,
													revealEndPath,
													classes
												)}
											/>
											{this.errorText(errors, touched, revealEndPath, classes)}
										</Grid>
									</Grid>
									<Grid container item xs={12}>
										<Grid item xs={12}>
											<br />
											<SectionHeader text="Question" />
										</Grid>

										<Grid item xs={3}>
											<FormControl component="fieldset">
												<RadioGroup
													name={questionSourcePath}
													value={get(values, questionSourcePath)}
													onChange={(e) => {
														handleChange(e);
														if (e.target.value === 'text') {
															setFieldValue(workingHrefPath, '');
														} else {
															setFieldValue(textPath, '');
														}
													}}
													onBlur={handleBlur}
												>
													<FormControlLabel
														value="text"
														control={<Radio />}
														label="Plain Text"
													/>
													<FormControlLabel
														className={classes.raiseRadio}
														value="href"
														control={<Radio />}
														label="External Proposal"
													/>
												</RadioGroup>
											</FormControl>
										</Grid>
										{get(values, questionSourcePath) === 'text' && (
											<Grid item container xs={9}>
												<Grid item xs={2}>
													<br />
													<Typography gutterBottom>Question:&nbsp;</Typography>
												</Grid>
												<Grid item xs={10}>
													<br />
													<Field name={textPath}>
														{({ field }) => (
															<textarea
																className={classes.questionTextbox}
																{...field}
																rows="4"
																cols="50"
															/>
														)}
													</Field>
												</Grid>
											</Grid>
										)}
										{get(values, questionSourcePath) === 'href' && (
											<Grid item xs={9}>
												<br />
												<Typography gutterBottom>
													URL Link:
													{this.errorStar(errors, touched, workingHrefPath)}
													&nbsp;
													<Field
														type="text"
														name={workingHrefPath}
														className={this.errorClass(
															errors,
															touched,
															workingHrefPath,
															classes
														)}
													/>
												</Typography>
												{this.errorText(
													errors,
													touched,
													workingHrefPath,
													classes
												)}
											</Grid>
										)}
									</Grid>
									<Grid container item xs={12}>
										<Grid item xs={12}>
											<SectionHeader text="Answers" />
										</Grid>
										<Grid item xs={1}>
											<Typography gutterBottom>Type:&nbsp;</Typography>
										</Grid>
										<Grid item xs={11}>
											<Field
												name={voteTypeTextPath}
												render={({ field, form }) => (
													<select
														{...field}
														onChange={(e) => {
															//update question type
															handleChange(e);

															//update dependent fields
															const newValue = e.target.value;

															form.setFieldValue(optionsPath, []);
															form.setFieldValue(
																applyMinSupportToAllOptions,
																true
															);
															form.setFieldValue(workingMinSupportOption, '');

															if (newValue === SINGLE_OPTION_VOTING) {
																form.setFieldValue(voteTypePath, 0);
																form.setFieldValue(minOptionsPath, 1);
																form.setFieldValue(maxOptionsPath, 1);
															} else if (newValue === APPROVAL_VOTING) {
																form.setFieldValue(voteTypePath, 0);
																form.setFieldValue(minOptionsPath, '');
																form.setFieldValue(maxOptionsPath, '');
															} else if (newValue === INSTANT_RUNOFF_VOTING) {
																form.setFieldValue(voteTypePath, 1);
																form.setFieldValue(minOptionsPath, '');
																form.setFieldValue(maxOptionsPath, '');
															} else {
																form.setFieldValue(voteTypePath, '');
																form.setFieldValue(minOptionsPath, '');
																form.setFieldValue(maxOptionsPath, '');
															}
														}}
													>
														<option value="" defaultValue />
														<option value={SINGLE_OPTION_VOTING}>
															{SINGLE_OPTION_VOTING}
														</option>
														<option value={APPROVAL_VOTING}>
															{APPROVAL_VOTING}
														</option>
														<option value={INSTANT_RUNOFF_VOTING}>
															{INSTANT_RUNOFF_VOTING}
														</option>
													</select>
												)}
											/>
										</Grid>
										{get(values, voteTypeTextPath) && (
											<Grid container item xs={12}>
												<Grid item xs={3}>
													<Typography gutterBottom>
														Compute Results Against:&nbsp;
													</Typography>
												</Grid>
												<Grid item xs={9}>
													<Field
														component="select"
														name={computeResultsAgainstPath}
														onChange={(e) => {
															handleChange(e);
															if (e.target.value === ALL_ELIGIBLE_VOTERS) {
																setFieldValue(abstentionPath, false);
															} else {
																setFieldValue(abstentionPath, '');
															}
														}}
													>
														<option value="" />
														<option value={ALL_ELIGIBLE_VOTERS}>
															All Eligible Voters
														</option>
														<option value={PARTICIPANTS_ONLY}>
															Participants Only
														</option>
													</Field>
												</Grid>
												<Grid item xs={3}>
													<Typography gutterBottom>
														Allow Abstention:&nbsp;
													</Typography>
												</Grid>
												<Grid item xs={9}>
													{get(values, computeResultsAgainstPath) ===
														PARTICIPANTS_ONLY ||
													get(values, computeResultsAgainstPath) === '' ? (
														<Field component="select" name={abstentionPath}>
															<option value="" />
															<option value={true}>True</option>
															<option value={false}>False</option>
														</Field>
													) : (
														`False`
													)}
												</Grid>
											</Grid>
										)}

										{(get(values, voteTypeTextPath) === APPROVAL_VOTING ||
											get(values, voteTypeTextPath) ===
												INSTANT_RUNOFF_VOTING) && (
											<Grid container item xs={12}>
												<Grid item xs={3}>
													<Typography gutterBottom>
														Minimum Options Allowed:&nbsp;&nbsp;
													</Typography>
												</Grid>
												<Grid item xs={9}>
													<Field
														type="number"
														className={classes.numberInput}
														name={minOptionsPath}
													/>
												</Grid>
												<Grid item xs={3}>
													<Typography gutterBottom>
														Maximum Options Allowed:&nbsp;
													</Typography>
												</Grid>
												<Grid item xs={9}>
													<Field
														type="number"
														className={classes.numberInput}
														name={maxOptionsPath}
													/>
												</Grid>
											</Grid>
										)}
										{get(values, voteTypeTextPath) && (
											<Grid item xs={12}>
												<Paper elevation={10} className={classes.pad}>
													<List className={classes.optionList} dense>
														<FieldArray
															name={optionsPath}
															render={(arrayHelpers) => (
																<div>
																	<Typography variant="subheading">
																		Options&nbsp;&nbsp;
																		<Field
																			name={workingOptionPath}
																			type="text"
																		/>
																		<input
																			type="button"
																			onClick={() => {
																				arrayHelpers.push(
																					get(values, workingOptionPath)
																				);
																				// reset input
																				setFieldValue(workingOptionPath, '');
																			}}
																			value="Add"
																			disabled={!get(values, workingOptionPath)}
																		/>
																	</Typography>
																	{get(values, optionsPath).length > 0 ? (
																		get(values, optionsPath).map(
																			(option, index) => (
																				<ListItem
																					key={index}
																					disableGutters
																					divider
																					className={classes.optionListItem}
																				>
																					<LabelImportant
																						style={{ fontSize: 15 }}
																					/>
																					<ListItemText primary={option} />
																					<IconButton
																						onClick={() => {
																							arrayHelpers.remove(index);
																							if (
																								get(
																									values,
																									workingMinSupportOption
																								) === option
																							) {
																								setFieldValue(
																									workingMinSupportOption,
																									''
																								);
																								setFieldValue(
																									applyMinSupportToAllOptions,
																									true
																								);
																							}
																						}}
																						aria-label="Clear"
																					>
																						<Clear />
																					</IconButton>
																				</ListItem>
																			)
																		)
																	) : (
																		<ListItem divider>
																			<ListItemText
																				primary={'No Options have been added'}
																			/>
																		</ListItem>
																	)}
																</div>
															)}
														/>
													</List>
												</Paper>
											</Grid>
										)}
									</Grid>
									<Grid item xs={12}>
										<pre>{JSON.stringify(values.formFields, null, 2)}</pre>
										<pre>
											{JSON.stringify(values.pollJSON.vote.config, null, 2)}
										</pre>
									</Grid>
									<Grid item xs={12}>
										<br />
										<br />
										<SectionHeader text="Acceptance Criteria" />
										<List dense>
											<ListItem disableGutters divider>
												<Grid container>
													<Grid item xs={4}>
														<Field
															name={checkedTurnoutPath}
															render={({ field, form }) => (
																<FormControlLabel
																	control={
																		<Checkbox
																			name={checkedTurnoutPath}
																			checked={field.value}
																			onChange={(e) => {
																				handleChange(e);

																				if (field.value) {
																					// reset turnout acceptance criteria
																					form.setFieldValue(
																						workingWeightMinTurnoutPath,
																						''
																					);
																					form.setFieldValue(
																						workingUnweightMinTurnoutPath,
																						''
																					);
																				}
																			}}
																			color="default"
																		/>
																	}
																	label="Minimum Turnout"
																/>
															)}
														/>
													</Grid>
													<Grid item xs={4}>
														<label
															style={{
																color: this.criteriaStyle(
																	values,
																	checkedTurnoutPath
																),
															}}
														>
															Weighted Ratio:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
															<input
																name={workingWeightMinTurnoutPath}
																disabled={!get(values, checkedTurnoutPath)}
																size="4"
																onBlur={handleBlur}
																type="number"
																className={classes.numberInput}
																value={get(values, workingWeightMinTurnoutPath)}
																onChange={handleChange}
															/>
														</label>
														<br />
														<label
															style={{
																color: this.criteriaStyle(
																	values,
																	checkedTurnoutPath
																),
															}}
														>
															Unweighted Ratio:&nbsp;
															<input
																name={workingUnweightMinTurnoutPath}
																disabled={!get(values, checkedTurnoutPath)}
																size="4"
																onBlur={handleBlur}
																type="number"
																className={classes.numberInput}
																value={get(
																	values,
																	workingUnweightMinTurnoutPath
																)}
																onChange={handleChange}
															/>
														</label>
													</Grid>
													<Grid
														style={{
															color: this.criteriaStyle(
																values,
																checkedTurnoutPath
															),
														}}
														item
														xs={4}
													>
														Applies to all eligible voters.
													</Grid>
												</Grid>
											</ListItem>
											<ListItem disableGutters divider>
												<Grid container>
													<Grid item xs={4}>
														<Field
															name={checkedSupportPath}
															render={({ field, form }) => (
																<FormControlLabel
																	control={
																		<Checkbox
																			name={checkedSupportPath}
																			checked={field.value}
																			//onChange={handleChange}

																			onChange={(e) => {
																				handleChange(e);

																				form.setFieldValue(
																					applyMinSupportToAllOptions,
																					true
																				);

																				if (field.value) {
																					//reset support acceptance criteria
																					form.setFieldValue(
																						workingWeightMinSupportPath,
																						''
																					);
																					form.setFieldValue(
																						workingUnweightMinSupportPath,
																						''
																					);
																					form.setFieldValue(
																						workingMinSupportOption,
																						''
																					);
																				}
																			}}
																			color="default"
																		/>
																	}
																	label="Minimum Support"
																/>
															)}
														/>
													</Grid>
													<Grid item xs={4}>
														<label
															style={{
																color: this.criteriaStyle(
																	values,
																	checkedSupportPath
																),
															}}
														>
															Weighted Ratio:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
															<input
																name={workingWeightMinSupportPath}
																disabled={!get(values, checkedSupportPath)}
																size="4"
																onBlur={handleBlur}
																type="number"
																className={classes.numberInput}
																value={get(values, workingWeightMinSupportPath)}
																onChange={handleChange}
															/>
														</label>

														<br />
														<label
															style={{
																color: this.criteriaStyle(
																	values,
																	checkedSupportPath
																),
															}}
														>
															Unweighted Ratio:&nbsp;
															<input
																name={workingUnweightMinSupportPath}
																disabled={!get(values, checkedSupportPath)}
																size="4"
																onBlur={handleBlur}
																type="number"
																className={classes.numberInput}
																value={get(
																	values,
																	workingUnweightMinSupportPath
																)}
																onChange={handleChange}
															/>
														</label>
													</Grid>
													<Grid item xs={4}>
														<div
															style={{
																color: this.criteriaStyle(
																	values,
																	checkedSupportPath
																),
															}}
														>
															{get(values, voteTypeTextPath) ? (
																get(values, voteTypeTextPath) ===
																SINGLE_OPTION_VOTING ? (
																	<div>
																		Applies to option:&nbsp;
																		<Field
																			name={workingMinSupportOption}
																			component="select"
																			disabled={
																				!get(values, checkedSupportPath)
																			}
																			onChange={(e) => {
																				handleChange(e);

																				if (!e.target.value) {
																					setFieldValue(
																						applyMinSupportToAllOptions,
																						true
																					);
																				} else {
																					setFieldValue(
																						applyMinSupportToAllOptions,
																						false
																					);
																				}
																			}}
																		>
																			<option value="">All Options</option>
																			{get(values, optionsPath).map(
																				(option, index) => (
																					<option key={index} value={option}>
																						{option}
																					</option>
																				)
																			)}
																		</Field>
																	</div>
																) : (
																	'Applies to all options'
																)
															) : (
																'Select an Answer Type'
															)}
														</div>
													</Grid>
												</Grid>
											</ListItem>
										</List>
									</Grid>
								</Grid>
								<Grid item xs={12} className={classes.stepperButtons}>
									<br />
									<Button onClick={this.props.handleBack}>Back</Button>
									<Button
										variant="raised"
										color="primary"
										type="submit"
										disabled={isSubmitting}
									>
										Next
									</Button>
									{isSubmitting && errors && window.scrollTo(0, 0)}
								</Grid>
							</Form>
						</Grid>
					</Grid>
				)}
			/>
		);
	}
}

ConfigureVoteForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	pad: {
		padding: 15,
	},
	questionTypeLabel: { paddingTop: '11px' },
	raiseRadio: {
		position: 'relative',
		top: '-16px',
	},
	optionList: {
		width: '350px',
		overflow: 'auto',
	},
	optionListItem: {
		padding: '0px',
	},
	numberInput: {
		width: '40px',
	},
	isInvalid: {
		borderColor: '#dc3545',
		borderWidth: '1.2px',
	},
	invalidFeedback: {
		color: 'red',
		fontSize: '15px',
	},
	moveLeft: {
		marginLeft: '-50px',
	},
	stepperButtons: {
		marginLeft: '-15px',
	},
	questionTextbox: {
		marginLeft: '-27px',
	},
});
export default withStyles(styles)(ConfigureVoteForm);
