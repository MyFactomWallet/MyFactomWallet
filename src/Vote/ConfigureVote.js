import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import Clear from '@material-ui/icons/Clear';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import LabelImportant from '@material-ui/icons/LabelImportant';

class ConfigureVote extends React.Component {
	state = {
		checkedTurnout: false,
		checkedSupport: false,
		questionType: 'a',
		voteType: '',
		options: [],
	};

	handleChange = (name) => (event) => {
		this.setState({ [name]: event.target.checked });
	};

	handleChangeQuestionType = (event) => {
		this.setState({ questionType: event.target.value });
	};

	handleChangeVoteType = (event) => {
		this.setState({ voteType: event.target.value });
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

	render() {
		const { classes } = this.props;

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

		return (
			<Grid container className={classes.pad}>
				<Grid item xs={12}>
					<Typography gutterBottom variant="title">
						Configure Poll
					</Typography>
				</Grid>
				<Grid item container xs={12}>
					<Grid item xs={2}>
						<Typography gutterBottom>Title:</Typography>
					</Grid>
					<Grid item xs={10}>
						<input type="text" size="35" />
					</Grid>
					<Grid item xs={2}>
						<Typography gutterBottom>Commit Start Date:</Typography>
					</Grid>
					<Grid item xs={10}>
						<input type="datetime-local" />
					</Grid>
					<Grid item xs={2}>
						<Typography gutterBottom>Commit End Date:</Typography>
					</Grid>
					<Grid item xs={10}>
						<input type="datetime-local" />
					</Grid>
					<Grid item xs={2}>
						<Typography gutterBottom>Reveal Start Date:</Typography>
					</Grid>
					<Grid item xs={10}>
						<input type="datetime-local" />
					</Grid>
					<Grid item xs={2}>
						<Typography gutterBottom>Reveal End Date:</Typography>
					</Grid>
					<Grid item xs={10}>
						<input type="datetime-local" />
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
								value={this.state.questionType}
								onChange={this.handleChangeQuestionType}
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
						<select onChange={this.handleChangeVoteType}>
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
					{(this.state.voteType === 'b' || this.state.voteType === 'c') && (
						<Grid container>
							<Grid item xs={12}>
								<Typography gutterBottom>
									Minimum Options Allowed:&nbsp;&nbsp;
									<input type="number" className={classes.numberInput} />
								</Typography>
								<Typography gutterBottom>
									Maximum Options Allowed:&nbsp;
									<input type="number" className={classes.numberInput} />
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
									<FormControlLabel
										control={
											<Checkbox
												checked={this.state.checkedTurnout}
												onChange={this.handleChange('checkedTurnout')}
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
						<ListItem disableGutters divider>
							<Grid container>
								<Grid item xs={4}>
									<FormControlLabel
										control={
											<Checkbox
												checked={this.state.checkedSupport}
												onChange={this.handleChange('checkedSupport')}
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
				</Grid>
			</Grid>
		);
	}
}

ConfigureVote.propTypes = {
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
});

export default withStyles(styles)(ConfigureVote);
