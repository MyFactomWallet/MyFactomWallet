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
//const configPath = 'pollJSON.vote.config';
const optionsPath = 'pollJSON.vote.config.options';
const weightedMinTurnoutPath =
	'pollJSON.vote.config.acceptanceCriteria.weightedMinTurnout';
const unweightedMinTurnoutPath =
	'pollJSON.vote.config.acceptanceCriteria.unweightedMinTurnout';
const weightedMinSupportPath =
	'pollJSON.vote.config.acceptanceCriteria.weightedMinSupport';
const unweightedMinSupportPath =
	'pollJSON.vote.config.acceptanceCriteria.unweightedMinSupport';

// form specific fields
const questionSourcePath = 'formFields.questionSource';
const workingOptionPath = 'formFields.workingOption';
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
												Commit Start Date:
												{this.errorStar(errors, touched, commitStartPath)}
											</Typography>
										</Grid>
										<Grid item xs={9} className={classes.moveLeft}>
											<Field
												type="date"
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
												Commit End Date:
												{this.errorStar(errors, touched, commitEndPath)}
											</Typography>
										</Grid>
										<Grid item xs={9} className={classes.moveLeft}>
											<Field
												type="date"
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
												Reveal Start Date:
												{this.errorStar(errors, touched, revealStartPath)}
											</Typography>
										</Grid>
										<Grid item xs={9} className={classes.moveLeft}>
											<Field
												type="date"
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
												Reveal End Date:
												{this.errorStar(errors, touched, revealEndPath)}
											</Typography>
										</Grid>
										<Grid item xs={9} className={classes.moveLeft}>
											<Field
												type="date"
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
											<Typography gutterBottom variant="title">
												Question
											</Typography>
										</Grid>

										<Grid item xs={12}>
											<FormControl component="fieldset">
												<RadioGroup
													name={questionSourcePath}
													value={get(values, questionSourcePath)}
													onChange={(e) => {
														handleChange(e);
														if (e.target.value === 'text') {
															setFieldValue(hrefPath, '');
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
										{get(values, questionSourcePath) === 'href' && (
											<Grid item xs={12}>
												<Typography gutterBottom>
													URL Link:
													{this.errorStar(errors, touched, hrefPath)}
													&nbsp;
													<Field
														type="text"
														name={hrefPath}
														className={this.errorClass(
															errors,
															touched,
															hrefPath,
															classes
														)}
													/>
												</Typography>
												{this.errorText(errors, touched, hrefPath, classes)}
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
										<Grid item xs={1}>
											<Typography gutterBottom>Type:&nbsp;</Typography>
										</Grid>
										<Grid item xs={11}>
											<Field
												name={voteTypePath}
												render={({ field, form }) => (
													<select
														{...field}
														onChange={(e) => {
															handleChange(e);
															form.setFieldValue(minOptionsPath, '');
															form.setFieldValue(maxOptionsPath, '');
															form.setFieldValue(optionsPath, []);
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
											<Grid container item xs={12}>
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

										{(get(values, voteTypePath) === APPROVAL_VOTING ||
											get(values, voteTypePath) === INSTANT_RUNOFF_VOTING) && (
											<Grid container item xs={12}>
												<Grid item xs={12}>
													<Typography gutterBottom>
														Minimum Options Allowed:&nbsp;&nbsp;
														<Field
															type="number"
															className={classes.numberInput}
															name={minOptionsPath}
														/>
													</Typography>
												</Grid>
												<Grid item xs={12}>
													<Typography gutterBottom>
														Maximum Options Allowed:&nbsp;
														<Field
															type="number"
															className={classes.numberInput}
															name={maxOptionsPath}
														/>
													</Typography>
												</Grid>
											</Grid>
										)}
										{get(values, voteTypePath) && (
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
																					setFieldValue(workingOptionPath, '');
																				}
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
																						weightedMinTurnoutPath,
																						''
																					);
																					form.setFieldValue(
																						unweightedMinTurnoutPath,
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
																color: this.criteriaStyle(
																	values,
																	checkedTurnoutPath
																),
															}}
														>
															Weighted Ratio:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
															<input
																name={weightedMinTurnoutPath}
																disabled={!get(values, checkedTurnoutPath)}
																size="4"
																onBlur={handleBlur}
																type="number"
																className={classes.numberInput}
																value={get(values, weightedMinTurnoutPath)}
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
																name={unweightedMinTurnoutPath}
																disabled={!get(values, checkedTurnoutPath)}
																size="4"
																onBlur={handleBlur}
																type="number"
																className={classes.numberInput}
																value={get(values, unweightedMinTurnoutPath)}
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
																						weightedMinSupportPath,
																						''
																					);
																					form.setFieldValue(
																						unweightedMinSupportPath,
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
																color: this.criteriaStyle(
																	values,
																	checkedSupportPath
																),
															}}
														>
															Weighted Ratio:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
															<input
																name={weightedMinSupportPath}
																disabled={!get(values, checkedSupportPath)}
																size="4"
																onBlur={handleBlur}
																type="number"
																className={classes.numberInput}
																value={get(values, weightedMinSupportPath)}
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
																name={unweightedMinSupportPath}
																disabled={!get(values, checkedSupportPath)}
																size="4"
																onBlur={handleBlur}
																type="number"
																className={classes.numberInput}
																value={get(values, unweightedMinSupportPath)}
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
