import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import _get from 'lodash/get';
import _omit from 'lodash/omit';
import _isEmpty from 'lodash/isEmpty';
import _flowRight from 'lodash/flowRight';
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
import SectionHeader from '../shared/SectionHeader';
import FormTextField from '../../component/form/FormTextField';
import FormSelectField from '../../component/form/FormSelectField';
import { withNetwork } from '../../context/NetworkContext';
//import FormHelperText from '@material-ui/core/FormHelperText';

import {
	BINARY_CONFIG,
	SINGLE_OPTION_CONFIG,
	APPROVAL_CONFIG,
	INSTANT_RUNOFF_CONFIG,
	ALL_ELIGIBLE_VOTERS,
	PARTICIPANTS_ONLY,
	HASH_ALGO_VALUES,
} from './VOTE_CONSTANTS';

/**
 * Constants
 */
const VOTE_TYPE_VALUES = [
	{ value: BINARY_CONFIG.name, text: BINARY_CONFIG.name },
	{ value: SINGLE_OPTION_CONFIG.name, text: SINGLE_OPTION_CONFIG.name },
	{ value: APPROVAL_CONFIG.name, text: APPROVAL_CONFIG.name },
	{ value: INSTANT_RUNOFF_CONFIG.name, text: INSTANT_RUNOFF_CONFIG.name },
];

const COMPUTE_AGAINST_VALUES = [
	{ value: ALL_ELIGIBLE_VOTERS.value, text: ALL_ELIGIBLE_VOTERS.text },
	{ value: PARTICIPANTS_ONLY.value, text: PARTICIPANTS_ONLY.text },
];

const ABSTENTION_VALUES = [
	{ value: true, text: 'True' },
	{ value: false, text: 'False' },
];

const TITLE_MAX_LENGTH = 32;
const QUESTION_MAX_LENGTH = 250;

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
const winnerCriteriaPath = 'pollJSON.vote.config.winnerCriteria';
//const minSupportPath = 'pollJSON.vote.config.winnerCriteria.minSupport';

// form specific fields
const commitStartDatePath = 'formFields.commitStartDate';
const commitEndDatePath = 'formFields.commitEndDate';
const revealStartDatePath = 'formFields.revealStartDate';
const revealEndDatePath = 'formFields.revealEndDate';
const voteTypeTextPath = 'formFields.voteTypeText';
const questionSourcePath = 'formFields.questionSource';
const workingOptionPath = 'formFields.workingOption';
const workingHrefPath = 'formFields.workingHref';
const workingHashValuePath = 'formFields.workingHashValue';
const workingHashAlgoPath = 'formFields.workingHashAlgo';
const workingTextPath = 'formFields.workingText';
const checkedTurnoutPath = 'formFields.checkedTurnout';
const workingWeightMinTurnoutPath = 'formFields.workingWeightMinTurnout';
const workingUnweightMinTurnoutPath = 'formFields.workingUnweightMinTurnout';
const workingWeightMinSupportPath = 'formFields.workingWeightMinSupport';
const workingUnweightMinSupportPath = 'formFields.workingUnweightMinSupport';
const workingMinSupportOptionPath = 'formFields.workingMinSupportOption';

class CreateVoteForm extends React.Component {
	state = { currentHeight: null };

	async componentDidMount() {
		window.scrollTo(0, 0);

		const tfaURL = this.props.networkController.networkProps.explorerApiURL;

		fetch(tfaURL + '/top')
			.then((response) => response.json())
			.then((data) => this.setState({ currentHeight: data.result.top }));
	}

