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
import {
	SINGLE_OPTION_VOTING,
	APPROVAL_VOTING,
	INSTANT_RUNOFF_VOTING,
} from './VOTE_CONSTANTS';

// poll config fields
const titlePath = 'pollJSON.proposal.title';
const commitStartPath = 'pollJSON.vote.phasesBlockHeights.commitStart';
const commitEndPath = 'pollJSON.vote.phasesBlockHeights.commitEnd';
const revealStartPath = 'pollJSON.vote.phasesBlockHeights.revealStart';
const revealEndPath = 'pollJSON.vote.phasesBlockHeights.revealEnd';
const hrefPath = 'pollJSON.proposal.externalRef.href';
const textPath = 'pollJSON.proposal.text';
const voteTypePath = 'pollJSON.vote.type';
const minOptionsPath = 'pollJSON.vote.config.minOptions';
const maxOptionsPath = 'pollJSON.vote.config.maxOptions';
const optionsPath = 'pollJSON.vote.config.options';
const criteriaPath = 'pollJSON.vote.config.acceptanceCriteria';

// form specific fields
const workingQuestionTypePath = 'formFields.questionType';
const workingOptionPath = 'formFields.workingOption';
const workingWeightedMinSupportPath = 'formFields.weightMinSupport';
const workingUnweightedMinSupportPath = 'formFields.unweightMinSupport';
const workingWeightedMinTurnoutPath = 'formFields.weightedMinTurnout';
const workingUnweightedMinTurnoutPath = 'formFields.unweightedMinTurnout';
const checkedTurnoutPath = 'formFields.checkedTurnout';
const checkedSupportPath = 'formFields.checkedSupport';

class ConfigureVoteForm extends React.Component {
	componentDidMount() {
		window.scrollTo(0, 0);
	}

