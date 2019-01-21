import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import _get from 'lodash/get';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import VoteTable from './VoteTable';
import Paper from '@material-ui/core/Paper';
import FilterList from '@material-ui/icons/FilterList';
import Grid from '@material-ui/core/Grid';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GET_LISTING = gql`
	query Listing(
		$limit: Int
		$offset: Int
		$title: String
		$status: String
		$voteInitiator: String
		$voteChain: String
		$voter: String
	) {
		allProposals(
			sort: "blockHeight"
			sortOrder: "DESC"
			registered: true
			limit: $limit
			offset: $offset
			title: $title
			status: $status
			voteInitiator: $voteInitiator
			voteChain: $voteChain
			voter: $voter
		) {
			listInfo
			voteList {
				admin {
					voteInitiator
				}
				proposal {
					title
				}
				vote {
					phasesBlockHeights {
						commitStart
						commitEnd
						revealEnd
					}
				}
				voteChainId
			}
		}
	}
`;

class VoteListing extends Component {
	state = {
		expanded: false,
		rowsPerPage: 5,
		page: 0,
		activeFilters: {
			title: '',
			status: '',
			initiatorId: '',
			pollChainId: '',
			voterId: '',
		},
		title: '',
		status: '',
		initiatorId: '',
		pollChainId: '',
		voterId: '',
	};

	handleFilterChange = (event) => {
		const target = event.target;
		const name = target.name;
		const value = name === 'title' ? target.value : target.value.trim();

		this.setState({ [name]: value });
	};

	filterTable = () => {
		this.handleExpand();

		this.setState({
			activeFilters: {
				title: this.state.title,
				status: this.state.status,
				initiatorId: this.state.initiatorId,
				pollChainId: this.state.pollChainId,
				voterId: this.state.voterId,
			},
			page: 0,
		});
	};

	resetFilters = () => {
		this.setState({
			activeFilters: {
				title: '',
				status: '',
				initiatorId: '',
				pollChainId: '',
				voterId: '',
			},
		});
	};

	toggleExpand = () => {
		this.setState((prevState) => {
			return {
				expanded: !prevState.expanded,
			};
		});
	};

	handleKeyPress = (event) => {
		if (event.which === 13 /* Enter */) {
			this.filterTable();
		}
	};

	handleExpand = () => {
		this.setState({
			expanded: true,
		});
	};

	handlePageChange = (page) => {
		this.setState({
			page,
		});
	};

	handleRowsPerPageChange = (rowsPerPage) => {
		this.setState({
			rowsPerPage,
			page: 0,
		});
	};

	render() {
		const { classes } = this.props;

		return (
			<form onKeyPress={this.handleKeyPress} className={classes.body}>
				<Paper className={classes.paper}>
					<Query
						query={GET_LISTING}
						variables={{
							limit: this.state.rowsPerPage,
							offset: this.state.rowsPerPage * this.state.page,
							title: this.state.activeFilters.title,
							status: this.state.activeFilters.status,
							voteInitiator: this.state.activeFilters.initiatorId,
							voteChain: this.state.activeFilters.pollChainId,
							voter: this.state.activeFilters.voterId,
						}}
					>
						{({ loading, error, data }) => {
							if (loading) return <PreLoadHeader message="Loading..." />;
							if (error) {
								return (
									<PreLoadHeader
										className={classes.errorText}
										message={'Error: ' + error.message}
									/>
								);
							}
							const totalCount = _get(data, 'allProposals.listInfo.totalCount');

							return (
								<>
									<Grid container direction="row">
										<Grid container item xs={3} className={classes.topFilters}>
											<Button
												onClick={this.filterTable}
												variant="outlined"
												color="primary"
												size="small"
											>
												<FilterList /> Advanced Search
											</Button>

											{this.state.expanded && (
												<>
													<Typography style={{ paddingTop: '10px' }}>
														Voter ID:&nbsp;
														<input
															type="text"
															name="voterId"
															value={this.state.voterId}
															onChange={this.handleFilterChange}
														/>
													</Typography>
												</>
											)}
										</Grid>
										<Grid item xs={6}>
											<Typography variant="h5" gutterBottom>
												Welcome to Factom On-Chain Voting
											</Typography>
										</Grid>
										<Grid item xs={3} />
									</Grid>
									<VoteTable
										data={data.allProposals}
										expanded={this.state.expanded}
										toggleExpand={this.toggleExpand}
										rowsPerPage={this.state.rowsPerPage}
										handleRowsPerPageChange={this.handleRowsPerPageChange}
										count={totalCount}
										page={this.state.page}
										handlePageChange={this.handlePageChange}
										handleFilterChange={this.handleFilterChange}
										filterTable={this.filterTable}
										title={this.state.title}
										status={this.state.status}
										initiatorId={this.state.initiatorId}
										pollChainId={this.state.pollChainId}
									/>
								</>
							);
						}}
					</Query>
				</Paper>
				<br />
			</form>
		);
	}
}

const PreLoadHeader = (props) => {
	return (
		<Grid container direction="row">
			<Grid item xs={3} />
			<Grid item xs={6}>
				<Typography variant="h5" gutterBottom>
					Welcome to Factom On-Chain Voting
				</Typography>
			</Grid>
			<Grid item xs={3} />
			<Grid item xs={12}>
				<Typography className={props.className}>{props.message}</Typography>
			</Grid>
		</Grid>
	);
};

VoteListing.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	body: {
		textAlign: 'center',
		margin: '0 auto',
		marginTop: '20px',
	},
	form: {
		textAlign: 'left',
	},
	paper: {
		padding: '15px',
	},
	topFilters: {},
	errorText: { color: 'red' },
});

export default withStyles(styles)(VoteListing);

/*
const GET_VOTERS = gql`
	query Voters($chain: String!) {
		eligibleVoters(chain: $chain) {
			voters
		}
	}
`;

const ExchangeRates = ({
	chain = '84444341e0e60a496f75c98c57357805ec86e9f8e232348f1e60704e83bca2b0',
}) => (
	<Query query={GET_VOTERS} variables={{ chain }}>
		{({ loading, error, data }) => {
			if (loading) return <p>Loading...</p>;
			if (error) return <p>Error :(</p>;

			const voterList = data.eligibleVoters.voters.map((voter_o, index) => (
				<li key={index}>
					Voter ID: {voter_o.voterId}
					<br />
					Voter Weight: {voter_o.weight}
				</li>
			));

			return (
				<div>
					hi<ul>{voterList}</ul>
				</div>
			);
		}}
	</Query>
);
*/
