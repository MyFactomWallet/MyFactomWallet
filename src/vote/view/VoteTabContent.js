import React from 'react';
import _flowRight from 'lodash/flowRight';
import { withStyles } from '@material-ui/core/styles';
import CommitVoteForm from './CommitVoteForm';
import RevealVoteForm from './RevealVoteForm';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import QS from 'qs';
import VoteSummary from '../shared/VoteSummary';
import ParticipantsTab from './ParticipantsTab';
import VoteResult from './VoteResult';
import { withVote } from '../../context/VoteContext';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import SectionHeader from '../shared/SectionHeader';

const GET_VOTE = gql`
	query Vote($chain: String!) {
		proposal(chain: $chain) {
			voteChainId

			admin {
				voteInitiator
				protocolVersion
			}

			proposal {
				title
				text
				externalRef
			}

			vote {
				phasesBlockHeights {
					commitStart
					commitEnd
					revealEnd
				}
				eligibleVotersChainId
				type
				config {
					options
					allowAbstention
					computeResultsAgainst
					minOptions
					maxOptions
					winnerCriteria
					acceptanceCriteria
				}
			}
		}
	}
`;

const GET_RESULT = gql`
	query Result($voteChain: String!) {
		result(voteChain: $voteChain) {
			abstain
			chainId
			invalidReason
			options
			support
			total
			turnout
			valid
			voted
			weightedWinners
		}
	}
`;

const GET_VOTERS = gql`
	query Voters($chain: String!) {
		proposalEntries(chain: $chain) {
			voterId
			commit
			reveal
			weight
			# entryHash
		}
	}
`;

class VoteTabContent extends React.Component {
	state = {
		tabValue: 0,
	};

	handleTabChange = (event, value) => {
		this.setState({ tabValue: value });
	};

	render() {
		const {
			classes,
			voteController: { getPollStatus },
		} = this.props;

		const pollChainId = QS.parse(this.props.location.search)['?id'];

		return (
			<Grid container spacing={24}>
				<Grid item xs={2} />
				<Grid item xs={8}>
					<Paper className={classes.pad}>
						<Query
							query={GET_VOTE}
							variables={{
								chain: pollChainId,
							}}
						>
							{({ loading, error, data }) => {
								if (loading) return <PreLoadHeader message="Loading..." />;
								if (error)
									return (
										<PreLoadHeader
											className={classes.errorText}
											message={'Error: ' + error.message}
										/>
									);

								const poll_o = data.proposal;

								const status_o = getPollStatus(poll_o.vote.phasesBlockHeights);

								return (
									<Query
										query={GET_VOTERS}
										variables={{
											chain: poll_o.voteChainId,
										}}
									>
										{({ loading, error, data }) => {
											if (loading)
												return <PreLoadHeader message="Loading..." />;
											if (error)
												return (
													<PreLoadHeader
														className={classes.errorText}
														message={'Error: ' + error.message}
													/>
												);

											const proposalEntries_o = data.proposalEntries;

											return (
												<Grid container>
													<Grid item xs={12}>
														<Typography
															align="center"
															gutterBottom
															variant="h6"
														>
															{poll_o.proposal.title}
														</Typography>
													</Grid>
													<Grid item xs={12}>
														<Paper className={classes.pad}>
															{status_o.value === 'complete' ? (
																<SectionHeader
																	text="Poll Complete"
																	color="green"
																	disableGutterBottom
																/>
															) : (
																<>
																	<Typography
																		style={{
																			display: 'inline',
																			fontWeight: 500,
																		}}
																		gutterBottom
																	>
																		Status:&nbsp;
																	</Typography>
																	<Typography style={{ display: 'inline' }}>
																		{status_o.displayValue}
																	</Typography>
																</>
															)}

															{status_o.value === 'complete' && (
																<Query
																	query={GET_RESULT}
																	variables={{
																		voteChain: poll_o.voteChainId,
																	}}
																>
																	{({ loading, error, data }) => {
																		if (loading)
																			return (
																				<Typography>
																					Loading result...
																				</Typography>
																			);
																		if (error)
																			return (
																				<Typography
																					className={classes.errorText}
																				>
																					Error loading result: {error.message}
																				</Typography>
																			);

																		return <VoteResult result={data.result} />;
																	}}
																</Query>
															)}
														</Paper>
														<br />
													</Grid>
													<Grid item xs={12}>
														<Paper className={classes.pad}>
															<Tabs
																value={this.state.tabValue}
																onChange={this.handleTabChange}
																indicatorColor="primary"
																textColor="primary"
																centered
															>
																<Tab label="Poll Configuration" />
																<Tab label="View Voters" />
																{status_o.value === 'commit' && (
																	<Tab label="Commit Vote" />
																)}
																{status_o.value === 'reveal' && (
																	<Tab label="Reveal Vote" />
																)}
															</Tabs>
															{this.state.tabValue === 0 && (
																<Grid container className={classes.pad}>
																	<VoteSummary poll={{ pollJSON: poll_o }} />
																</Grid>
															)}
															{this.state.tabValue === 1 && (
																<ParticipantsTab
																	eligibleVotersChainId={
																		poll_o.vote.eligibleVotersChainId
																	}
																	proposalEntries={proposalEntries_o}
																	status_o={status_o}
																/>
															)}
															{this.state.tabValue === 2 &&
																status_o.value === 'commit' && (
																	<CommitVoteForm
																		poll={{ pollJSON: poll_o }}
																		proposalEntries={proposalEntries_o}
																	/>
																)}
															{this.state.tabValue === 2 &&
																status_o.value === 'reveal' && (
																	<RevealVoteForm poll={poll_o} />
																)}
														</Paper>
													</Grid>
												</Grid>
											);
										}}
									</Query>
								);
							}}
						</Query>
					</Paper>
				</Grid>

				<Grid item xs={2} />
			</Grid>
		);
	}
}

const PreLoadHeader = (props) => {
	return (
		<Grid container justify="center">
			<Typography className={props.className}>{props.message}</Typography>
		</Grid>
	);
};

VoteTabContent.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	pad: {
		padding: 15,
	},
	smallGridColumn: {
		flexBasis: '19%',
	},
	errorText: {
		color: 'red',
	},
});

const enhancer = _flowRight(withVote, withStyles(styles));
export default enhancer(VoteTabContent);
