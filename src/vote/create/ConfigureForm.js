import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import _get from 'lodash/get';
import _omit from 'lodash/omit';
import PropTypes from 'prop-types';
import {
	Formik,
	Field,
	FastField,
	Form,
	FieldArray,
	ErrorMessage,
} from 'formik';
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
import SectionHeader from '../shared/SectionHeader';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import {
	SINGLE_OPTION_VOTING,
	APPROVAL_VOTING,
	INSTANT_RUNOFF_VOTING,
	ALL_ELIGIBLE_VOTERS,
	PARTICIPANTS_ONLY,
} from './VOTE_CONSTANTS';

/**
 * Constants
 */
const TYPE_VALUES = [
	{ value: SINGLE_OPTION_VOTING, text: SINGLE_OPTION_VOTING },
	{ value: APPROVAL_VOTING, text: APPROVAL_VOTING },
	{ value: INSTANT_RUNOFF_VOTING, text: INSTANT_RUNOFF_VOTING },
];

const COMPUTE_AGAINST_VALUES = [
	{ value: ALL_ELIGIBLE_VOTERS, text: ALL_ELIGIBLE_VOTERS },
	{ value: PARTICIPANTS_ONLY, text: PARTICIPANTS_ONLY },
];

const ABSTENTION_VALUES = [
	{ value: true, text: 'True' },
	{ value: false, text: 'False' },
];

const TITLE_MAX_LENGTH = 32;

