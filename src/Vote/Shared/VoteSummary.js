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
import get from 'lodash/get';
import {
	SINGLE_OPTION_VOTING,
	APPROVAL_VOTING,
	INSTANT_RUNOFF_VOTING,
} from '../Create/VOTE_CONSTANTS';

//duplicates
const titlePath = 'pollJSON.proposal.title';
const commitStartPath = 'pollJSON.vote.phasesBlockHeights.commitStart';
const commitEndPath = 'pollJSON.vote.phasesBlockHeights.commitEnd';
const revealStartPath = 'pollJSON.vote.phasesBlockHeights.revealStart';
const revealEndPath = 'pollJSON.vote.phasesBlockHeights.revealEnd';
const hrefPath = 'pollJSON.proposal.externalRef.href';
const textPath = 'pollJSON.proposal.text';
const optionsPath = 'pollJSON.vote.config.options';
const voteTypePath = 'pollJSON.vote.type';
const minOptionsPath = 'pollJSON.vote.config.minOptions';
const maxOptionsPath = 'pollJSON.vote.config.maxOptions';

const weightedMinTurnoutPath =
	'pollJSON.vote.config.acceptanceCriteria.weightedMinTurnout';
const unweightedMinTurnoutPath =
	'pollJSON.vote.config.acceptanceCriteria.unweightedMinTurnout';
const weightedMinSupportPath =
	'pollJSON.vote.config.acceptanceCriteria.weightedMinSupport';
const unweightedMinSupportPath =
	'pollJSON.vote.config.acceptanceCriteria.unweightedMinSupport';

//unique so far
const hashValuePath = 'pollJSON.proposal.externalRef.hash.value';
const hashAlgoPath = 'pollJSON.proposal.externalRef.hash.algo';
const protocolVersionPath = 'formFields.protocolVersion';
const pollAdminIDPath = 'formFields.pollAdminID';
const pollChainIDPath = 'formFields.pollChainID';
const voteTypes = [
	'Single Option Voting',
	'Approval Voting',
	'Instant Run-Off Voting',
];

