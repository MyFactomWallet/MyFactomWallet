import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import _flowRight from 'lodash/flowRight';
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
import SectionHeader from '../shared/SectionHeader';
import { withNetwork } from '../../context/NetworkContext';
import EligibleVotersList from '../shared/EligibleVotersList';

import {
	BINARY_CONFIG,
	SINGLE_OPTION_CONFIG,
	APPROVAL_CONFIG,
	INSTANT_RUNOFF_CONFIG,
	ALL_ELIGIBLE_VOTERS,
	PARTICIPANTS_ONLY,
	VOTE_TYPES,
} from '../create/VOTE_CONSTANTS';

/**
 * Constants
 */

//duplicates
const titlePath = 'pollJSON.proposal.title';
const commitStartPath = 'pollJSON.vote.phasesBlockHeights.commitStart';
const commitEndPath = 'pollJSON.vote.phasesBlockHeights.commitEnd';
const revealStartPath = 'pollJSON.vote.phasesBlockHeights.revealStart';
const revealEndPath = 'pollJSON.vote.phasesBlockHeights.revealEnd';
const hrefPath = 'pollJSON.proposal.externalRef.href';
const hashValuePath = 'pollJSON.proposal.externalRef.hash.value';
const hashAlgoPath = 'pollJSON.proposal.externalRef.hash.algo';
const textPath = 'pollJSON.proposal.text';
const optionsPath = 'pollJSON.vote.config.options';
const voteTypePath = 'pollJSON.vote.type';
const abstentionPath = 'pollJSON.vote.config.allowAbstention';
const computeResultsAgainstPath = 'pollJSON.vote.config.computeResultsAgainst';
const minOptionsPath = 'pollJSON.vote.config.minOptions';
const maxOptionsPath = 'pollJSON.vote.config.maxOptions';
const minSupportPath = 'pollJSON.vote.config.winnerCriteria.minSupport';
const minTurnoutPath = 'pollJSON.vote.config.acceptanceCriteria.minTurnout';

const weightedMinTurnoutPath =
	'pollJSON.vote.config.acceptanceCriteria.minTurnout.weighted';
const unweightedMinTurnoutPath =
	'pollJSON.vote.config.acceptanceCriteria.minTurnout.unweighted';

//unique so far
const protocolVersionPath = 'formFields.protocolVersion';
const pollAdminIDPath = 'formFields.pollAdminID';
const pollChainIDPath = 'formFields.pollChainID';

class VoteSummary extends React.Component {
	state = { currentHeight: null };

	async componentDidMount() {
		window.scrollTo(0, 0);

		const tfaURL = this.props.networkController.networkProps.explorerApiURL;

		fetch(tfaURL + '/top')
			.then((response) => response.json())
			.then((data) => this.setState({ currentHeight: data.result.top }));
	}

