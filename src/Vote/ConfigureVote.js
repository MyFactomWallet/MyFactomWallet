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

class ConfigureVote extends React.Component {
	state = {
		checkedB: false,
		checkedA: false,
	};
	handleChange = (name) => (event) => {
		this.setState({ [name]: event.target.checked });
	};

	render() {
		const { classes } = this.props;
		return (
			<Paper elevation={3} className={classes.paper}>
				<Grid container spacing={24}>
					<Grid item xs={12}>
						<Typography align="center" gutterBottom variant="title">
							Configure Poll
						</Typography>
					</Grid>
					<Grid item xs={5}>
						<Typography variant="body2" gutterBottom>
							Title: <input type="text" size="35" />
						</Typography>
						<Typography variant="body2" gutterBottom>
							Type:&nbsp;
							<select>
								<option defaultValue value="" />
								<option>Single Option Voting</option>
								<option>Approval Voting</option>
								<option>Instant Run-Off Voting</option>
							</select>
						</Typography>
						<Typography variant="body2" gutterBottom>
							Proposal href: <input type="text" />
						</Typography>
						<Typography variant="body2" gutterBottom>
							Commit Start Block: <input type="number" />
						</Typography>
						<Typography variant="body2" gutterBottom>
							Commit End Block: <input type="number" />
						</Typography>
						<Typography variant="body2" gutterBottom>
							Reveal Start Block: <input type="number" />
						</Typography>
						<Typography variant="body2" gutterBottom>
							Reveal End Block: <input type="number" />
						</Typography>
					</Grid>
					<Grid item xs={7}>
						<Paper elevation={1} className={classes.paper}>
							<Typography variant="body2" gutterBottom>
								Options:
							</Typography>
							<Typography variant="body2" gutterBottom>
								<input type="text" /> <button>Add</button>
							</Typography>
							<List dense>
								<ListItem divider>
									<ListItemText primary="A. Yes" />
									<IconButton aria-label="Clear">
										<Clear />
									</IconButton>
								</ListItem>
								<ListItem>
									<ListItemText primary="B. No" />
									<IconButton aria-label="Clear">
										<Clear />
									</IconButton>
								</ListItem>
							</List>
						</Paper>
					</Grid>

					{/* 	<Typography variant="body2" gutterBottom>
						Minimum Options Allowed:&nbsp;
						<select>
							<option defaultValue value="" />
							<option>2</option>
							<option>3</option>
							<option>4</option>
						</select>
					</Typography>
					<Typography variant="body2" gutterBottom>
						Maximum Options Allowed:&nbsp;
						<select>
							<option defaultValue value="" />
							<option>2</option>
							<option>3</option>
							<option>4</option>
						</select>
					</Typography> */}
					<br />
					<Grid item xs={12}>
						<Paper elevation={1} className={classes.paper}>
							<Typography variant="body2" gutterBottom>
								Invalidation Criteria:
							</Typography>
							<List dense>
								<ListItem disableGutters divider>
									<Grid container>
										<Grid item xs={4}>
											<FormControlLabel
												control={
													<Checkbox
														checked={this.state.checkedB}
														onChange={this.handleChange('checkedB')}
														value="checkedB"
														color="default"
													/>
												}
												label="Minimum Turnout"
											/>
										</Grid>
										<Grid item xs={8}>
											{this.state.checkedB && (
												<div>
													<label>
														Turnout Ratio:&nbsp;
														<input type="text" size="4" />
													</label>
													<br />
													<label>
														Weighted:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
														<select>
															<option />
															<option>True</option>
															<option>False</option>
														</select>
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
														checked={this.state.checkedA}
														onChange={this.handleChange('checkedA')}
														value="checkedA"
														color="default"
													/>
												}
												label="Minimum Support"
											/>
										</Grid>
										<Grid item xs={8}>
											{this.state.checkedA && (
												<div>
													<label>
														Support Ratio:&nbsp;
														<input type="text" size="4" />
													</label>
													<br />
													<label>
														Weighted:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
														<select>
															<option />
															<option>True</option>
															<option>False</option>
														</select>
													</label>
												</div>
											)}
										</Grid>
									</Grid>
								</ListItem>
							</List>
						</Paper>
					</Grid>
				</Grid>
			</Paper>
		);
	}
}

ConfigureVote.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	paper: {
		padding: 15,
	},
});

export default withStyles(styles)(ConfigureVote);
