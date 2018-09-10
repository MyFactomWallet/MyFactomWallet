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
import Info from '@material-ui/icons/InfoOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import LabelImportant from '@material-ui/icons/LabelImportant';
import OpenInNew from '@material-ui/icons/OpenInNew';

class VoteSummary extends React.Component {
	render() {
		const { classes } = this.props;
		const poll = this.props.poll;

		return (
			<Grid item xs={12} container>
				<Grid item xs={12}>
					<Typography gutterBottom variant="title">
						Configuration
					</Typography>
				</Grid>
				<Grid item container xs={12}>
					<Grid item xs={3} className={classes.smallGridColumn}>
						<Typography gutterBottom>Title:</Typography>
					</Grid>
					<Grid item xs={9}>
						<Typography>{poll.title}</Typography>
					</Grid>
					<Grid item xs={3} className={classes.smallGridColumn}>
						<Typography gutterBottom>Commit Start Date:</Typography>
					</Grid>
					<Grid item xs={9}>
						<Typography>{poll.commitStartDate}</Typography>
					</Grid>
					<Grid item xs={3} className={classes.smallGridColumn}>
						<Typography gutterBottom>Commit End Date:</Typography>
					</Grid>
					<Grid item xs={9}>
						<Typography>{poll.commitEndDate}</Typography>
					</Grid>
					<Grid item xs={3} className={classes.smallGridColumn}>
						<Typography gutterBottom>Reveal Start Date:</Typography>
					</Grid>
					<Grid item xs={9}>
						<Typography>{poll.revealStartDate}</Typography>
					</Grid>
					<Grid item xs={3} className={classes.smallGridColumn}>
						<Typography gutterBottom>Reveal End Date:</Typography>
					</Grid>
					<Grid item xs={9}>
						<Typography>{poll.revealEndDate}</Typography>
					</Grid>
				</Grid>
				{poll.pollChainID && (
					<Grid item xs={12} container>
						<Grid item xs={3} className={classes.smallGridColumn}>
							<Typography gutterBottom>Poll Chain ID:</Typography>
						</Grid>
						<Grid item xs={9}>
							<Typography>
								{poll.pollChainID}
								&nbsp;
								<a
									target="_blank"
									href={
										'https://explorer.factom.com/eblocks/0e5570917c25c6b35dbf67c802958d802e43fd9f48dd0c35a01feec1235de267'
									}
								>
									<OpenInNew color="primary" style={{ fontSize: 15 }} />
								</a>
							</Typography>
						</Grid>
					</Grid>
				)}
				{poll.pollAdminID && (
					<Grid item xs={12} container>
						<Grid item xs={3} className={classes.smallGridColumn}>
							<Typography gutterBottom>Poll Admin ID:</Typography>
						</Grid>
						<Grid item xs={9}>
							<Typography>
								{poll.pollAdminID}
								&nbsp;
								<a
									target="_blank"
									href={
										'https://explorer.factom.com/eblocks/0e5570917c25c6b35dbf67c802958d802e43fd9f48dd0c35a01feec1235de267'
									}
								>
									<OpenInNew color="primary" style={{ fontSize: 15 }} />
								</a>
							</Typography>
						</Grid>
					</Grid>
				)}
				{poll.protocolVersion && (
					<Grid item xs={12} container>
						<Grid item xs={3} className={classes.smallGridColumn}>
							<Typography gutterBottom>Protocol Version:</Typography>
						</Grid>
						<Grid item xs={9}>
							<Typography>{poll.protocolVersion}</Typography>
						</Grid>
					</Grid>
				)}
				<Grid item xs={12}>
					<br />
					<Typography gutterBottom variant="title">
						Question
					</Typography>
				</Grid>
				<Grid item xs={3} className={classes.smallGridColumn}>
					<Typography gutterBottom>URL Link:</Typography>
				</Grid>
				<Grid item xs={9}>
					<a href={poll.href}>
						<Typography>{poll.href}</Typography>
					</a>
				</Grid>
				<Grid item xs={3} className={classes.smallGridColumn}>
					<Typography gutterBottom>
						Proposal Hash:&nbsp;
						<Tooltip title="Hash Type: SHA-256">
							<Info style={{ fontSize: '15px' }} />
						</Tooltip>
					</Typography>
				</Grid>

				<Grid item xs={9}>
					<Typography>{poll.hash}</Typography>
				</Grid>
				<Grid item xs={12}>
					<br />
					<Typography gutterBottom variant="title">
						Answers
					</Typography>
				</Grid>
				<Grid item xs={3} className={classes.smallGridColumn}>
					<Typography gutterBottom>Type:</Typography>
				</Grid>
				<Grid item xs={9}>
					<Typography>{poll.type}</Typography>
				</Grid>
				<Grid item xs={12}>
					<Paper elevation={1} className={classes.pad}>
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
				<Grid item xs={12}>
					<br />
					<Typography variant="title" gutterBottom>
						Invalidation Criteria
					</Typography>
					<List dense>
						<ListItem divider>
							<Grid container>
								<Grid item xs={4}>
									<FormControlLabel
										control={
											<Checkbox disableRipple color="default" checked={true} />
										}
										label="Minimum Turnout"
									/>
								</Grid>
								<Grid item xs={8}>
									<div>
										<Typography style={{ display: 'inline' }}>
											Weighted Ratio:&nbsp;
										</Typography>
										0.4
										<br />
										<Typography style={{ display: 'inline' }}>
											Unweighted Ratio:&nbsp;
										</Typography>
										0.5
									</div>
								</Grid>
							</Grid>
						</ListItem>
						<ListItem>
							<Grid container>
								<Grid item xs={4}>
									<FormControlLabel
										control={
											<Checkbox disableRipple color="default" checked={true} />
										}
										label="Minimum Support"
									/>
								</Grid>
								<Grid item xs={8}>
									<div>
										<Typography style={{ display: 'inline' }}>
											Weighted Ratio:&nbsp;
										</Typography>
										0.4
										<br />
										<Typography style={{ display: 'inline' }}>
											Unweighted Ratio:&nbsp;
										</Typography>
										0.5
									</div>
								</Grid>
							</Grid>
						</ListItem>
					</List>
				</Grid>
			</Grid>
		);
	}
}

VoteSummary.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	pad: {
		padding: 15,
	},
	smallGridColumn: {
		flexBasis: '19%',
	},
	optionList: {
		width: '350px',
		overflow: 'auto',
	},
});

export default withStyles(styles)(VoteSummary);
