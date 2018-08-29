import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Info from '@material-ui/icons/InfoOutlined';

class PreviewVote extends React.Component {
	state = {
		title: 'Test Title',
		type: 'Single Option Voting',
		href:
			'https://raw.githubusercontent.com/JacobEberhardt/ZoKrates/aa7e11/README.md',
		hash: 'F30A765AD6C5777E82EB2B64CFA53CDBB08D435546DD351880C13691867290B4',
		commitStartBlock: 154298,
		commitEndBlock: 154310,
		revealStartBlock: 154499,
		revealEndBlock: 155909,
		minTurnout: false,
		minSupport: false,
	};

	render() {
		const { classes } = this.props;

		return (
			<Paper elevation={3} className={classes.paper}>
				<Grid container>
					<Grid item xs={12}>
						<Typography align="center" gutterBottom variant="title">
							Preview & Sign
						</Typography>
					</Grid>
					<Grid item container xs={12}>
						<Grid item xs={3} className={classes.smallGridColumn}>
							<Typography variant="body2" gutterBottom>
								Title:
							</Typography>
						</Grid>
						<Grid item xs={9}>
							<Typography>{this.state.title}</Typography>
						</Grid>
						<Grid item xs={3} className={classes.smallGridColumn}>
							<Typography variant="body2" gutterBottom>
								Type:
							</Typography>
						</Grid>
						<Grid item xs={9}>
							<Typography>{this.state.type}</Typography>
						</Grid>

						<Grid item xs={3} className={classes.smallGridColumn}>
							<Typography variant="body2" gutterBottom>
								Proposal href:
							</Typography>
						</Grid>
						<Grid item xs={9}>
							<a href={this.state.href}>
								<Typography>{this.state.href}</Typography>
							</a>
						</Grid>
						<Grid item xs={3} className={classes.smallGridColumn}>
							<Typography variant="body2" gutterBottom>
								Proposal Hash:&nbsp;
								<Info
									style={{ fontSize: '15px' }}
									titleAccess="Hash Type: SHA-256"
								/>
							</Typography>
						</Grid>
						<Grid item xs={9}>
							<Typography>{this.state.hash}</Typography>
						</Grid>
						<Grid item xs={3} className={classes.smallGridColumn}>
							<Typography variant="body2" gutterBottom>
								Commit Start Block:
							</Typography>
						</Grid>
						<Grid item xs={9}>
							<Typography>{this.state.commitStartBlock}</Typography>
						</Grid>
						<Grid item xs={3} className={classes.smallGridColumn}>
							<Typography variant="body2" gutterBottom>
								Commit End Block:
							</Typography>
						</Grid>
						<Grid item xs={9}>
							<Typography>{this.state.commitEndBlock}</Typography>
						</Grid>
						<Grid item xs={3} className={classes.smallGridColumn}>
							<Typography variant="body2" gutterBottom>
								Reveal Start Block:
							</Typography>
						</Grid>
						<Grid item xs={9}>
							<Typography>{this.state.revealStartBlock}</Typography>
						</Grid>
						<Grid item xs={3} className={classes.smallGridColumn}>
							<Typography variant="body2" gutterBottom>
								Reveal End Block:
							</Typography>
						</Grid>
						<Grid item xs={9}>
							<Typography>{this.state.revealEndBlock}</Typography>
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<Paper elevation={1} className={classes.paper}>
							<Typography variant="body2" gutterBottom>
								Options:
							</Typography>
							<List dense>
								<ListItem divider>
									<ListItemText primary="A. Yes" />
								</ListItem>
								<ListItem>
									<ListItemText primary="B. No" />
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

					<Grid item xs={12}>
						<br />
						<Paper elevation={1} className={classes.paper}>
							<Typography variant="body2" gutterBottom>
								Invalidation Criteria:
							</Typography>
							<List dense>
								<ListItem>
									<Grid container>
										<Grid item xs={4}>
											<FormControlLabel
												control={<Checkbox color="default" checked={true} />}
												label="Minimum Turnout"
											/>
										</Grid>
										<Grid item xs={8}>
											<div>
												<Typography
													style={{ display: 'inline' }}
													variant="body2"
												>
													Turnout Ratio:&nbsp;
												</Typography>
												0.4
												<br />
												<Typography
													style={{ display: 'inline' }}
													variant="body2"
												>
													Weighted:&nbsp;
												</Typography>
												True
											</div>
										</Grid>
									</Grid>
								</ListItem>
							</List>
						</Paper>
						<br />
					</Grid>
					<Grid xs={2} item>
						<Typography variant="body2" gutterBottom>
							Poll Admin ID:
						</Typography>
					</Grid>
					<Grid xs={10} item>
						<input type="text" />
					</Grid>
					<Grid xs={2} item>
						<Typography variant="body2" gutterBottom>
							Signature:
						</Typography>
					</Grid>
					<Grid xs={10} item>
						<input type="password" />
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<Button variant="outlined" size="small" color="secondary">
							Calculate Nonce
						</Button>
					</Grid>
					<Grid xs={12} item />
				</Grid>
			</Paper>
		);
	}
}

PreviewVote.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	paper: {
		padding: 15,
	},
	smallGridColumn: {
		flexBasis: '19%',
	},
});

export default withStyles(styles)(PreviewVote);
