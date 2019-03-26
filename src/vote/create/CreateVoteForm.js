import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import _get from 'lodash/get';
import _omit from 'lodash/omit';
import _isEmpty from 'lodash/isEmpty';
import _flowRight from 'lodash/flowRight';
import _isNil from 'lodash/isNil';
import _isFinite from 'lodash/isFinite';
import PropTypes from 'prop-types';
import { Formik, Field, Form, FieldArray } from 'formik';
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
import { withFactomCli } from '../../context/FactomCliContext';
import * as moment from 'moment';

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
const minSupportPath = 'pollJSON.vote.config.winnerCriteria.minSupport';

// form specific fields
const commitStartDatePath = 'formFields.commitStartDate';
const commitEndDatePath = 'formFields.commitEndDate';
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
const requiredSupportPath = 'formFields.requiredSupport';
const workingWeightMinSupportPath = 'formFields.workingWeightMinSupport';
const workingUnweightMinSupportPath = 'formFields.workingUnweightMinSupport';
const workingMinSupportOptionPath = 'formFields.workingMinSupportOption';
const enableMinSupportConfigPath = 'formFields.enableMinSupportConfig';

class CreateVoteForm extends React.Component {
	async componentDidMount() {
		window.scrollTo(0, 0);
	}

	handleKeyPress(event) {
		if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
			event.preventDefault();
		}
	}

	validateWriteHeight = (currentHeight, writeHeight) => {
		let validate = true;

		if (isNaN(writeHeight)) {
			validate = false;
		}

		if (writeHeight < currentHeight) {
			validate = false;
		}

		return validate;
	};

	validateWorkingOption = (value, optionList) => {
		let error;

		if (this.hasOption(value, optionList)) {
			return 'Duplicate';
		}

		return error;
	};

	validateComputeResultsAgainst = (value) => {
		if (this.enableMinSupportConfig && !value) {
			return 'Required';
		}
	};

	hasOption = (option, optionList) =>
		optionList.findIndex((value) => value === option) !== -1;

	handleTime = (value, path) => {
		this.setFieldValue(path, this.calculateWriteHeight(value));
	};

	handleBlock = (value, path) => {
		if (
			this.validateWriteHeight(
				this.props.factomCliController.blockHeight,
				value
			)
		) {
			this.setFieldValue(path, this.calculateWriteTimeValue(value));
		} else {
			this.setFieldValue(path, '');
		}
	};

	removeOption = (
		option,
		index,
		workingMinSupportOption,
		arrayHelpers,
		optionsLength,
		minOptions,
		maxOptions,
		voteTypeText
	) => {
		arrayHelpers.remove(index);
		if (workingMinSupportOption === option) {
			this.setFieldValue(workingMinSupportOptionPath, '');
		}

		if (
			voteTypeText !== BINARY_CONFIG.name &&
			voteTypeText !== SINGLE_OPTION_CONFIG.name
		) {
			// reset min/max options if needed
			if (minOptions > optionsLength) {
				this.setFieldValue(minOptionsPath, '');
			}
			if (maxOptions > optionsLength) {
				this.setFieldValue(maxOptionsPath, '');
			}
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

	calculateWriteTimeValue = (writeHeight) => {
		let result = '';
		try {
			const eventTimestamp = this.props.factomCliController.getEstimatedBlockTimestamp(
				writeHeight
			);
			const eventDate = moment(eventTimestamp).utc();

			// //format for date field
			result = eventDate.toISOString().replace('Z', '');
		} catch (err) {
			console.log(err);
		}

		return result;
	};

	calculateWriteHeight = (dateTime) => {
		const currentBlock = this.props.factomCliController.blockHeight;

		const currentDate = moment
			.unix(this.props.factomCliController.blockTimestamp)
			.utc();

		const writeDate = moment(dateTime.concat('Z')).utc();

		const diffMins = writeDate.diff(currentDate, 'minutes');

		const diffBlocks = Math.floor(diffMins / 10);

		const result = currentBlock + diffBlocks;

		return result;
	};

	supportsMinSupportCriteria = (voteType) => {
		let result = true;

		if (voteType === INSTANT_RUNOFF_CONFIG.type) {
			result = false;
		}

		return result;
	};

	supportsWeightedMinTurnoutCriteria = (voteType) => {
		let result = true;

		if (voteType === INSTANT_RUNOFF_CONFIG.type) {
			result = false;
		}

		return result;
	};

	render() {
		const {
			pollForm,
			updatePoll,
			classes,
			usePollTestData,
			factomCliController: { blockHeight },
		} = this.props;

		return (
			<Formik
				enableReinitialize
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
									.transform((cv) => (isNaN(cv) ? undefined : cv))
									.required('Required')
									.moreThan(
										blockHeight + 2,
										'Must be at least 3 blocks greater than Current Height'
									),
								commitEnd: Yup.number()
									.transform((cv) => (isNaN(cv) ? undefined : cv))
									.required('Required')
									.moreThan(
										Yup.ref('commitStart'),
										'Must be greater than Commit Start Block'
									),
								revealEnd: Yup.number()
									.transform((cv) => (isNaN(cv) ? undefined : cv))
									.required('Required')
									.moreThan(
										Yup.ref('commitEnd'),
										'Must be greater than Commit End Block'
									),
							}),
							config: Yup.object().shape({
								options: Yup.array()
									.required('Required')
									.min(2, '* Select at least two options'),
								minOptions: Yup.number()
									.transform((cv) => (isNaN(cv) ? undefined : cv))
									.required('Required'),
								maxOptions: Yup.number()
									.transform((cv) => (isNaN(cv) ? undefined : cv))
									.required('Required'),
								allowAbstention: Yup.string().required('Required'),
							}),
						}),
					}),
					formFields: Yup.object().shape({
						enableMinSupportConfig: Yup.boolean(),
						workingWeightMinSupport: Yup.number()
							.transform((cv) => (isNaN(cv) ? undefined : cv))
							.max(1, 'Too high')
							.min(0, 'Too low'),
						workingUnweightMinSupport: Yup.number()
							.transform((cv) => (isNaN(cv) ? undefined : cv))
							.max(1, 'Too high')
							.min(0, 'Too low'),
						requiredSupport: Yup.mixed().test(
							'support-test',
							'* Select weighted and/or unweighted ratio',
							function(value) {
								const {
									workingWeightMinSupport,
									workingUnweightMinSupport,
									enableMinSupportConfig,
								} = this.parent;

								if (
									enableMinSupportConfig &&
									!_isFinite(workingWeightMinSupport) &&
									!_isFinite(workingUnweightMinSupport)
								) {
									return false;
								}

								return true;
							}
						),
						voteTypeText: Yup.string().required('Required'),
						questionSource: Yup.string(),
						workingText: Yup.string().when('questionSource', {
							is: 'text',
							then: Yup.string().required('Required'),
							otherwise: Yup.string().notRequired(),
						}),
						workingHref: Yup.string().when('questionSource', {
							is: 'href',
							then: Yup.string()
								.required('Required')
								.url('Must be a valid URL'),
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
						workingWeightMinTurnout: Yup.number()
							.transform((cv) => (isNaN(cv) ? undefined : cv))
							.max(1, 'Too high')
							.min(0, 'Too low'),
						workingUnweightMinTurnout: Yup.number()
							.transform((cv) => (isNaN(cv) ? undefined : cv))
							.max(1, 'Too high')
							.min(0, 'Too low'),
						checkedTurnout: Yup.boolean().test(
							'turnout-test',
							'* Select a Minimum Turnout ratio',
							function(value) {
								const {
									workingWeightMinTurnout,
									workingUnweightMinTurnout,
								} = this.parent;
								if (
									value &&
									!_isFinite(workingWeightMinTurnout) &&
									!_isFinite(workingUnweightMinTurnout)
								) {
									return false;
								}

								return true;
							}
						),
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
					 * Handle Acceptance Criteria
					 */
					if (_get(values, checkedTurnoutPath)) {
						// reset acceptance criteria
						_get(values, configPath).acceptanceCriteria = { minTurnout: {} };

						// handle weighted turnout
						if (_isFinite(_get(values, workingWeightMinTurnoutPath))) {
							_get(values, acceptanceCriteriaPath).minTurnout.weighted = _get(
								values,
								workingWeightMinTurnoutPath
							);
						}

						// handle unweighted turnout
						if (_isFinite(_get(values, workingUnweightMinTurnoutPath))) {
							_get(values, acceptanceCriteriaPath).minTurnout.unweighted = _get(
								values,
								workingUnweightMinTurnoutPath
							);
						}
					} else {
						// no acceptance criteria
						values = _omit(values, acceptanceCriteriaPath);
					}

					/**
					 * Handle Winner Criteria
					 */
					if (_get(values, enableMinSupportConfigPath)) {
						// reset winner Criteria
						_get(values, configPath).winnerCriteria = { minSupport: {} };

						let winnerCriteriaOption;
						if (_get(values, voteTypeTextPath) === BINARY_CONFIG.name) {
							// add criteria for specific option
							winnerCriteriaOption = _get(values, workingMinSupportOptionPath);
						} else {
							winnerCriteriaOption = '*';
						}
						_get(values, minSupportPath)[winnerCriteriaOption] = {};

						// handle weighted support
						if (_isFinite(_get(values, workingWeightMinSupportPath))) {
							_get(values, winnerCriteriaPath).minSupport[
								winnerCriteriaOption
							].weighted = _get(values, workingWeightMinSupportPath);
						}

						// handle unweighted support
						if (_isFinite(_get(values, workingUnweightMinSupportPath))) {
							_get(values, winnerCriteriaPath).minSupport[
								winnerCriteriaOption
							].unweighted = _get(values, workingUnweightMinSupportPath);
						}
					} else {
						// no winner criteria
						values = _omit(values, winnerCriteriaPath);
					}

					// placeholder until factom-vote.js is updated to fix computeResultsAgainst validation for IRV votes
					if (!_get(values, enableMinSupportConfigPath)) {
						_get(values, configPath).computeResultsAgainst =
							ALL_ELIGIBLE_VOTERS.value;
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
					submitCount,
					setFieldTouched,
					setFieldError,
				}) => {
					this.setFieldValue = setFieldValue;

					this.enableMinSupportConfig = _get(
						values,
						enableMinSupportConfigPath
					);

					return (
						<Form onKeyPress={this.handleKeyPress}>
							<Grid container className={classes.pad}>
								<Grid container item spacing={16} xs={12}>
									<Grid
										item
										container
										justify="space-between"
										alignItems="flex-end"
										xs={12}
									>
										<SectionHeader
											disableGutterBottom={true}
											text="Configure Poll"
											style={{ display: 'inline' }}
										/>
										<div>
											<Button
												onClick={usePollTestData}
												variant="contained"
												color="default"
												style={{ display: 'inline' }}
											>
												Use Test Data
											</Button>
										</div>
									</Grid>
									<Grid container item xs={5}>
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

													setFieldValue(workingMinSupportOptionPath, '');
													let voteType;

													if (newValue === BINARY_CONFIG.name) {
														voteType = BINARY_CONFIG.type;
														setFieldValue(voteTypePath, voteType);
														setFieldValue(
															minOptionsPath,
															BINARY_CONFIG.numOptions
														);
														setFieldValue(
															maxOptionsPath,
															BINARY_CONFIG.numOptions
														);
														// abstention not allowed
														setFieldValue(abstentionPath, false);

														// max two options allowed
														if (_get(values, optionsPath).length > 2) {
															setFieldValue(optionsPath, []);
														}
													} else if (newValue === SINGLE_OPTION_CONFIG.name) {
														voteType = SINGLE_OPTION_CONFIG.type;
														setFieldValue(voteTypePath, voteType);
														setFieldValue(
															minOptionsPath,
															SINGLE_OPTION_CONFIG.numOptions
														);
														setFieldValue(
															maxOptionsPath,
															SINGLE_OPTION_CONFIG.numOptions
														);
													} else if (newValue === APPROVAL_CONFIG.name) {
														voteType = APPROVAL_CONFIG.type;
														setFieldValue(voteTypePath, voteType);
														setFieldValue(minOptionsPath, '');
														setFieldValue(maxOptionsPath, '');
													} else if (newValue === INSTANT_RUNOFF_CONFIG.name) {
														voteType = INSTANT_RUNOFF_CONFIG.type;
														setFieldValue(voteTypePath, voteType);
														setFieldValue(minOptionsPath, '');
														setFieldValue(maxOptionsPath, '');
														setFieldValue(workingWeightMinTurnoutPath, '');
													}

													// reset minSupport form fields
													if (!this.supportsMinSupportCriteria(voteType)) {
														setFieldValue(enableMinSupportConfigPath, false);

														// remove compute results against
														setFieldValue(computeResultsAgainstPath, '');

														// remove weight/unweight min support form values
														setFieldValue(workingWeightMinSupportPath, '');
														setFieldValue(workingUnweightMinSupportPath, '');

														// remove min support option form value
														setFieldValue(workingMinSupportOptionPath, '');
													} else {
														setFieldValue(enableMinSupportConfigPath, true);
													}
												}}
											/>
										</Grid>
										<Grid item xs={12}>
											<FormSelectField
												name={abstentionPath}
												label="Allow Abstention *"
												isNotFast
												options={ABSTENTION_VALUES}
												error={
													_get(errors, abstentionPath) &&
													_get(touched, abstentionPath)
												}
												disabled={
													_get(values, voteTypePath) === BINARY_CONFIG.type
												}
												minWidth={215}
											/>
										</Grid>
										<Grid item xs={12}>
											{_get(values, enableMinSupportConfigPath) && (
												<FormSelectField
													name={computeResultsAgainstPath}
													validate={this.validateComputeResultsAgainst}
													label="Compute Results Against *"
													options={COMPUTE_AGAINST_VALUES}
													error={
														_get(errors, computeResultsAgainstPath) &&
														_get(touched, computeResultsAgainstPath)
													}
													minWidth={215}
												/>
											)}
										</Grid>
									</Grid>

									<Grid container item xs={7}>
										<Grid item xs={6}>
											<div className={classes.blockFields}>
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
														this.handleBlock(
															e.target.value,
															commitStartDatePath
														);
													}}
												/>
											</div>
										</Grid>
										<Grid item xs={6}>
											<FormTextField
												name={commitStartDatePath}
												label="Estimated Date (UTC)"
												type="datetime-local"
												shrink={true}
												isNotFast
												width={220}
												onChange={(e) => {
													handleChange(e);
													this.handleTime(e.target.value, commitStartPath);
													setFieldTouched(commitStartPath, true);
												}}
											/>
										</Grid>
										<Grid item xs={6}>
											<div className={classes.blockFields}>
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
														this.handleBlock(e.target.value, commitEndDatePath);
													}}
												/>
											</div>
										</Grid>
										<Grid item xs={6}>
											<FormTextField
												name={commitEndDatePath}
												label="Estimated Date (UTC)"
												type="datetime-local"
												shrink={true}
												isNotFast
												width={220}
												onChange={(e) => {
													handleChange(e);
													this.handleTime(e.target.value, commitEndPath);
													setFieldTouched(commitEndPath, true);
												}}
											/>
										</Grid>
										<Grid item xs={6}>
											<div className={classes.blockFields}>
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
														this.handleBlock(e.target.value, revealEndDatePath);
													}}
												/>
											</div>
										</Grid>
										<Grid item xs={6}>
											<FormTextField
												name={revealEndDatePath}
												label="Estimated Date (UTC)"
												type="datetime-local"
												shrink={true}
												isNotFast
												width={220}
												onChange={(e) => {
													handleChange(e);
													this.handleTime(e.target.value, revealEndPath);
													setFieldTouched(revealEndPath, true);
												}}
											/>
										</Grid>
										<Grid item xs={12}>
											<div style={{ height: '48px' }} />
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
										{submitCount > 0 && (
											<Field
												name={optionsPath}
												render={({ form }) => {
													const error = _get(form.errors, optionsPath);
													return error ? (
														<div className={classes.errorText}>{error}</div>
													) : null;
												}}
											/>
										)}
									</Grid>
									<Grid item xs={12}>
										<Paper elevation={2} className={classes.pad}>
											<Grid container spacing={24}>
												<Grid item xs={6}>
													<List className={classes.optionList} dense>
														<FieldArray
															name={optionsPath}
															render={(arrayHelpers) => (
																<Grid container>
																	<Grid item xs={9}>
																		<FormTextField
																			name={workingOptionPath}
																			validate={(value) => {
																				return this.validateWorkingOption(
																					value,
																					_get(values, optionsPath)
																				);
																			}}
																			width="250px"
																			isNotFast
																			label="Option *"
																			disabled={
																				_get(values, optionsPath).length ===
																					2 &&
																				_get(values, voteTypePath) ===
																					BINARY_CONFIG.type
																			}
																			error={
																				_get(errors, workingOptionPath) &&
																				_get(touched, workingOptionPath)
																			}
																			onKeyPress={(e) => {
																				if (
																					e.which === 13 /* Enter */ &&
																					e.target.value.trim() &&
																					_isNil(
																						this.validateWorkingOption(
																							e.target.value,
																							_get(values, optionsPath)
																						)
																					)
																				) {
																					arrayHelpers.push(
																						_get(values, workingOptionPath)
																					);
																					// reset input
																					setFieldValue(workingOptionPath, '');
																				}
																			}}
																		/>
																	</Grid>
																	<Grid item xs={3}>
																		<Button
																			variant="contained"
																			component="span"
																			onClick={() => {
																				if (
																					_isNil(
																						this.validateWorkingOption(
																							_get(values, workingOptionPath),
																							_get(values, optionsPath)
																						)
																					)
																				) {
																					arrayHelpers.push(
																						_get(values, workingOptionPath)
																					);
																					// reset input
																					setFieldValue(workingOptionPath, '');
																				}
																			}}
																			disabled={
																				!_get(values, workingOptionPath)
																			}
																		>
																			Add
																		</Button>
																	</Grid>

																	<Grid item xs={12}>
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
																										_get(values, optionsPath)
																											.length - 1,
																										_get(
																											values,
																											minOptionsPath
																										),
																										_get(
																											values,
																											maxOptionsPath
																										),
																										_get(
																											values,
																											voteTypeTextPath
																										)
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
																	</Grid>
																</Grid>
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
										{_get(values, enableMinSupportConfigPath) ? (
											<Grid container>
												<Grid item xs={4}>
													<br />
													<Typography>Minimum Support *</Typography>
													{submitCount > 0 &&
														_get(errors, requiredSupportPath) && (
															<div className={classes.errorText}>
																{_get(errors, requiredSupportPath)}
															</div>
														)}
												</Grid>
												<Grid item xs={4}>
													<FormTextField
														name={workingWeightMinSupportPath}
														label="Weighted Ratio"
														type="number"
														step="any"
														error={
															_get(errors, workingWeightMinSupportPath) &&
															_get(touched, workingWeightMinSupportPath)
														}
														width={138}
													/>

													<br />
													<FormTextField
														name={workingUnweightMinSupportPath}
														label="Unweighted Ratio"
														type="number"
														step="any"
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
										) : (
											<Grid item>
												<Typography>Not Applicable</Typography>
											</Grid>
										)}
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
											<Field
												name={checkedTurnoutPath}
												render={({ field }) => (
													<FormControlLabel
														control={
															<Checkbox
																name={checkedTurnoutPath}
																checked={field.value}
																onChange={(e) => {
																	const newValue = !_get(
																		values,
																		checkedTurnoutPath
																	);
																	setFieldValue(checkedTurnoutPath, newValue);

																	if (!newValue) {
																		// reset turnout acceptance criteria
																		setFieldValue(
																			workingWeightMinTurnoutPath,
																			''
																		);
																		setFieldValue(
																			workingUnweightMinTurnoutPath,
																			''
																		);
																		setFieldError(checkedTurnoutPath, null);
																		setFieldError(
																			workingWeightMinTurnoutPath,
																			null
																		);
																		setFieldError(
																			workingUnweightMinTurnoutPath,
																			null
																		);
																	}
																}}
																color="default"
															/>
														}
														label={
															'Minimum Turnout' +
															(_get(values, checkedTurnoutPath) ? ' *' : '')
														}
													/>
												)}
											/>
											{submitCount > 0 && _get(errors, checkedTurnoutPath) && (
												<div className={classes.errorText}>
													{_get(errors, checkedTurnoutPath)}
												</div>
											)}
										</Grid>
										<Grid item xs={4}>
											{this.supportsWeightedMinTurnoutCriteria(
												_get(values, voteTypePath)
											) && (
												<FormTextField
													name={workingWeightMinTurnoutPath}
													label={'Weighted Ratio'}
													disabled={!_get(values, checkedTurnoutPath)}
													type="number"
													step="any"
													error={
														_get(errors, workingWeightMinTurnoutPath) &&
														_get(touched, workingWeightMinTurnoutPath)
													}
													isNotFast
													width={138}
												/>
											)}

											<br />
											<FormTextField
												name={workingUnweightMinTurnoutPath}
												label={'Unweighted Ratio'}
												disabled={!_get(values, checkedTurnoutPath)}
												type="number"
												step="any"
												error={
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
					);
				}}
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
		wordWrap: 'break-word',
	},
	stepperButtons: {
		marginLeft: '-15px',
	},
	errorText: {
		color: 'red',
		fontSize: '16px',
		borderColor: 'red',
		borderStyle: 'solid',
		padding: 8,
		width: 200,
	},
	blockFields: {
		marginLeft: '22px',
	},
});

const enhancer = _flowRight(withNetwork, withFactomCli, withStyles(styles));
export default enhancer(CreateVoteForm);