// poll config fields
const titlePath = 'pollJSON.proposal.title';
const commitStartPath = 'pollJSON.vote.phasesBlockHeights.commitStart';
const commitEndPath = 'pollJSON.vote.phasesBlockHeights.commitEnd';
const revealStartPath = 'pollJSON.vote.phasesBlockHeights.revealStart';
const revealEndPath = 'pollJSON.vote.phasesBlockHeights.revealEnd';
const proposalPath = 'pollJSON.proposal';
const externalRefPath = 'pollJSON.proposal.externalRef';
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

	handleOptionKeyPress(event) {
		console.log('pressed');
		console.log(event.target.value);
		if (event.which === 13 /* Enter */ && event.target.value) {
		}
	}

	handleKeyPress(event) {
		if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
			event.preventDefault();
		}
	}

	criteriaStyle = (values, path) => {
		return !_get(values, path) ? 'gray' : '';
	};

	render() {
		const { pollForm, updatePoll, classes } = this.props;

		return (
			<Formik
				initialValues={pollForm}
				validationSchema={Yup.object().shape({
					pollJSON: Yup.object().shape({
						proposal: Yup.object().shape({
							title: Yup.string().required('Required'),
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
					if (_get(values, textPath)) {
						// delete href
						values = _omit(values, externalRefPath);
					} else {
						// delete text
						values = _omit(values, textPath);

						// add externalRef config
						_get(values, proposalPath).externalRef = {
							href: _get(values, workingHrefPath),
							hash: { value: '', algo: '' },
						};
					}

					/*
					* Handle acceptance criteria
					*/
					if (
						_get(values, checkedTurnoutPath) ||
						_get(values, checkedSupportPath)
					) {
						// reset acceptance criteria
						_get(values, configPath).acceptanceCriteria = {};
					} else {
						// no acceptance criteria
						values = _omit(values, acceptanceCriteriaPath);
					}

					// add turnout criteria
					if (_get(values, checkedTurnoutPath)) {
						_get(values, acceptanceCriteriaPath).minTurnout = {
							weighted: _get(values, workingWeightMinTurnoutPath),
							unweighted: _get(values, workingUnweightMinTurnoutPath),
						};
					}

					// add support criteria
					if (_get(values, checkedSupportPath)) {
						_get(values, acceptanceCriteriaPath).minSupport = {};

						if (_get(values, applyMinSupportToAllOptions)) {
							// add criteria for all options
							for (let option of _get(values, optionsPath)) {
								_get(values, acceptanceCriteriaPath).minSupport[option] = {
									weighted: _get(values, workingWeightMinSupportPath),
									unweighted: _get(values, workingUnweightMinSupportPath),
								};
							}
						} else {
							// add criteria for specific option
							_get(values, acceptanceCriteriaPath).minSupport = {
								[_get(values, workingMinSupportOption)]: {
									weighted: _get(values, workingWeightMinSupportPath),
									unweighted: _get(values, workingUnweightMinSupportPath),
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
					<Form onKeyPress={this.handleKeyPress}>
						<Grid container className={classes.pad}>
							<Grid container item xs={12}>
								<Grid item xs={12}>
									<SectionHeader
										disableGutterBottom={true}
										text="Configure Poll"
									/>
								</Grid>
								<Grid container spacing={8} item xs={6}>
									<Grid item xs={12}>
										<FormTextField
											name={titlePath}
											label="Title"
											type="text"
											required={true}
											fullWidth={true}
											maxLength={TITLE_MAX_LENGTH}
											enableSpellCheck={true}
											error={
												_get(errors, titlePath) && _get(touched, titlePath)
											}
											errorClass={classes.errorText}
										/>
									</Grid>
									<Grid item xs={12}>
										<FormTextField
											name={commitStartPath}
											required={true}
											label="Commit Start Block"
											type="number"
											error={
												_get(errors, commitStartPath) &&
												_get(touched, commitStartPath)
											}
											errorClass={classes.errorText}
										/>
									</Grid>
									<Grid item xs={12}>
										<FormTextField
											name={commitEndPath}
											required={true}
											label="Commit End Block"
											type="number"
											error={
												_get(errors, commitEndPath) &&
												_get(touched, commitEndPath)
											}
											errorClass={classes.errorText}
										/>
									</Grid>
									<Grid item xs={12}>
										<FormTextField
											name={revealStartPath}
											required={true}
											label="Reveal Start Block"
											type="number"
											error={
												_get(errors, revealStartPath) &&
												_get(touched, revealStartPath)
											}
											errorClass={classes.errorText}
										/>
									</Grid>
									<Grid item xs={12}>
										<FormTextField
											name={revealEndPath}
											required={true}
											label="Reveal End Block"
											type="number"
											error={
												_get(errors, revealEndPath) &&
												_get(touched, revealEndPath)
											}
											errorClass={classes.errorText}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid container item xs={12}>
								<Grid item xs={12}>
									<br />
									<SectionHeader disableGutterBottom={true} text="Question" />
								</Grid>

								<Grid item xs={3}>
									<FormControl component="fieldset">
										<RadioGroup
											name={questionSourcePath}
											value={_get(values, questionSourcePath)}
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
								{_get(values, questionSourcePath) === 'text' && (
									<Grid item container xs={9}>
										<FormTextField
											name={textPath}
											required={true}
											fullWidth={true}
											label="Question"
											type="text"
											multiline={true}
											enableSpellCheck={true}
											error={_get(errors, textPath) && _get(touched, textPath)}
											errorClass={classes.errorText}
										/>
									</Grid>
								)}
								{_get(values, questionSourcePath) === 'href' && (
									<Grid item xs={9}>
										<FormTextField
											name={workingHrefPath}
											required={true}
											fullWidth={true}
											label="URL Link"
											type="text"
											enableSpellCheck={true}
											error={
												_get(errors, workingHrefPath) &&
												_get(touched, workingHrefPath)
											}
											errorClass={classes.errorText}
										/>
									</Grid>
								)}
							</Grid>
							<Grid container spacing={8} item xs={12}>
								<Grid item xs={12}>
									<SectionHeader disableGutterBottom={true} text="Answers" />
								</Grid>
								<Grid item xs={12}>
									<FormSelectField
										name={voteTypeTextPath}
										label="Type"
										options={TYPE_VALUES}
										width={215}
										onChange={(e) => {
											//update question type
											handleChange(e);

											//update dependent fields
											const newValue = e.target.value;

											setFieldValue(optionsPath, []);
											setFieldValue(applyMinSupportToAllOptions, true);
											setFieldValue(workingMinSupportOption, '');

											if (newValue === SINGLE_OPTION_VOTING) {
												setFieldValue(voteTypePath, 0);
												setFieldValue(minOptionsPath, 1);
												setFieldValue(maxOptionsPath, 1);
											} else if (newValue === APPROVAL_VOTING) {
												setFieldValue(voteTypePath, 0);
												setFieldValue(minOptionsPath, '');
												setFieldValue(maxOptionsPath, '');
											} else if (newValue === INSTANT_RUNOFF_VOTING) {
												setFieldValue(voteTypePath, 1);
												setFieldValue(minOptionsPath, '');
												setFieldValue(maxOptionsPath, '');
											}
										}}
									/>
								</Grid>
								{_get(values, voteTypeTextPath) && (
									<Grid container spacing={8} item xs={12}>
										<Grid item xs={12}>
											<FormSelectField
												name={computeResultsAgainstPath}
												label="Compute Results Against"
												options={COMPUTE_AGAINST_VALUES}
												width={215}
												onChange={(e) => {
													handleChange(e);
													if (e.target.value === ALL_ELIGIBLE_VOTERS) {
														setFieldValue(abstentionPath, false);
													} else {
														setFieldValue(abstentionPath, '');
													}
												}}
											/>
										</Grid>
										<Grid item xs={12}>
											<FormSelectField
												name={abstentionPath}
												label="Allow Abstention"
												options={ABSTENTION_VALUES}
												width={215}
												onChange={handleChange}
												disabled={
													_get(values, computeResultsAgainstPath) ===
													ALL_ELIGIBLE_VOTERS
												}
											/>
											<br />
										</Grid>
									</Grid>
								)}

								{(_get(values, voteTypeTextPath) === APPROVAL_VOTING ||
									_get(values, voteTypeTextPath) === INSTANT_RUNOFF_VOTING) && (
									<Grid container spacing={8} item xs={12}>
										<Grid item xs={12}>
											<FormTextField
												name={minOptionsPath}
												required={true}
												label="Minimum Options Allowed"
												type="number"
												width={215}
												error={
													_get(errors, minOptionsPath) &&
													_get(touched, minOptionsPath)
												}
												errorClass={classes.errorText}
											/>
										</Grid>
										<Grid item xs={12}>
											<FormTextField
												name={maxOptionsPath}
												required={true}
												label="Maximum Options Allowed"
												type="number"
												width={215}
												error={
													_get(errors, maxOptionsPath) &&
													_get(touched, maxOptionsPath)
												}
												errorClass={classes.errorText}
											/>
										</Grid>
									</Grid>
								)}
								{_get(values, voteTypeTextPath) && (
									<Grid item xs={12}>
										<Paper elevation={2} className={classes.pad}>
											<List className={classes.optionList} dense>
												<FieldArray
													name={optionsPath}
													render={(arrayHelpers) => (
														<div>
															<Typography variant="subtitle1">
																Options&nbsp;&nbsp;
																<Field
																	name={workingOptionPath}
																	type="text"
																	onKeyPress={(e) => {
																		if (
																			e.which === 13 /* Enter */ &&
																			e.target.value.trim()
																		) {
																			arrayHelpers.push(
																				_get(values, workingOptionPath)
																			);
																			// reset input
																			setFieldValue(workingOptionPath, '');
																		}
																	}}
																/>
																<input
																	type="button"
																	onClick={() => {
																		arrayHelpers.push(
																			_get(values, workingOptionPath)
																		);
																		// reset input
																		setFieldValue(workingOptionPath, '');
																	}}
																	value="Add"
																	disabled={!_get(values, workingOptionPath)}
																/>
															</Typography>
															{_get(values, optionsPath).length > 0 ? (
																_get(values, optionsPath).map(
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
																						_get(
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
								<br />
								<br />
								<SectionHeader
									disableGutterBottom={true}
									text="Acceptance Criteria"
								/>
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
														disabled={!_get(values, checkedTurnoutPath)}
														size="4"
														onBlur={handleBlur}
														type="number"
														className={classes.numberInput}
														value={_get(values, workingWeightMinTurnoutPath)}
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
														disabled={!_get(values, checkedTurnoutPath)}
														size="4"
														onBlur={handleBlur}
														type="number"
														className={classes.numberInput}
														value={_get(values, workingUnweightMinTurnoutPath)}
														onChange={handleChange}
													/>
												</label>
											</Grid>
											<Grid
												style={{
													color: this.criteriaStyle(values, checkedTurnoutPath),
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
														disabled={!_get(values, checkedSupportPath)}
														size="4"
														onBlur={handleBlur}
														type="number"
														className={classes.numberInput}
														value={_get(values, workingWeightMinSupportPath)}
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
														disabled={!_get(values, checkedSupportPath)}
														size="4"
														onBlur={handleBlur}
														type="number"
														className={classes.numberInput}
														value={_get(values, workingUnweightMinSupportPath)}
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
													{_get(values, voteTypeTextPath) ? (
														_get(values, voteTypeTextPath) ===
														SINGLE_OPTION_VOTING ? (
															<div>
																Applies to option:&nbsp;
																<Field
																	name={workingMinSupportOption}
																	component="select"
																	disabled={!_get(values, checkedSupportPath)}
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
																	{_get(values, optionsPath).map(
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
							<Grid item xs={12} className={classes.stepperButtons}>
								<br />
								<Button onClick={this.props.handleBack}>Back</Button>
								<Button
									variant="contained"
									color="primary"
									type="submit"
									disabled={isSubmitting}
								>
									Next
								</Button>
								{isSubmitting && errors && window.scrollTo(0, 0)}
							</Grid>
						</Grid>
					</Form>
				)}
			/>
		);
	}
}

const FormTextField = (props) => {
	return (
		<React.Fragment>
			<Field name={props.name}>
				{({ field }) => (
					<TextField
						style={{ minWidth: props.width }}
						required={props.required}
						{...field}
						type={props.type}
						inputProps={{
							spellCheck: props.enableSpellCheck,
							maxLength: props.maxLength,
							autoComplete: 'nope',
						}}
						error={props.error}
						label={props.label}
						fullWidth={props.fullWidth}
						multiline={props.multiline}
					/>
				)}
			</Field>
			<ErrorMessage
				name={props.name}
				render={(msg) => <span className={props.errorClass}>{msg}</span>}
			/>
		</React.Fragment>
	);
};

const FormSelectField = (props) => {
	return (
		<React.Fragment>
			<Field name={props.name}>
				{({ field }) => (
					<FormControl required disabled={props.disabled}>
						<InputLabel htmlFor={props.name}>{props.label}</InputLabel>
						<Select
							style={{ minWidth: props.width }}
							{...field}
							onChange={props.onChange}
							name={props.name}
							inputProps={{
								id: props.name,
							}}
						>
							{props.options.map((value, index) => (
								<MenuItem key={index} value={value.value}>
									{value.text}
								</MenuItem>
							))}
						</Select>
						{/* <FormHelperText /> */}
					</FormControl>
				)}
			</Field>
			<ErrorMessage
				name={props.name}
				render={(msg) => <span className={props.errorClass}>{msg}</span>}
			/>
		</React.Fragment>
	);
};

ConfigureVoteForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	pad: {
		padding: 15,
	},

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
	errorText: { color: 'red', fontSize: '13px' },

	stepperButtons: {
		marginLeft: '-15px',
	},
});
export default withStyles(styles)(ConfigureVoteForm);