	handleKeyPress(event) {
		if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
			event.preventDefault();
		}
	}

	validateWriteHeight = (currentHeight, writeHeight) => {
		let validate = true;
		isNaN(writeHeight) ? (validate = false) : (validate = true);
		if (validate) {
			writeHeight <= currentHeight ? (validate = false) : (validate = true);
		}

		return validate;
	};

	handleBlockTime = (value, path, setFieldValue) => {
		if (this.validateWriteHeight(this.state.currentHeight, value)) {
			setFieldValue(path, calculateWriteTime(this.state.currentHeight, value));
		} else {
			setFieldValue(path, '');
		}
	};

	removeOption = (
		option,
		index,
		workingMinSupportOption,
		arrayHelpers,
		setFieldValue,
		optionsLength,
		minOptions,
		maxOptions
	) => {
		arrayHelpers.remove(index);
		if (workingMinSupportOption === option) {
			setFieldValue(workingMinSupportOptionPath, '');
		}

		// reset min/max options
		if (minOptions > optionsLength) {
			setFieldValue(minOptionsPath, '');
		}
		if (maxOptions > optionsLength) {
			setFieldValue(maxOptionsPath, '');
		}
	};

	getMinimumOptions = (optionsList) => {
		let minOptionsList = [];

		for (let ii = 1; ii <= optionsList.length; ii++) {
			minOptionsList.push({ value: ii, text: ii });
		}

		return minOptionsList;
	};

	getMaximumOptions = (optionsList, minOptionLength = 1) => {
		let maxOptionsList = [];

		for (let ii = minOptionLength; ii <= optionsList.length; ii++) {
			maxOptionsList.push({ value: ii, text: ii });
		}

		return maxOptionsList;
	};

	render() {
		const { pollForm, updatePoll, classes } = this.props;

		return (
			<Formik
				initialValues={pollForm}
				validateOnChange={false}
				validationSchema={Yup.object().shape({
					pollJSON: Yup.object().shape({
						proposal: Yup.object().shape({
							title: Yup.string().required('Required'),
						}),
						vote: Yup.object().shape({
							phasesBlockHeights: Yup.object().shape({
								commitStart: Yup.number()
									.transform((currentValue, originalValue) => {
										return originalValue === '' ? undefined : currentValue;
									})
									.required('Required')
									.moreThan(
										this.state.currentHeight,
										'Must be greater Current Height'
									),
								commitEnd: Yup.number()
									.transform((currentValue, originalValue) => {
										return originalValue === '' ? undefined : currentValue;
									})
									.required('Required')
									.moreThan(
										Yup.ref('commitStart'),
										'Must be greater than Commit Start Block'
									),
								revealStart: Yup.number()
									.transform((currentValue, originalValue) => {
										return originalValue === '' ? undefined : currentValue;
									})
									.required('Required')
									.moreThan(
										Yup.ref('commitEnd'),
										'Must be greater than Commit End Block'
									),
								revealEnd: Yup.number()
									.transform((currentValue, originalValue) => {
										return originalValue === '' ? undefined : currentValue;
									})
									.required('Required')
									.moreThan(
										Yup.ref('revealStart'),
										'Must be greater than Reveal Start Block'
									),
							}),

							config: Yup.object().shape({
								options: Yup.array()
									.required('Required')
									.min(2, 'Select at least two options'),
								minOptions: Yup.number()
									.transform((cv) => (isNaN(cv) ? undefined : cv))
									.required('Required'),
								maxOptions: Yup.number()
									.transform((cv) => (isNaN(cv) ? undefined : cv))
									.required('Required'),
								allowAbstention: Yup.string().required('Required'),
								computeResultsAgainst: Yup.string().required('Required'),
							}),
						}),
					}),
					formFields: Yup.object().shape({
						workingWeightMinSupport: Yup.number()
							.transform((cv) => (isNaN(cv) ? undefined : cv))
							.required('Required')
							.max(1, 'Too high')
							.min(0, 'Too low'),
						workingUnweightMinSupport: Yup.number()
							.transform((cv) => (isNaN(cv) ? undefined : cv))
							.required('Required')
							.max(1, 'Too high')
							.min(0, 'Too low'),
						voteTypeText: Yup.string().required('Required'),
						questionSource: Yup.string(),
						workingText: Yup.string().when('questionSource', {
							is: 'text',
							then: Yup.string().required('Required'),
							otherwise: Yup.string().notRequired(),
						}),
						workingHref: Yup.string().when('questionSource', {
							is: 'href',
							then: Yup.string().required('Required'),
							otherwise: Yup.string().notRequired(),
						}),
						workingHashValue: Yup.string().when('questionSource', {
							is: 'href',
							then: Yup.string().required('Required'),
							otherwise: Yup.string().notRequired(),
						}),
						workingHashAlgo: Yup.string().when('questionSource', {
							is: 'href',
							then: Yup.string().required('Required'),
							otherwise: Yup.string().notRequired(),
						}),
						workingMinSupportOption: Yup.string().when('voteTypeText', {
							is: BINARY_CONFIG.name,
							then: Yup.string().required('Required'),
							otherwise: Yup.string().notRequired(),
						}),
						checkedTurnout: Yup.boolean(),
						workingWeightMinTurnout: Yup.number().when('checkedTurnout', {
							is: true,
							then: Yup.number()
								.transform((cv) => (isNaN(cv) ? undefined : cv))
								.required('Required')
								.max(1, 'Too high')
								.min(0, 'Too low'),
							otherwise: Yup.number()
								.transform((cv) => (isNaN(cv) ? undefined : cv))
								.notRequired(),
						}),
						workingUnweightMinTurnout: Yup.number().when('checkedTurnout', {
							is: true,
							then: Yup.number()
								.transform((cv) => (isNaN(cv) ? undefined : cv))
								.required('Required')
								.max(1, 'Too high')
								.min(0, 'Too low'),
							otherwise: Yup.number()
								.transform((cv) => (isNaN(cv) ? undefined : cv))
								.notRequired(),
						}),
					}),
				})}
				onSubmit={(values, actions) => {
					/**
					 * Handle text vs externalRef
					 */
					if (_get(values, questionSourcePath) === 'text') {
						// delete href
						values = _omit(values, externalRefPath);

						// add text config
						_get(values, proposalPath).text = _get(values, workingTextPath);
					} else {
						// delete text
						values = _omit(values, textPath);

						// add externalRef config
						_get(values, proposalPath).externalRef = {
							href: _get(values, workingHrefPath),
							hash: {
								value: _get(values, workingHashValuePath),
								algo: _get(values, workingHashAlgoPath),
							},
						};
					}
					/**
					 * Handle Acceptance Citeria
					 */
					if (_get(values, checkedTurnoutPath)) {
						// reset acceptance criteria
						_get(values, configPath).acceptanceCriteria = {};

						// set acceptance criteria
						_get(values, acceptanceCriteriaPath).minTurnout = {
							weighted: _get(values, workingWeightMinTurnoutPath),
							unweighted: _get(values, workingUnweightMinTurnoutPath),
						};
					} else {
						// no acceptance criteria
						values = _omit(values, acceptanceCriteriaPath);
					}

					/**
					 * Handle Winner Citeria
					 */

					// reset winnerCriteria
					_get(values, configPath).winnerCriteria = { minSupport: {} };

					if (_get(values, voteTypeTextPath) === BINARY_CONFIG.name) {
						// add criteria for specific option
						_get(values, winnerCriteriaPath).minSupport = {
							[_get(values, workingMinSupportOptionPath)]: {
								weighted: _get(values, workingWeightMinSupportPath),
								unweighted: _get(values, workingUnweightMinSupportPath),
							},
						};
					} else {
						// apply criteria to all options
						_get(values, winnerCriteriaPath).minSupport = { '*': {} };
						_get(values, winnerCriteriaPath).minSupport['*'] = {
							weighted: _get(values, workingWeightMinSupportPath),
							unweighted: _get(values, workingUnweightMinSupportPath),
						};
					}

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
				}) => (
					<Form onKeyPress={this.handleKeyPress}>
						<Grid container className={classes.pad}>
							<Grid container item xs={12}>
								<Grid item xs={9}>
									<SectionHeader
										disableGutterBottom={true}
										text="Configure Poll"
									/>
								</Grid>
								<Grid item xs={3}>
									<Typography>
										<b>Current Height:</b> {this.state.currentHeight}
									</Typography>
								</Grid>
								<Grid container spacing={8} item xs={5}>
									<Grid item xs={12}>
										<FormTextField
											name={titlePath}
											label="Title *"
											error={
												_get(errors, titlePath) && _get(touched, titlePath)
											}
											fullWidth
											spellCheck
											maxLength={TITLE_MAX_LENGTH}
										/>
									</Grid>
									<Grid item xs={12}>
										<FormSelectField
											name={voteTypeTextPath}
											label="Vote Type *"
											options={VOTE_TYPE_VALUES}
											error={
												_get(errors, voteTypeTextPath) &&
												_get(touched, voteTypeTextPath)
											}
											minWidth={215}
											onChange={(e) => {
												//update question type
												handleChange(e);

												//update dependent fields
												const newValue = e.target.value;

												//setFieldValue(optionsPath, []);
												setFieldValue(workingMinSupportOptionPath, '');

												if (newValue === BINARY_CONFIG.name) {
													setFieldValue(voteTypePath, BINARY_CONFIG.type);
													setFieldValue(
														minOptionsPath,
														BINARY_CONFIG.numOptions
													);
													setFieldValue(
														maxOptionsPath,
														BINARY_CONFIG.numOptions
													);
												} else if (newValue === SINGLE_OPTION_CONFIG.name) {
													setFieldValue(
														voteTypePath,
														SINGLE_OPTION_CONFIG.type
													);
													setFieldValue(
														minOptionsPath,
														SINGLE_OPTION_CONFIG.numOptions
													);
													setFieldValue(
														maxOptionsPath,
														SINGLE_OPTION_CONFIG.numOptions
													);
												} else if (newValue === APPROVAL_CONFIG.name) {
													setFieldValue(voteTypePath, APPROVAL_CONFIG.type);
													setFieldValue(minOptionsPath, '');
													setFieldValue(maxOptionsPath, '');
												} else if (newValue === INSTANT_RUNOFF_CONFIG.name) {
													setFieldValue(
														voteTypePath,
														INSTANT_RUNOFF_CONFIG.type
													);
													setFieldValue(minOptionsPath, '');
													setFieldValue(maxOptionsPath, '');
												}
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<FormSelectField
											name={computeResultsAgainstPath}
											label="Compute Results Against *"
											options={COMPUTE_AGAINST_VALUES}
											error={
												_get(errors, computeResultsAgainstPath) &&
												_get(touched, computeResultsAgainstPath)
											}
											minWidth={215}
										/>
									</Grid>
									<Grid item xs={12}>
										<FormSelectField
											name={abstentionPath}
											label="Allow Abstention *"
											options={ABSTENTION_VALUES}
											error={
												_get(errors, abstentionPath) &&
												_get(touched, abstentionPath)
											}
											minWidth={215}
										/>
									</Grid>
								</Grid>
								<Grid item xs={1} />
								<Grid container item xs={3}>
									<Grid item xs={12}>
										<FormTextField
											name={commitStartPath}
											label="Commit Start Block *"
											type="number"
											error={
												_get(errors, commitStartPath) &&
												_get(touched, commitStartPath)
											}
											onChange={(e) => {
												handleChange(e);
												this.handleBlockTime(
													e.target.value,
													commitStartDatePath,
													setFieldValue
												);
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<FormTextField
											name={commitEndPath}
											label="Commit End Block *"
											type="number"
											error={
												_get(errors, commitEndPath) &&
												_get(touched, commitEndPath)
											}
											onChange={(e) => {
												handleChange(e);
												this.handleBlockTime(
													e.target.value,
													commitEndDatePath,
													setFieldValue
												);
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<FormTextField
											name={revealStartPath}
											label="Reveal Start Block *"
											type="number"
											error={
												_get(errors, revealStartPath) &&
												_get(touched, revealStartPath)
											}
											onChange={(e) => {
												handleChange(e);
												this.handleBlockTime(
													e.target.value,
													revealStartDatePath,
													setFieldValue
												);
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<FormTextField
											name={revealEndPath}
											label="Reveal End Block *"
											type="number"
											error={
												_get(errors, revealEndPath) &&
												_get(touched, revealEndPath)
											}
											onChange={(e) => {
												handleChange(e);
												this.handleBlockTime(
													e.target.value,
													revealEndDatePath,
													setFieldValue
												);
											}}
										/>
									</Grid>
								</Grid>
								<Grid container item xs={3}>
									<Grid item xs={12}>
										<br />
										<Typography>{_get(values, commitStartDatePath)}</Typography>
									</Grid>
									<Grid item xs={12}>
										<br />
										<Typography>{_get(values, commitEndDatePath)}</Typography>
									</Grid>
									<Grid item xs={12}>
										<br />
										<Typography>{_get(values, revealStartDatePath)}</Typography>
									</Grid>
									<Grid item xs={12}>
										<br />
										<Typography>{_get(values, revealEndDatePath)}</Typography>
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
													setFieldValue(workingHashValuePath, '');
													setFieldValue(workingHashAlgoPath, '');
												} else {
													setFieldValue(workingTextPath, '');
												}
											}}
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
											name={workingTextPath}
											label="Question *"
											error={
												_get(errors, workingTextPath) &&
												_get(touched, workingTextPath)
											}
											fullWidth
											multiline
											spellCheck
											maxLength={QUESTION_MAX_LENGTH}
										/>
									</Grid>
								)}

								{_get(values, questionSourcePath) === 'href' && (
									<Grid item xs={9} container>
										<Grid item xs={12}>
											<FormTextField
												name={workingHrefPath}
												label="URL Link *"
												error={
													_get(errors, workingHrefPath) &&
													_get(touched, workingHrefPath)
												}
												fullWidth
											/>
										</Grid>
										<Grid item xs={12}>
											<FormSelectField
												name={workingHashAlgoPath}
												label="Hash Algorithm *"
												options={HASH_ALGO_VALUES}
												error={
													_get(errors, workingHashAlgoPath) &&
													_get(touched, workingHashAlgoPath)
												}
												minWidth={182}
											/>
										</Grid>
										<Grid item xs={12}>
											<FormTextField
												name={workingHashValuePath}
												label="Hash Value *"
												error={
													_get(errors, workingHashValuePath) &&
													_get(touched, workingHashValuePath)
												}
											/>
										</Grid>
									</Grid>
								)}
							</Grid>
							<Grid container spacing={8} item xs={12}>
								<Grid item xs={12}>
									<SectionHeader disableGutterBottom={true} text="Answers" />
								</Grid>
								<Grid item xs={12}>
									<Paper elevation={2} className={classes.pad}>
										<Grid container spacing={24}>
											<Grid item xs={6}>
												<List className={classes.optionList} dense>
													<FieldArray
														name={optionsPath}
														render={(arrayHelpers) => (
															<>
																<FormTextField
																	name={workingOptionPath}
																	width="275px"
																	isNotFast
																	label="Option *"
																	error={
																		_get(touched, workingOptionPath) &&
																		typeof _get(errors, optionsPath) ===
																			'string'
																	}
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
																<Button
																	variant="contained"
																	component="span"
																	onClick={() => {
																		arrayHelpers.push(
																			_get(values, workingOptionPath)
																		);
																		// reset input
																		setFieldValue(workingOptionPath, '');
																	}}
																	disabled={!_get(values, workingOptionPath)}
																>
																	Add
																</Button>
																<Field
																	name={optionsPath}
																	render={({ form }) => {
																		const error = _get(
																			form.errors,
																			optionsPath
																		);
																		const touch = _get(
																			form.touched,
																			workingOptionPath
																		);
																		return touch && error ? (
																			<div className={classes.errorText}>
																				{error}
																			</div>
																		) : null;
																	}}
																/>

																{_get(values, optionsPath).length > 0
																	? _get(values, optionsPath).map(
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
																							this.removeOption(
																								option,
																								index,
																								_get(
																									values,
																									workingMinSupportOptionPath
																								),
																								arrayHelpers,
																								setFieldValue,
																								_get(values, optionsPath)
																									.length - 1,
																								_get(values, minOptionsPath),
																								_get(values, maxOptionsPath)
																							)
																						}
																						aria-label="Clear"
																					>
																						<Clear />
																					</IconButton>
																				</ListItem>
																			)
																	  )
																	: ''}
															</>
														)}
													/>
												</List>
											</Grid>
											<Grid item xs={6}>
												{/**
												 * Minimum Options
												 * Maximum Options
												 */}
												{(_get(values, voteTypeTextPath) ===
													APPROVAL_CONFIG.name ||
													_get(values, voteTypeTextPath) ===
														INSTANT_RUNOFF_CONFIG.name) && (
													<Grid container spacing={8} item xs={12}>
														<Grid item xs={12}>
															<FormSelectField
																name={minOptionsPath}
																label="Minimum Options Allowed *"
																type="number"
																isNotFast
																error={
																	_get(errors, minOptionsPath) &&
																	_get(touched, minOptionsPath)
																}
																width={215}
																options={this.getMinimumOptions(
																	_get(values, optionsPath)
																)}
																minWidth="240px"
															/>
														</Grid>
														<Grid item xs={12}>
															<FormSelectField
																name={maxOptionsPath}
																label="Maximum Options Allowed *"
																type="number"
																isNotFast
																error={
																	_get(errors, maxOptionsPath) &&
																	_get(touched, maxOptionsPath)
																}
																width={215}
																options={this.getMaximumOptions(
																	_get(values, optionsPath),
																	_get(values, minOptionsPath)
																)}
																minWidth="240px"
															/>
														</Grid>
													</Grid>
												)}
											</Grid>
										</Grid>
									</Paper>
								</Grid>
							</Grid>
							<Grid item container xs={12}>
								<Grid item xs={12}>
									<br />
									<br />
									<SectionHeader text="Winner Criteria" />
								</Grid>
								<Grid item xs={12}>
									<Grid container>
										<Grid item xs={4}>
											<br />
											<Typography>Minimum Support *</Typography>
										</Grid>
										<Grid item xs={4}>
											<FormTextField
												name={workingWeightMinSupportPath}
												label="Weighted Ratio *"
												type="number"
												error={
													_get(errors, workingWeightMinSupportPath) &&
													_get(touched, workingWeightMinSupportPath)
												}
												width={138}
											/>

											<br />
											<FormTextField
												name={workingUnweightMinSupportPath}
												label="Unweighted Ratio *"
												type="number"
												error={
													_get(errors, workingUnweightMinSupportPath) &&
													_get(touched, workingUnweightMinSupportPath)
												}
												width={138}
											/>
										</Grid>
										<Grid item xs={4}>
											{_get(values, voteTypePath) !== '' ? (
												// vote type is selected
												_get(values, voteTypeTextPath) ===
												BINARY_CONFIG.name ? (
													// binary vote selected
													!_isEmpty(_get(values, optionsPath)) ? (
														// options exist
														<FormSelectField
															name={workingMinSupportOptionPath}
															label="Applies to option *"
															options={_get(values, optionsPath).map(
																(value) => {
																	return { value, text: value };
																}
															)}
															error={
																_get(errors, workingMinSupportOptionPath) &&
																_get(touched, workingMinSupportOptionPath)
															}
															minWidth={215}
															isNotFast
														/>
													) : (
														<>
															<br />
															No Options Found
														</>
													)
												) : (
													<>
														<br />
														Applies to all options
													</>
												)
											) : (
												<>
													<br />
													Select a Vote Type
												</>
											)}
										</Grid>
									</Grid>
								</Grid>
							</Grid>
							<Grid container item xs={12}>
								<Grid item xs={12}>
									<br />
									<SectionHeader
										disableGutterBottom={true}
										text="Acceptance Criteria"
									/>
								</Grid>
								<Grid container item xs={12}>
									<Grid item xs={4}>
										<br />
										<FastField
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
										<FormTextField
											name={workingWeightMinTurnoutPath}
											label={
												'Weighted Ratio' +
												(_get(values, checkedTurnoutPath) ? ' *' : '')
											}
											disabled={!_get(values, checkedTurnoutPath)}
											type="number"
											displayError={_get(values, checkedTurnoutPath)}
											error={
												_get(values, checkedTurnoutPath) &&
												_get(errors, workingWeightMinTurnoutPath) &&
												_get(touched, workingWeightMinTurnoutPath)
											}
											isNotFast
											width={138}
										/>

										<br />
										<FormTextField
											name={workingUnweightMinTurnoutPath}
											label={
												'Unweighted Ratio' +
												(_get(values, checkedTurnoutPath) ? ' *' : '')
											}
											disabled={!_get(values, checkedTurnoutPath)}
											type="number"
											displayError={_get(values, checkedTurnoutPath)}
											error={
												_get(values, checkedTurnoutPath) &&
												_get(errors, workingUnweightMinTurnoutPath) &&
												_get(touched, workingUnweightMinTurnoutPath)
											}
											isNotFast
											width={138}
										/>
									</Grid>
									<Grid
										style={{
											color: !_get(values, checkedTurnoutPath) ? 'gray' : '',
										}}
										item
										xs={4}
									>
										<br />
										Applies to all eligible voters.
									</Grid>
								</Grid>
							</Grid>
							{/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
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
CreateVoteForm.propTypes = {
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
		overflow: 'auto',
	},
	optionListItem: {
		padding: '0px',
	},
	stepperButtons: {
		marginLeft: '-15px',
	},
	errorText: { color: 'red', fontSize: '13px' },
});

function calculateWriteTime(currentHeight, writeHeight) {
	let blocks;
	let minutes;
	let event = new Date();

	blocks = writeHeight - currentHeight;
	minutes = blocks * 10;
	event.setTime(event.getTime() + minutes * 60 * 1000);
	event = event.toLocaleTimeString([], {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	});

	return event;
}

const enhancer = _flowRight(withNetwork, withStyles(styles));
export default enhancer(CreateVoteForm);
