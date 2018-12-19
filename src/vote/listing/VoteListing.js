import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import VotesTable from './VoteTable';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import FilterList from '@material-ui/icons/FilterList';
import Grid from '@material-ui/core/Grid';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GET_LISTING = gql`
	query Listing($limit: Int) {
		allProposals(limit: $limit) {
			listInfo
			voteList {
				admin {
					voteInitiator
				}
				proposal {
					title
				}
				vote {
					phasesBlockHeights
				}
				voteChainId
			}
		}
	}
`;

class VoteListing extends Component {
	state = { expanded: false };

	toggleExpand = () => {
		this.setState((prevState) => ({
			expanded: !prevState.expanded,
		}));
	};

	handleExpand = () => {
		this.setState({
			expanded: true,
		});
	};

	render() {
		const { classes } = this.props;

		const limit = 10;

		return (
			<div className={classes.body}>
				<Paper className={classes.paper}>
					<Query query={GET_LISTING} variables={{ limit }}>
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
							return (
								<>
									<Grid container direction="row">
										<Grid item xs={3} className={classes.topFilters}>
											<Typography style={{ textAlign: 'left' }}>
												Voter ID: <input type="text" />
											</Typography>
											<Typography style={{ textAlign: 'left' }}>
												Protocol Polls Only:
												<Switch
													defaultChecked
													value="checkedF"
													color="primary"
												/>
											</Typography>
										</Grid>
										<Grid item xs={6}>
											<Typography variant="h5" gutterBottom>
												Welcome to Factom On-Chain Voting
											</Typography>
										</Grid>
										<Grid item xs={2} />
										<Grid item xs={1}>
											<Grid style={{ paddingTop: '20px' }} item xs={2}>
												<Button
													onClick={this.handleExpand}
													variant="outlined"
													color="primary"
													size="small"
												>
													<FilterList /> Filter
												</Button>
											</Grid>
										</Grid>
									</Grid>
									<VotesTable
										data={data}
										expanded={this.state.expanded}
										toggleExpand={this.toggleExpand}
									/>
								</>
							);
						}}
					</Query>
				</Paper>
				<br />
			</div>
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
	topFilters: {
		top: '14px',
		position: 'relative',
		left: '8px',
	},
	errorText: { color: 'red' },
});

export default withStyles(styles)(VoteListing);
