import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import _flowRight from 'lodash/flowRight';
import _isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { POLL_STATUSES } from '../create/VOTE_CONSTANTS';
import { withVote } from '../../context/VoteContext';

/**
 * Constants
 */
const RPP_OPTIONS = [5, 10, 25, 50];

let id = 0;
const createRow = (
	voteID,
	adminID,
	title,
	status,
	commitPhase,
	revealPhase
) => {
	id += 1;
	return { id, voteID, adminID, title, status, commitPhase, revealPhase };
};

class VoteTable extends React.Component {
	render() {
		const {
			classes,
			data,
			title,
			status,
			initiatorId,
			pollChainId,
			handleFilterChange,
			filterTable,
			voteController: { getPollStatus },
		} = this.props;
		const expanded = this.props.expanded;

		let tableRows = [];

		data.voteList.forEach((poll_o) => {
			const row = createRow(
				poll_o.voteChainId,
				poll_o.admin.voteInitiator,
				poll_o.proposal.title,
				getPollStatus(poll_o.vote.phasesBlockHeights).displayValue,
				<span>
					{poll_o.vote.phasesBlockHeights.commitStart +
						' - ' +
						poll_o.vote.phasesBlockHeights.commitEnd}
				</span>,
				<span>
					{poll_o.vote.phasesBlockHeights.commitEnd +
						1 +
						' - ' +
						poll_o.vote.phasesBlockHeights.revealEnd}
				</span>
			);
			tableRows.push(row);
		});

		return (
			<Grid container>
				<Grid item xs={12} className={classes.tableWrapper}>
					<Table>
						<TableHead>
							<TableRow>
								<th className={classes.expandColumn}>
									{expanded ? (
										<ExpandLess
											style={{ cursor: 'pointer' }}
											titleAccess="Collapse Table"
											onClick={this.props.toggleExpand}
											title="Collapse Table"
											className={classes.expandIcon}
										/>
									) : (
										<ExpandMore
											style={{ cursor: 'pointer' }}
											titleAccess="Expand Table"
											onClick={this.props.toggleExpand}
											title="Expand Table"
											className={classes.expandIcon}
										/>
									)}
								</th>
								<TableCell
									className={`${classes.titleColumn} ${classes.columnHeader}`}
								>
									Title
									{expanded && (
										<span>
											<br />
											<input
												name="title"
												type="text"
												value={title}
												onChange={handleFilterChange}
											/>
										</span>
									)}
								</TableCell>
								<TableCell
									className={`${classes.statusColumn} ${classes.columnHeader}`}
								>
									Status
									{expanded && (
										<span>
											<br />
											<select
												name="status"
												value={status}
												onChange={async (e) => {
													await handleFilterChange(e);
													filterTable();
												}}
											>
												<option defaultValue value="" />
												{Object.values(POLL_STATUSES).map((option_o, index) => {
													return (
														<option key={index} value={option_o.value}>
															{option_o.displayValue}
														</option>
													);
												})}
											</select>
										</span>
									)}
								</TableCell>
								<TableCell
									className={`${classes.dateColumn} ${classes.columnHeader}`}
								>
									Commit Phase
								</TableCell>
								<TableCell
									className={`${classes.dateColumn} ${classes.columnHeader}`}
								>
									Reveal Phase
								</TableCell>
								{expanded ? (
									<TableCell
										className={`${classes.pollChainIDColumn} ${
											classes.columnHeader
										}`}
									>
										Poll Chain ID
										<br />
										<input
											type="text"
											name="pollChainId"
											value={pollChainId}
											onChange={handleFilterChange}
										/>
									</TableCell>
								) : (
									<TableCell
										className={`${classes.shortPollChainIDColumn} ${
											classes.columnHeader
										}`}
									>
										Poll Chain ID
									</TableCell>
								)}
								{expanded ? (
									<TableCell
										className={`${classes.adminIDColumn} ${
											classes.columnHeader
										}`}
									>
										Poll Initiator ID
										<br />
										<input
											type="text"
											name="initiatorId"
											value={initiatorId}
											onChange={handleFilterChange}
										/>
									</TableCell>
								) : (
									<TableCell
										className={`${classes.shortAdminIDColumn} ${
											classes.columnHeader
										}`}
									>
										Poll Initiator ID
									</TableCell>
								)}
							</TableRow>
						</TableHead>
						<TableBody>
							{_isEmpty(tableRows) && (
								<TableRow>
									<td className={classes.expandColumn} />
									<TableCell>
										<Typography>No Matching Results</Typography>
									</TableCell>
									<TableCell />
									<TableCell />
									<TableCell />
									<TableCell />
									<TableCell />
								</TableRow>
							)}
							{tableRows.map((row) => {
								return (
									<TableRow key={row.id} hover={true}>
										<td className={classes.expandColumn} />
										<TableCell className={classes.titleColumn}>
											<Link to={'/viewVote?id=' + row.voteID}>{row.title}</Link>
										</TableCell>
										<TableCell className={classes.statusColumn}>
											{row.status}
										</TableCell>
										<TableCell className={classes.dateColumn}>
											<div style={{ width: '104px' }}>{row.commitPhase}</div>
										</TableCell>
										<TableCell className={classes.dateColumn}>
											<div style={{ width: '104px' }}>{row.revealPhase}</div>
										</TableCell>
										{expanded ? (
											<TableCell className={classes.pollChainIDColumn}>
												{row.voteID}
											</TableCell>
										) : (
											<TableCell className={classes.shortPollChainIDColumn}>
												{row.voteID}
											</TableCell>
										)}
										{expanded ? (
											<TableCell className={classes.adminIDColumn}>
												{row.adminID}
											</TableCell>
										) : (
											<TableCell className={classes.shortAdminIDColumn}>
												{row.adminID}
											</TableCell>
										)}
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</Grid>
				<Grid item xs={2}>
					<TablePagination
						component={Grid}
						onChangePage={(event, page) => {
							this.props.handlePageChange(page);
						}}
						onChangeRowsPerPage={(e) => {
							this.props.handleRowsPerPageChange(e.target.value);
						}}
						count={this.props.count}
						rowsPerPage={this.props.rowsPerPage}
						rowsPerPageOptions={RPP_OPTIONS}
						page={this.props.page}
					/>
				</Grid>
			</Grid>
		);
	}
}

VoteTable.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	tableWrapper: {
		overflowX: 'auto',
	},
	titleColumn: {
		minWidth: '252',
		paddingRight: '1px',
	},
	adminIDColumn: {
		paddingRight: '0px',
	},
	shortAdminIDColumn: {
		maxWidth: '207px',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		paddingRight: '0px',
	},
	shortPollChainIDColumn: {
		maxWidth: '207px',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		paddingRight: '0px',
	},
	pollChainIDColumn: {
		paddingRight: '0px',
	},
	statusColumn: {
		maxWidth: '165px',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	dateColumn: {
		maxWidth: '129px',
		paddingRight: '1px',
	},
	expandIcon: {
		margin: '-5px',
	},
	expandColumn: {
		maxWidth: '3px',
	},
	footerPagination: {
		maxWidth: '345px',
	},
	columnHeader: {
		fontSize: '13px',
	},
});

const enhancer = _flowRight(withVote, withStyles(styles));
export default enhancer(VoteTable);