	handleKeyPress(event) {
		if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
			event.preventDefault();
		}
	}

	render() {
		const { pollForm, updatePoll, classes } = this.props;

		const displayError = (errors, touched, path) => {
			if (get(errors, path) && get(touched, path)) {
				return true;
			} else {
				return false;
			}
		};

		const errorStar = (errors, touched, path) => {
			if (displayError(errors, touched, path)) {
				return <span style={{ color: 'red' }}>&nbsp;*</span>;
			}
		};

		const errorText = (errors, touched, path) => {
			if (displayError(errors, touched, path)) {
				return (
					<div className={classes.invalidFeedback}>{get(errors, path)}</div>
				);
			}
		};

		const errorClass = (errors, touched, path, classes) => {
			if (displayError(errors, touched, path)) {
				return `${classes.isInvalid}`;
			}
		};

		function criteriaStyle(values, path) {
			return !get(values, path) ? 'gray' : '';
		}

		/*const now = new Date();
		const today = new Date(
			Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
		);*/

		return (
			<Formik
				initialValues={pollForm}
				validationSchema={Yup.object().shape({
					pollJSON: Yup.object().shape({
						proposal: Yup.object().shape({
							title: Yup.string().required('Required'),
						}),
						vote: Yup.object().shape({
							/* phasesBlockHeights: Yup.object().shape({
								commitStart: Yup.date()
									.transform((currentValue, originalValue) => {
										return originalValue === '' ? undefined : currentValue;
									})
									.required('Required'),
								commitEnd: Yup.date()
									.transform((currentValue, originalValue) => {
										return originalValue === '' ? undefined : currentValue;
									})
									.required('Required'),
								revealStart: Yup.date()
									.transform((currentValue, originalValue) => {
										return originalValue === '' ? undefined : currentValue;
									})
									.required('Required'),
								revealEnd: Yup.date()
									.transform((currentValue, originalValue) => {
										return originalValue === '' ? undefined : currentValue;
									})
									.required('Required'),
								//.min(
								//		today,
								//		`Commit Start Date should be equal or later than today's date`
								//	),
							}), */
						}),
					}),
				})}
				onSubmit={(values, actions) => {
					updatePoll(values);
					this.props.handleNext();
				}}
				render={({
					errors,
					touched,
					isSubmitting,
					handleReset,
					dirty,
					values,
					setFieldValue,
					handleChange,
					handleBlur,
				}) => (
					<Grid container className={classes.pad}>
						<Grid item xs={12}>
							<Typography gutterBottom variant="title">
								Configure Poll
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Form onKeyPress={this.handleKeyPress}>
								<Grid container>
									<Grid container item xs={12}>
										<Grid item xs={3}>
											<Typography gutterBottom>
												Title:
												{errorStar(errors, touched, titlePath)}
											</Typography>
										</Grid>
										<Grid item xs={6} className={classes.moveLeft}>
											<FastField
												type="text"
												name={titlePath}
												size="35"
												className={errorClass(
													errors,
													touched,
													titlePath,
													classes
												)}
											/>
											{errorText(errors, touched, titlePath)}
										</Grid>
										<Grid item xs={3}>
											{/*<input
											type="button"
											onClick={handleReset}
											disabled={!dirty || isSubmitting}
											style={{ display: 'inline-block' }}
											value="Fill [Test]"
										/>*/}
											&nbsp;
											<input
												type="button"
												onClick={handleReset}
												disabled={!dirty || isSubmitting}
												style={{ display: 'inline-block' }}
												value="Reset"
											/>
										</Grid>
										<Grid item xs={3}>
											<Typography gutterBottom>
												Commit Start Date:
												{errorStar(errors, touched, commitStartPath)}
											</Typography>
										</Grid>
										<Grid item xs={9} className={classes.moveLeft}>
											<Field
												type="date"
												name={commitStartPath}
												className={errorClass(
													errors,
													touched,
													commitStartPath,
													classes
												)}
											/>
											{errorText(errors, touched, commitStartPath)}
										</Grid>
										<Grid item xs={3}>
											<Typography gutterBottom>
												Commit End Date:
												{errorStar(errors, touched, commitEndPath)}
											</Typography>
										</Grid>
										<Grid item xs={9} className={classes.moveLeft}>
											<Field
												type="date"
												name={commitEndPath}
												className={errorClass(
													errors,
													touched,
													commitEndPath,
													classes
												)}
											/>
											{errorText(errors, touched, commitEndPath)}
										</Grid>
										<Grid item xs={3}>
											<Typography gutterBottom>
												Reveal Start Date:
												{errorStar(errors, touched, revealStartPath)}
											</Typography>
										</Grid>
										<Grid item xs={9} className={classes.moveLeft}>
											<Field
												type="date"
												name={revealStartPath}
												className={errorClass(
													errors,
													touched,
													revealStartPath,
													classes
												)}
											/>
											{errorText(errors, touched, revealStartPath)}
										</Grid>
										<Grid item xs={3}>
											<Typography gutterBottom>
												Reveal End Date:
												{errorStar(errors, touched, revealEndPath)}
											</Typography>
										</Grid>
										<Grid item xs={9} className={classes.moveLeft}>
											<Field
												type="date"
												name={revealEndPath}
												className={errorClass(
													errors,
													touched,
													revealEndPath,
													classes
												)}
											/>
											{errorText(errors, touched, revealEndPath)}
										</Grid>
									</Grid>
									<Grid container item xs={12}>
										<Grid item xs={12}>
											<br />
											<Typography gutterBottom variant="title">
												Question
											</Typography>
										</Grid>

										<Grid item xs={12}>
											<FormControl component="fieldset">
												<RadioGroup
													name={workingQuestionTypePath}
													value={get(values, workingQuestionTypePath)}
													onChange={handleChange}
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
										{get(values, workingQuestionTypePath) === 'href' && (
											<Grid item container xs={12}>
												<Grid item xs={1}>
													<Typography gutterBottom>Question:</Typography>
												</Grid>
												<Grid item xs={11}>
													<Field name={textPath}>
														{({ field }) => (
															<textarea {...field} rows="4" cols="60" />
														)}
													</Field>
												</Grid>
											</Grid>
										)}
										{get(values, workingQuestionTypePath) === 'text' && (
											<Grid item xs={12}>
												<Typography gutterBottom>
													URL Link:
													{errorStar(errors, touched, hrefPath)}
													&nbsp;
													<Field
														type="text"
														name={hrefPath}
														className={errorClass(
															errors,
															touched,
															hrefPath,
															classes
														)}
													/>
												</Typography>
												{errorText(errors, touched, hrefPath)}
											</Grid>
										)}
									</Grid>
									<Grid container item xs={12}>
										<Grid item xs={12}>
											<br />
											<Typography gutterBottom variant="title">
												Answers
											</Typography>
										</Grid>
										<Grid item xs={2}>
											<Typography gutterBottom>Type:&nbsp;</Typography>
										</Grid>
										<Grid item xs={10}>
											<Field
												name={voteTypePath}
												render={({ field, form }) => (
													<select
														{...field}
														onChange={(e) => {
															handleChange(e);
															const nextValue = e.target.value;

															form.setFieldValue(minOptionsPath, '');
															form.setFieldValue(maxOptionsPath, '');

															if (nextValue === SINGLE_OPTION_VOTING) {
																form.setFieldValue(optionsPath, ['Yes', 'No']);
															} else {
																form.setFieldValue(optionsPath, []);
															}
														}}
													>
														<option value="" defaultValue />
														<option value={SINGLE_OPTION_VOTING}>
															Single Option Voting
														</option>
														<option value={APPROVAL_VOTING}>
															Approval Voting
														</option>
														<option value={INSTANT_RUNOFF_VOTING}>
															Instant Run-Off Voting
														</option>
													</select>
												)}
											/>
										</Grid>
										{get(values, voteTypePath) && (
											<Grid container>
												<Grid item xs={2}>
													<Typography gutterBottom>
														Allow Abstain:&nbsp;
													</Typography>
												</Grid>
												<Grid item xs={10}>
													<input type="checkbox" />
												</Grid>
											</Grid>
										)}
										{get(values, voteTypePath) === SINGLE_OPTION_VOTING && (
											<Grid container>
												<Grid item xs={6}>
													<Paper elevation={10} className={classes.pad}>
														<Typography variant="subheading">
															Options
														</Typography>
														<List dense>
															{get(values, optionsPath) &&
																get(values, optionsPath).map(
																	(option, index) => (
																		<ListItem key={index} divider>
																			<LabelImportant
																				style={{ fontSize: 15 }}
																			/>
																			<ListItemText primary={option} />
																		</ListItem>
																	)
																)}
														</List>
													</Paper>
												</Grid>
												<Grid item xs={6} />
											</Grid>
										)}
										{(get(values, voteTypePath) === APPROVAL_VOTING ||
											get(values, voteTypePath) === INSTANT_RUNOFF_VOTING) && (
											<Grid container>
												<Grid item xs={12}>
													<Typography gutterBottom>
														Minimum Options Allowed:&nbsp;&nbsp;
														<Field
															type="number"
															className={classes.numberInput}
															name={minOptionsPath}
														/>
													</Typography>
													<Typography gutterBottom>
														Maximum Options Allowed:&nbsp;
														<Field
															type="number"
															className={classes.numberInput}
															name={maxOptionsPath}
														/>
													</Typography>
												</Grid>
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
																					if (get(values, workingOptionPath)) {
																						// add value
																						arrayHelpers.push(
																							get(values, workingOptionPath)
																						);
																						// reset input
																						setFieldValue(
																							workingOptionPath,
																							''
																						);
																					}
																				}}
																				value="Add"
																				disabled={
																					!get(values, workingOptionPath)
																				}
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
																							onClick={() =>
																								arrayHelpers.remove(index)
																							}
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
											</Grid>
										)}
									</Grid>
									<Grid item xs={12}>
										<br />
										<br />
										<Typography gutterBottom variant="title">
											Invalidation Criteria
										</Typography>

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
																			checked={field.value}
																			onChange={() => {
																				form.setFieldValue(
																					checkedTurnoutPath,
																					!field.value
																				);
																				if (field.value) {
																					// reset turnout invalidation criteria
																					form.setFieldValue(
																						workingWeightedMinTurnoutPath,
																						''
																					);
																					form.setFieldValue(
																						workingUnweightedMinTurnoutPath,
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
														<pre>{JSON.stringify(values, null, 2)}</pre>
													</Grid>
													<Grid item xs={8}>
														<label
															style={{
																color: criteriaStyle(
																	values,
																	checkedTurnoutPath
																),
															}}
														>
															Weighted Ratio:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
															<input
																name={workingWeightedMinTurnoutPath}
																disabled={!get(values, checkedTurnoutPath)}
																size="4"
																onBlur={handleBlur}
																type="number"
																className={classes.numberInput}
																value={get(
																	values,
																	workingWeightedMinTurnoutPath
																)}
																onChange={handleChange}
															/>
														</label>
														<br />
														<label
															style={{
																color: criteriaStyle(
																	values,
																	checkedTurnoutPath
																),
															}}
														>
															Unweighted Ratio:&nbsp;
															<input
																name={workingUnweightedMinTurnoutPath}
																disabled={!get(values, checkedTurnoutPath)}
																size="4"
																onBlur={handleBlur}
																type="number"
																className={classes.numberInput}
																value={get(
																	values,
																	workingUnweightedMinTurnoutPath
																)}
																onChange={handleChange}
															/>
														</label>
													</Grid>
												</Grid>
											</ListItem>
											<ListItem disableGutters>
												<Grid container>
													<Grid item xs={4}>
														<Field
															name={checkedSupportPath}
															render={({ field, form }) => (
																<FormControlLabel
																	control={
																		<Checkbox
																			checked={field.value}
																			onChange={() => {
																				form.setFieldValue(
																					checkedSupportPath,
																					!field.value
																				);
																				if (field.value) {
																					// reset support invalidation criteria
																					form.setFieldValue(
																						workingWeightedMinSupportPath,
																						''
																					);
																					form.setFieldValue(
																						workingUnweightedMinSupportPath,
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
													<Grid item xs={8}>
														<label
															style={{
																color: criteriaStyle(
																	values,
																	checkedSupportPath
																),
															}}
														>
															Weighted Ratio:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
															<input
																name={workingWeightedMinSupportPath}
																disabled={!get(values, checkedSupportPath)}
																size="4"
																onBlur={handleBlur}
																type="number"
																className={classes.numberInput}
																value={get(
																	values,
																	workingWeightedMinSupportPath
																)}
																onChange={handleChange}
															/>
														</label>

														<br />
														<label
															style={{
																color: criteriaStyle(
																	values,
																	checkedSupportPath
																),
															}}
														>
															Unweighted Ratio:&nbsp;
															<input
																name={workingUnweightedMinSupportPath}
																disabled={!get(values, checkedSupportPath)}
																size="4"
																onBlur={handleBlur}
																type="number"
																className={classes.numberInput}
																value={get(
																	values,
																	workingUnweightedMinSupportPath
																)}
																onChange={handleChange}
															/>
														</label>
													</Grid>
												</Grid>
											</ListItem>
										</List>
									</Grid>
								</Grid>

								<div className={classes.stepperButtons}>
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
								</div>
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
});
export default withStyles(styles)(ConfigureVoteForm);
