import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
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

class ConfigureVoteForm extends React.Component {
	state = {
		checkedTurnout: false,
		checkedSupport: false,
		questionType: 'a',
		voteType: '',
		options: [],
	};

	componentDidMount() {
		window.scrollTo(0, 0);
	}

	toggleCheckbox = (name) => (event) => {
		this.setState({ [name]: event.target.checked });
	};

	handleChange = (name) => (event) => {
		this.setState({ [name]: event.target.value });
	};

	addOption = () => {
		this.setState((prevState) => ({
			options: prevState.options.concat('Poll Option'),
		}));
	};

	removeOption = () => {
		this.setState((prevState) => ({
			options: prevState.options.slice(0, prevState.options.length - 1),
		}));
	};

	handleKeyPress(event) {
		if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
			event.preventDefault();
		}
	}

	render() {
		const { poll, updatePoll, classes } = this.props;

		const options =
			this.state.options.length > 0 ? (
				this.state.options.map((option, index) => (
					<ListItem
						key={index}
						disableGutters
						divider
						className={classes.optionListItem}
					>
						<LabelImportant style={{ fontSize: 15 }} />
						<ListItemText primary={option} />
						<IconButton onClick={this.removeOption} aria-label="Clear">
							<Clear />
						</IconButton>
					</ListItem>
				))
			) : (
				<ListItem>
					<ListItemText primary={'No Options have been added'} />
				</ListItem>
			);

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

		/*const now = new Date();
		const today = new Date(
			Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
		);*/

		const titlePath = 'proposal.title';
		const commitStartPath = 'vote.phasesBlockHeights.commitStart';
		const commitEndPath = 'vote.phasesBlockHeights.commitEnd';
		const revealStartPath = 'vote.phasesBlockHeights.revealStart';
		const revealEndPath = 'vote.phasesBlockHeights.revealEnd';
		const hrefPath = 'proposal.externalRef.href';

		return (
			<Formik
				initialValues={poll}
				validationSchema={Yup.object().shape({
					proposal: Yup.object().shape({
						title: Yup.string().required('Required'),
					}),
					vote: Yup.object().shape({
						phasesBlockHeights: Yup.object().shape({
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
							/*.min(
									today,
									`Commit Start Date should be equal or later than today's date`
								), */
						}),
					}),
				})}
				onSubmit={(values, actions) => {
					updatePoll(values);
					this.props.handleNext();
				}}
				render={({ errors, touched, isSubmitting, handleReset, dirty }) => (
					<Grid container className={classes.pad}>
						<Grid item xs={12}>
							<Typography gutterBottom variant="title">
								Configure Poll
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Form onKeyPress={this.handleKeyPress}>
								<Grid container>
									<Grid item xs={3}>
										<Typography gutterBottom>
											Title:
											{errorStar(errors, touched, titlePath)}
										</Typography>
									</Grid>
									<Grid item xs={6} className={classes.moveLeft}>
										<Field
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
								<Grid container>
									<Grid item xs={12}>
										<br />
										<Typography gutterBottom variant="title">
											Question
										</Typography>
									</Grid>

									<Grid item xs={12}>
										<FormControl component="fieldset">
											<RadioGroup
												value={this.state.questionType}
												onChange={this.handleChange('questionType')}
											>
												<FormControlLabel
													value="a"
													control={<Radio />}
													label="Plain Text"
												/>
												<FormControlLabel
													className={classes.raiseRadio}
													value="b"
													control={<Radio />}
													label="External Proposal"
												/>
											</RadioGroup>
										</FormControl>
									</Grid>
									{this.state.questionType === 'a' && (
										<Grid item container xs={12}>
											<Grid item xs={1}>
												<Typography gutterBottom>Question:</Typography>
											</Grid>
											<Grid item xs={11}>
												<textarea rows="4" cols="60" />
											</Grid>
										</Grid>
									)}
									{this.state.questionType === 'b' && (
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
								<Grid container>
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
										{/* <Field component="select" name="color">
											<option value="red">Red</option>
											<option value="green">Green</option>
											<option value="blue">Blue</option>
										</Field> */}
										<select onChange={this.handleChange('voteType')}>
											<option selected disabled hidden>
												Choose a Type
											</option>
											<option value="a">Single Option Voting</option>
											<option value="b">Approval Voting</option>
											<option value="c">Instant Run-Off Voting</option>
										</select>
									</Grid>
									<Grid item xs={2}>
										<Typography gutterBottom>Allow Abstain:&nbsp;</Typography>
									</Grid>
									<Grid item xs={10}>
										<input type="checkbox" />
									</Grid>
									{this.state.voteType === 'a' && (
										<Grid container>
											<Grid item xs={6}>
												<Paper elevation={10} className={classes.pad}>
													<Typography variant="subheading">Options</Typography>
													<List dense>
														<ListItem divider>
															<LabelImportant style={{ fontSize: 15 }} />
															<ListItemText primary="Yes" />
														</ListItem>
														<ListItem>
															<LabelImportant style={{ fontSize: 15 }} />
															<ListItemText primary="No" />
														</ListItem>
													</List>
												</Paper>
											</Grid>
											<Grid item xs={6} />
										</Grid>
									)}
									{(this.state.voteType === 'b' ||
										this.state.voteType === 'c') && (
										<Grid container>
											<Grid item xs={12}>
												<Typography gutterBottom>
													Minimum Options Allowed:&nbsp;&nbsp;
													<input
														type="number"
														className={classes.numberInput}
													/>
												</Typography>
												<Typography gutterBottom>
													Maximum Options Allowed:&nbsp;
													<input
														type="number"
														className={classes.numberInput}
													/>
												</Typography>
											</Grid>

											<Grid item xs={12}>
												<Paper elevation={10} className={classes.pad}>
													<Typography variant="subheading">
														Options&nbsp;
														<input type="text" />
														<input
															type="button"
															onClick={this.addOption}
															value="Add"
														/>
													</Typography>

													<List className={classes.optionList} dense>
														{options}
													</List>
												</Paper>
											</Grid>
										</Grid>
									)}
								</Grid>

								<br />
								<br />
								<Typography gutterBottom variant="title">
									Invalidation Criteria
								</Typography>
								<List dense>
									<ListItem disableGutters divider>
										<Grid container>
											<Grid item xs={4}>
												<FormControlLabel
													control={
														<Checkbox
															checked={this.state.checkedTurnout}
															onChange={this.toggleCheckbox('checkedTurnout')}
															value="checkedTurnout"
															color="default"
														/>
													}
													label="Minimum Turnout"
												/>
											</Grid>
											<Grid item xs={8}>
												{!this.state.checkedTurnout && (
													<div>
														<label style={{ color: 'gray' }}>
															Weighted Ratio:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
															<input disabled type="text" size="4" />
														</label>
														<br />
														<label style={{ color: 'gray' }}>
															Unweighted Ratio:&nbsp;
															<input disabled type="text" size="4" />
														</label>
													</div>
												)}
												{this.state.checkedTurnout && (
													<div>
														<label>
															Weighted Ratio:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
															<input type="text" size="4" />
														</label>
														<br />
														<label>
															Unweighted Ratio:&nbsp;
															<input type="text" size="4" />
														</label>
													</div>
												)}
											</Grid>
										</Grid>
									</ListItem>
									<ListItem disableGutters>
										<Grid container>
											<Grid item xs={4}>
												<FormControlLabel
													control={
														<Checkbox
															checked={this.state.checkedSupport}
															onChange={this.toggleCheckbox('checkedSupport')}
															value="checkedSupport"
															color="default"
														/>
													}
													label="Minimum Support"
												/>
											</Grid>
											<Grid item xs={8}>
												{!this.state.checkedSupport && (
													<div>
														<label style={{ color: 'gray' }}>
															Weighted Ratio:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
															<input disabled type="text" size="4" />
														</label>
														<br />
														<label style={{ color: 'gray' }}>
															Unweighted Ratio:&nbsp;
															<input disabled type="text" size="4" />
														</label>
													</div>
												)}
												{this.state.checkedSupport && (
													<div>
														<label>
															Weighted Ratio:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
															<input type="text" size="4" />
														</label>
														<br />
														<label>
															Unweighted Ratio:&nbsp;
															<input type="text" size="4" />
														</label>
													</div>
												)}
											</Grid>
										</Grid>
									</ListItem>
								</List>

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