	render() {
		const { classes, eligibleVoters } = this.props;
		const poll = this.props.poll;

		// minimum support
		const minSupportOption = Object.keys(_get(poll, minSupportPath))[0];

		const weightedMinSupportPath =
			minSupportPath + '.' + minSupportOption + '.weighted';
		const unweightedMinSupportPath =
			minSupportPath + '.' + minSupportOption + '.unweighted';

		// vote type text
		const voteTypeValue = _get(poll, voteTypePath);

		let voteTypeText = '';

		if (voteTypeValue === 1) {
			if (
				_get(poll, minOptionsPath) === 1 &&
				_get(poll, maxOptionsPath) === 1
			) {
				voteTypeText = SINGLE_OPTION_CONFIG.name;
			} else {
				voteTypeText = APPROVAL_CONFIG.name;
			}
		} else {
			voteTypeText = VOTE_TYPES[voteTypeValue].name;
		}

		// minimum turnout
		const hasMinTurnoutCritiera = !_isNil(_get(poll, minTurnoutPath));

		// date estimations
		let commitStartDate = null;
		let commitEndDate = null;
		let revealStartDate = null;
		let revealEndDate = null;

		if (this.state.currentHeight) {
			commitStartDate = calculateWriteTime(
				this.state.currentHeight,
				_get(poll, commitStartPath)
			);
			commitEndDate = calculateWriteTime(
				this.state.currentHeight,
				_get(poll, commitEndPath)
			);
			revealStartDate = calculateWriteTime(
				this.state.currentHeight,
				_get(poll, revealStartPath)
			);
			revealEndDate = calculateWriteTime(
				this.state.currentHeight,
				_get(poll, revealEndPath)
			);
		}

		return (
			<Grid item xs={12} container>
				<Grid item xs={9}>
					<SectionHeader text="Configure Poll" />
				</Grid>
				<Grid item xs={3}>
					<Typography>Current Height: {this.state.currentHeight}</Typography>
				</Grid>
				<Grid item container xs={6}>
					<Grid item xs={12}>
						<Typography gutterBottom>Title: {_get(poll, titlePath)}</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography gutterBottom>Type: {voteTypeText}</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography gutterBottom>
							Compute Results Against:{' '}
							{_get(poll, computeResultsAgainstPath) ===
							ALL_ELIGIBLE_VOTERS.value
								? ALL_ELIGIBLE_VOTERS.text
								: PARTICIPANTS_ONLY.text}
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography gutterBottom>
							Allow Abstain: {_get(poll, abstentionPath) ? 'True' : 'False'}
						</Typography>
					</Grid>
				</Grid>
				<Grid item container xs={3}>
					<Grid item xs={12}>
						<Typography gutterBottom>
							Commit Start Block:&nbsp;{_get(poll, commitStartPath)}
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography gutterBottom>
							Commit End Block:&nbsp;&nbsp;&nbsp;{_get(poll, commitEndPath)}
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography gutterBottom>
							Reveal Start Block:&nbsp;&nbsp;&nbsp;&nbsp;
							{_get(poll, revealStartPath)}
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography gutterBottom>
							Reveal End Block:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							{_get(poll, revealEndPath)}
						</Typography>
					</Grid>
				</Grid>
				<Grid item container xs={3}>
					<Grid item xs={12}>
						<Typography>{commitStartDate}</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography>{commitEndDate}</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography>{revealStartDate}</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography>{revealEndDate}</Typography>
					</Grid>
				</Grid>

				{_get(poll, pollChainIDPath) && (
					<Grid item xs={12} container>
						<Grid item xs={3} className={classes.smallGridColumn}>
							<Typography gutterBottom>Poll Chain ID:</Typography>
						</Grid>
						<Grid item xs={9}>
							<Typography>
								{_get(poll, pollChainIDPath)}
								&nbsp;
								<a
									target="_blank"
									rel="noopener noreferrer"
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
				{_get(poll, pollAdminIDPath) && (
					<Grid item xs={12} container>
						<Grid item xs={3} className={classes.smallGridColumn}>
							<Typography gutterBottom>Poll Admin ID:</Typography>
						</Grid>
						<Grid item xs={9}>
							<Typography>
								{_get(poll, pollAdminIDPath)}
								&nbsp;
								<a
									target="_blank"
									rel="noopener noreferrer"
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
				{_get(poll, protocolVersionPath) && (
					<Grid item xs={12} container>
						<Grid item xs={3} className={classes.smallGridColumn}>
							<Typography gutterBottom>Protocol Version:</Typography>
						</Grid>
						<Grid item xs={9}>
							<Typography>{_get(poll, protocolVersionPath)}</Typography>
						</Grid>
					</Grid>
				)}
				<Grid item xs={12}>
					<br />
					<SectionHeader text="Question" />
				</Grid>
				{_get(poll, hrefPath) && (
					<Grid container item xs={12}>
						<Grid item xs={3} className={classes.smallGridColumn}>
							<Typography gutterBottom>URL Link:</Typography>
						</Grid>
						<Grid item xs={9}>
							<a href={_get(poll, hrefPath)}>
								<Typography>{_get(poll, hrefPath)}</Typography>
							</a>
						</Grid>
						<Grid item xs={3} className={classes.smallGridColumn}>
							<Typography gutterBottom>Hash Algorithm:&nbsp;</Typography>
						</Grid>
						<Grid item xs={9}>
							<Typography>{_get(poll, hashAlgoPath)}</Typography>
						</Grid>
						<Grid item xs={3} className={classes.smallGridColumn}>
							<Typography gutterBottom>Hash Value:&nbsp;</Typography>
						</Grid>
						<Grid item xs={9}>
							<Typography>{_get(poll, hashValuePath)}</Typography>
						</Grid>
					</Grid>
				)}
				{_get(poll, textPath) && (
					<Grid container item xs={12}>
						<Typography gutterBottom>
							Question: {_get(poll, textPath)}
						</Typography>
					</Grid>
				)}

				<Grid item xs={12}>
					<br />
					<SectionHeader text="Answers" />
				</Grid>

				<Grid item xs={12}>
					<Paper elevation={1} className={classes.pad}>
						<Typography variant="subtitle1">Options</Typography>
						<Grid container spacing={24}>
							<Grid item xs={6}>
								<List dense>
									{_get(poll, optionsPath) &&
										_get(poll, optionsPath).map((option, index) => (
											<ListItem
												key={index}
												divider={index < _get(poll, optionsPath).length - 1}
											>
												<LabelImportant style={{ fontSize: 15 }} />
												<ListItemText primary={option} />
											</ListItem>
										))}
								</List>
							</Grid>
							<Grid item xs={6}>
								{(_get(poll, voteTypePath) === APPROVAL_CONFIG.type ||
									_get(poll, voteTypePath) === INSTANT_RUNOFF_CONFIG.type) && (
									<Grid container item xs={12}>
										<Grid item xs={12}>
											<Typography gutterBottom>
												Minimum Options Allowed:&nbsp;&nbsp;
												{_get(poll, minOptionsPath)}
											</Typography>
										</Grid>
										<Grid item xs={12}>
											<Typography gutterBottom>
												Maximum Options Allowed:&nbsp;
												{_get(poll, maxOptionsPath)}
											</Typography>
										</Grid>
									</Grid>
								)}
							</Grid>
						</Grid>
					</Paper>
				</Grid>

				<Grid item xs={12}>
					<br />
					<SectionHeader text="Winner Criteria" />
					<List dense>
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
								<Grid item xs={4}>
									<Grid container>
										{_get(poll, weightedMinSupportPath) && (
											<Grid item xs={12}>
												{!_get(poll, unweightedMinSupportPath) && <br />}
												<Typography style={{ display: 'inline' }}>
													Weighted Ratio:&nbsp;
													{_get(poll, weightedMinSupportPath)}
												</Typography>
											</Grid>
										)}
										{_get(poll, unweightedMinSupportPath) && (
											<Grid item xs={12}>
												{!_get(poll, weightedMinSupportPath) && <br />}
												<Typography style={{ display: 'inline' }}>
													Unweighted Ratio:&nbsp;
													{_get(poll, unweightedMinSupportPath)}
												</Typography>
											</Grid>
										)}
									</Grid>
								</Grid>
								<Grid item xs={4}>
									{_get(poll, voteTypePath) === 0 ? (
										<Typography>
											Applies to option: {minSupportOption}
										</Typography>
									) : (
										<Typography>Applies to all options</Typography>
									)}
								</Grid>
							</Grid>
						</ListItem>
					</List>
				</Grid>
				<Grid item xs={12}>
					<br />
					<SectionHeader text="Acceptance Criteria" />
					{hasMinTurnoutCritiera ? (
						<List dense>
							<ListItem>
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
									<Grid item xs={4}>
										<Grid container>
											{_get(poll, weightedMinTurnoutPath) && (
												<Grid item xs={12}>
													{!_get(poll, unweightedMinTurnoutPath) && <br />}
													<Typography style={{ display: 'inline' }}>
														Weighted Ratio:&nbsp;
														{_get(poll, weightedMinTurnoutPath)}
													</Typography>
												</Grid>
											)}
											{_get(poll, unweightedMinTurnoutPath) && (
												<Grid item xs={12}>
													{!_get(poll, weightedMinTurnoutPath) && <br />}
													<Typography style={{ display: 'inline' }}>
														Unweighted Ratio:&nbsp;
														{_get(poll, unweightedMinTurnoutPath)}
													</Typography>
												</Grid>
											)}
										</Grid>
									</Grid>
									<Grid item xs={4}>
										<Typography>Applies to all options</Typography>
									</Grid>
								</Grid>
							</ListItem>
						</List>
					) : (
						<div>
							<Typography>None</Typography>
							<br />
						</div>
					)}
				</Grid>
				{eligibleVoters && (
					<Grid item xs={12}>
						<EligibleVotersList eligibleVoters={eligibleVoters} />
					</Grid>
				)}
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
export default enhancer(VoteSummary);
