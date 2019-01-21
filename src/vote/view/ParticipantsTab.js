import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import _flowRight from 'lodash/flowRight';
import _isEmpty from 'lodash/isEmpty';
import _isNil from 'lodash/isNil';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Done from '@material-ui/icons/Done';
import Close from '@material-ui/icons/Close';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import { withNetwork } from '../../context/NetworkContext';
import ExplorerLink from '../shared/ExplorerLink';
import { POLL_STATUSES } from '../create/VOTE_CONSTANTS';
import OpenInNew from '@material-ui/icons/OpenInNew';

const createVoterRow = (voterID, commit, reveal, weight) => {
	return { voterID, commit, reveal, weight };
};

class ParticipantsTab extends React.Component {
	state = {
		expand: false,
	};

	toggleExpand = () => {
		this.setState((prevState) => ({
			expand: !prevState.expand,
		}));
	};

	render() {
		const {
			classes,
			eligibleVotersChainId,
			proposalEntries,
			status_o,
			networkController: { networkProps },
		} = this.props;

		const entryHashURL = networkProps.explorerURL + '/entry?hash=';

		let tableRows = [];

		proposalEntries.forEach((voter_o) => {
			const row = createVoterRow(
				voter_o.voterId,
				voter_o.commit,
				voter_o.reveal,
				voter_o.weight
			);
			tableRows.push(row);
		});

		return (
			<div className={classes.tableWrapper}>
				<Grid item xs={12} container className={classes.voterChain}>
					<ExplorerLink
						label="Eligible Voters Chain"
						value={eligibleVotersChainId}
						href={
							networkProps.explorerURL +
							'/data?type=chain&key=' +
							eligibleVotersChainId
						}
					/>
				</Grid>

				<Table>
					<TableHead>
						<TableRow>
							<th className={classes.expandColumn}>
								{this.state.expand ? (
									<ExpandLess
										style={{ cursor: 'pointer' }}
										onClick={this.toggleExpand}
										titleAccess="Collapse Table"
									/>
								) : (
									<ExpandMore
										style={{ cursor: 'pointer' }}
										onClick={this.toggleExpand}
										titleAccess="Expand Table"
									/>
								)}
							</th>
							{this.state.expand ? (
								<TableCell>Voter ID</TableCell>
							) : (
								<TableCell className={classes.chainIDColumn}>
									Voter ID
								</TableCell>
							)}

							<TableCell>Commit</TableCell>
							<TableCell>Reveal</TableCell>
							<TableCell>Weight</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{_isEmpty(tableRows) && (
							<TableRow>
								<td className={classes.expandColumn} />
								<TableCell>
									<Typography>No Eligible Voters</Typography>
								</TableCell>
								<TableCell />
								<TableCell />
								<TableCell />
							</TableRow>
						)}
						{tableRows.map((row) => {
							return (
								<TableRow key={row.voterID}>
									<td className={classes.expandColumn} />
									{this.state.expand ? (
										<TableCell>{row.voterID}</TableCell>
									) : (
										<TableCell className={classes.chainIDColumn}>
											{row.voterID}
										</TableCell>
									)}
									<TableCell style={{ minWidth: 131 }}>
										{!_isNil(row.commit) && (
											<Grid container alignItems="flex-end">
												<Done
													style={{ color: 'green', display: 'inline-block' }}
													fontSize="large"
												/>
												<a
													style={{ display: 'inline-block' }}
													target="_blank"
													rel="noopener noreferrer"
													href={entryHashURL + row.commit}
												>
													<OpenInNew
														color="primary"
														className={classes.openInNew}
													/>
												</a>
											</Grid>
										)}

										{_isNil(row.commit) &&
											(status_o.value === POLL_STATUSES['reveal'].value ||
												status_o.value === POLL_STATUSES['complete'].value) && (
												<Close color="secondary" />
											)}
									</TableCell>
									<TableCell style={{ minWidth: 131 }}>
										{!_isNil(row.reveal) && (
											<Grid container alignItems="flex-end">
												<Done
													style={{ color: 'green', display: 'inline-block' }}
													fontSize="large"
												/>
												<a
													style={{ display: 'inline-block' }}
													target="_blank"
													rel="noopener noreferrer"
													href={entryHashURL + row.reveal}
												>
													<OpenInNew
														color="primary"
														className={classes.openInNew}
													/>
												</a>
											</Grid>
										)}

										{_isNil(row.reveal) &&
											status_o.value === POLL_STATUSES['complete'].value && (
												<Close color="secondary" />
											)}
									</TableCell>
									<TableCell>{row.weight}</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		);
	}
}

ParticipantsTab.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	tableWrapper: {
		overflowX: 'auto',
	},
	expandColumn: {
		maxWidth: '3px',
	},
	chainIDColumn: {
		maxWidth: '265px',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	errorText: {
		color: 'red',
	},
	voterChain: {
		paddingTop: '20px',
		paddingLeft: '5px',
	},
	openInNew: { fontSize: 15 },
});

const enhancer = _flowRight(withNetwork, withStyles(styles));
export default enhancer(ParticipantsTab);
