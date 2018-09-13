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

		const requiredStar = <span style={{ color: 'red' }}>&nbsp;*</span>;

		/*const now = new Date();
		const today = new Date(
			Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
		);*/

		return (
			<Formik
				initialValues={poll}
				validationSchema={Yup.object().shape({
					title: Yup.string()
						.required('Required')
						.max(256),
					commitStartDate: Yup.date().required('Required'),
					/* 	.min(
							today,
							`Commit Start Date should be equal or later than today's date`
						), */
					commitEndDate: Yup.date().required('Required'),
					revealStartDate: Yup.date().required('Required'),
					revealEndDate: Yup.date().required('Required'),
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
							<button
								type="button"
								onClick={handleReset}
								disabled={!dirty || isSubmitting}
							>
								Reset
							</button>
						</Grid>
						<Grid item xs={12}>
							<Form onKeyPress={this.handleKeyPress}>
								<Grid container>
									<Grid item xs={3}>
										<Typography gutterBottom>
											Title:
											{errors.title && touched.title && requiredStar}
										</Typography>
									</Grid>
									<Grid item xs={9} className={classes.moveLeft}>
										<Field
											type="text"
											name="title"
											size="35"
											className={`${errors.title &&
												touched.title &&
												classes.isInvalid}`}
										/>
										{errors.title &&
											touched.title && (
												<div className={classes.invalidFeedback}>
													{errors.title}
												</div>
											)}
									</Grid>
									<Grid item xs={3}>
										<Typography gutterBottom>
											Commit Start Date:
											{errors.commitStartDate &&
												touched.commitStartDate &&
												requiredStar}
										</Typography>
									</Grid>
									<Grid item xs={9} className={classes.moveLeft}>
										<Field
											type="date"
											name="commitStartDate"
											className={`${errors.commitStartDate &&
												touched.commitStartDate &&
												classes.isInvalid}`}
										/>
										{errors.commitStartDate &&
											touched.commitStartDate && (
												<div className={classes.invalidFeedback}>
													{errors.commitStartDate}
												</div>
											)}
									</Grid>
									<Grid item xs={3}>
										<Typography gutterBottom>
											Commit End Date:
											{errors.commitEndDate &&
												touched.commitEndDate &&
												requiredStar}
										</Typography>
									</Grid>
									<Grid item xs={9} className={classes.moveLeft}>
										<Field
											type="date"
											name="commitEndDate"
											className={`${errors.commitEndDate &&
												touched.commitEndDate &&
												classes.isInvalid}`}
										/>
										{errors.commitEndDate &&
											touched.commitEndDate && (
												<div className={classes.invalidFeedback}>
													{errors.commitEndDate}
												</div>
											)}
									</Grid>
									<Grid item xs={3}>
										<Typography gutterBottom>
											Reveal Start Date:
											{errors.revealStartDate &&
												touched.revealStartDate &&
												requiredStar}
										</Typography>
									</Grid>
									<Grid item xs={9} className={classes.moveLeft}>
										<Field
											type="date"
											name="revealStartDate"
											className={`${errors.revealStartDate &&
												touched.revealStartDate &&
												classes.isInvalid}`}
										/>
										{errors.revealStartDate &&
											touched.revealStartDate && (
												<div className={classes.invalidFeedback}>
													{errors.revealStartDate}
												</div>
											)}
									</Grid>
									<Grid item xs={3}>
										<Typography gutterBottom>
											Reveal End Date:
											{errors.revealEndDate &&
												touched.revealEndDate &&
												requiredStar}
										</Typography>
									</Grid>
									<Grid item xs={9} className={classes.moveLeft}>
										<Field
											type="date"
											name="revealEndDate"
											className={`${errors.revealEndDate &&
												touched.revealEndDate &&
												classes.isInvalid}`}
										/>
										{errors.revealEndDate &&
											touched.revealEndDate && (
												<div className={classes.invalidFeedback}>
													{errors.revealEndDate}
												</div>
											)}
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
												URL Link:&nbsp;
												<input type="text" />
											</Typography>
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
									<Grid item xs={1}>
										<Typography gutterBottom>Type:&nbsp;</Typography>
									</Grid>
									<Grid item xs={11}>
										<select onChange={this.handleChange('voteType')}>
											<option selected disabled hidden>
												Choose a Type
											</option>
											<option value="a">Single Option Voting</option>
											<option value="b">Approval Voting</option>
											<option value="c">Instant Run-Off Voting</option>
										</select>
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
														<input type="text" />{' '}
														<button onClick={this.addOption}>Add</button>
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