class VoteSummary extends React.Component {
	render() {
		const { classes } = this.props;
		const poll = this.props.poll;

		const hasMinTurnoutCritiera =
			get(poll, weightedMinTurnoutPath) || get(poll, unweightedMinTurnoutPath);

		const hasMinSupportCriteria =
			get(poll, weightedMinSupportPath) || get(poll, unweightedMinSupportPath);

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
						<Typography>{get(poll, titlePath)}</Typography>
					</Grid>
					<Grid item xs={3} className={classes.smallGridColumn}>
						<Typography gutterBottom>Commit Start Block:</Typography>
					</Grid>
					<Grid item xs={9}>
						<Typography>
							{get(poll, commitStartPath)}

							{/*{new Date(get(poll, commitStartPath)).toLocaleDateString()}*/}
						</Typography>
					</Grid>
					<Grid item xs={3} className={classes.smallGridColumn}>
						<Typography gutterBottom>Commit End Block:</Typography>
					</Grid>
					<Grid item xs={9}>
						<Typography>{get(poll, commitEndPath)}</Typography>
					</Grid>
					<Grid item xs={3} className={classes.smallGridColumn}>
						<Typography gutterBottom>Reveal Start Block:</Typography>
					</Grid>
					<Grid item xs={9}>
						<Typography>{get(poll, revealStartPath)}</Typography>
					</Grid>
					<Grid item xs={3} className={classes.smallGridColumn}>
						<Typography gutterBottom>Reveal End Block:</Typography>
					</Grid>
					<Grid item xs={9}>
						<Typography>{get(poll, revealEndPath)}</Typography>
					</Grid>
				</Grid>
				{get(poll, pollChainIDPath) && (
					<Grid item xs={12} container>
						<Grid item xs={3} className={classes.smallGridColumn}>
							<Typography gutterBottom>Poll Chain ID:</Typography>
						</Grid>
						<Grid item xs={9}>
							<Typography>
								{get(poll, pollChainIDPath)}
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
				{get(poll, pollAdminIDPath) && (
					<Grid item xs={12} container>
						<Grid item xs={3} className={classes.smallGridColumn}>
							<Typography gutterBottom>Poll Admin ID:</Typography>
						</Grid>
						<Grid item xs={9}>
							<Typography>
								{get(poll, pollAdminIDPath)}
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
				{get(poll, protocolVersionPath) && (
					<Grid item xs={12} container>
						<Grid item xs={3} className={classes.smallGridColumn}>
							<Typography gutterBottom>Protocol Version:</Typography>
						</Grid>
						<Grid item xs={9}>
							<Typography>{get(poll, protocolVersionPath)}</Typography>
						</Grid>
					</Grid>
				)}
				<Grid item xs={12}>
					<br />
					<Typography gutterBottom variant="title">
						Question
					</Typography>
				</Grid>
				{get(poll, hrefPath) && (
					<Grid container item xs={12}>
						<Grid item xs={3} className={classes.smallGridColumn}>
							<Typography gutterBottom>URL Link:</Typography>
						</Grid>
						<Grid item xs={9}>
							<a href={get(poll, hrefPath)}>
								<Typography>{get(poll, hrefPath)}</Typography>
							</a>
						</Grid>
						<Grid item xs={3} className={classes.smallGridColumn}>
							<Typography gutterBottom>
								Proposal Hash:&nbsp;
								<Tooltip title={'Hash Type: ' + get(poll, hashAlgoPath)}>
									<Info style={{ fontSize: '15px' }} />
								</Tooltip>
							</Typography>
						</Grid>
						<Grid item xs={9}>
							<Typography>{get(poll, hashValuePath)}</Typography>
						</Grid>
					</Grid>
				)}
				{get(poll, textPath) && (
					<Grid container item xs={12}>
						<Grid item xs={3} className={classes.smallGridColumn}>
							<Typography gutterBottom>Question:</Typography>
						</Grid>
						<Grid item xs={9}>
							<Typography>{get(poll, textPath)}</Typography>
						</Grid>
					</Grid>
				)}

				<Grid item xs={12}>
					<br />
					<Typography gutterBottom variant="title">
						Answers
					</Typography>
				</Grid>
				<Grid item xs={2} className={classes.smallGridColumn}>
					<Typography gutterBottom>Type:</Typography>
				</Grid>
				<Grid item xs={10}>
					<Typography>{voteTypes[get(poll, voteTypePath)]}</Typography>
				</Grid>
				<Grid container item xs={12}>
					<Grid item xs={2}>
						<Typography gutterBottom>Allow Abstain:</Typography>
					</Grid>
					<Grid item xs={10}>
						<input defaultChecked type="checkbox" />
					</Grid>
				</Grid>
				{(get(poll, voteTypePath) === APPROVAL_VOTING ||
					get(poll, voteTypePath) === INSTANT_RUNOFF_VOTING) && (
					<Grid container item xs={12}>
						<Grid item xs={12}>
							<Typography gutterBottom>
								Minimum Options Allowed:&nbsp;&nbsp;
								{get(poll, minOptionsPath)}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography gutterBottom>
								Maximum Options Allowed:&nbsp;
								{get(poll, maxOptionsPath)}
							</Typography>
						</Grid>
					</Grid>
				)}
				{get(poll, voteTypePath) && (
					<Grid item xs={12}>
						<Paper elevation={1} className={classes.pad}>
							<Typography variant="subheading">Options</Typography>
							<List dense>
								{get(poll, optionsPath) &&
									get(poll, optionsPath).map((option, index) => (
										<ListItem
											key={index}
											divider={index < get(poll, optionsPath).length - 1}
										>
											<LabelImportant style={{ fontSize: 15 }} />
											<ListItemText primary={option} />
										</ListItem>
									))}
							</List>
						</Paper>
					</Grid>
				)}
				<Grid item xs={12}>
					<br />
					<Typography variant="title" gutterBottom>
						Invalidation Criteria
					</Typography>
					{hasMinTurnoutCritiera || hasMinSupportCriteria ? (
						<List dense>
							{hasMinTurnoutCritiera && (
								<ListItem divider>
									<Grid container>
										<Grid item xs={4}>
											<FormControlLabel
												control={
													<Checkbox
														disableRipple
														color="default"
														checked={hasMinTurnoutCritiera}
													/>
												}
												label="Minimum Turnout"
											/>
										</Grid>
										<Grid item xs={8}>
											<Grid container>
												{get(poll, weightedMinTurnoutPath) && (
													<Grid item xs={12}>
														{!get(poll, unweightedMinTurnoutPath) && <br />}
														<Typography style={{ display: 'inline' }}>
															Weighted Ratio:&nbsp;
															{get(poll, weightedMinTurnoutPath)}
														</Typography>
													</Grid>
												)}
												{get(poll, unweightedMinTurnoutPath) && (
													<Grid item xs={12}>
														{!get(poll, weightedMinTurnoutPath) && <br />}
														<Typography style={{ display: 'inline' }}>
															Unweighted Ratio:&nbsp;
															{get(poll, unweightedMinTurnoutPath)}
														</Typography>
													</Grid>
												)}
											</Grid>
										</Grid>
									</Grid>
								</ListItem>
							)}
							{hasMinSupportCriteria && (
								<ListItem>
									<Grid container>
										<Grid item xs={4}>
											<FormControlLabel
												control={
													<Checkbox
														disableRipple
														color="default"
														checked={hasMinSupportCriteria}
													/>
												}
												label="Minimum Support"
											/>
										</Grid>
										<Grid item xs={8}>
											<Grid container>
												{get(poll, weightedMinSupportPath) && (
													<Grid item xs={12}>
														{!get(poll, unweightedMinSupportPath) && <br />}
														<Typography style={{ display: 'inline' }}>
															Weighted Ratio:&nbsp;
															{get(poll, weightedMinSupportPath)}
														</Typography>
													</Grid>
												)}
												{get(poll, unweightedMinSupportPath) && (
													<Grid item xs={12}>
														{!get(poll, weightedMinSupportPath) && <br />}
														<Typography style={{ display: 'inline' }}>
															Unweighted Ratio:&nbsp;
															{get(poll, unweightedMinSupportPath)}
														</Typography>
													</Grid>
												)}
											</Grid>
										</Grid>
									</Grid>
								</ListItem>
							)}
						</List>
					) : (
						<div>
							<Typography>None</Typography>
							<br />
						</div>
					)}
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
