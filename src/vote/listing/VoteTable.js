import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
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
		const { classes, data } = this.props;
		const expanded = this.props.expanded;
		console.log('Vote Table Data');
		console.log(data.allProposals.voteList);
		let tableRows = [];

		data.allProposals.voteList.map((voteList_o, index) => {
			const row = createRow(
				voteList_o.voteChainId,
				voteList_o.admin.voteInitiator,
				voteList_o.proposal.title,
				'status',
				<span>
					{'Start: ' + voteList_o.vote.phasesBlockHeights.commitStart}
					<br />
					{'End: ' + voteList_o.vote.phasesBlockHeights.commitStop}
				</span>,
				<span>
					{'Start: ' + voteList_o.vote.phasesBlockHeights.revealStart}
					<br />
					{'End: ' + voteList_o.vote.phasesBlockHeights.reavealStop}
				</span>
			);
			tableRows.push(row);
		});

		console.log(tableRows);

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
											titleAccess="Collapse"
											onClick={this.props.toggleExpand}
											title="Collapse Row"
											className={classes.expandIcon}
										/>
									) : (
										<ExpandMore
											style={{ cursor: 'pointer' }}
											titleAccess="Expand"
											onClick={this.props.toggleExpand}
											title="Expand Row"
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
											<input type="text" />
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
											<select>
												<option defaultValue value="" />
												<option>Discussion Phase</option>
												<option>Commit Phase</option>
												<option>Reveal Phase</option>
												<option>Complete</option>
												<option>Invalidated</option>
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
										<input type="text" />
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
										Poll Admin ID
										<br />
										<input type="text" />
									</TableCell>
								) : (
									<TableCell
										className={`${classes.shortAdminIDColumn} ${
											classes.columnHeader
										}`}
									>
										Poll Admin ID
									</TableCell>
								)}
							</TableRow>
						</TableHead>
						<TableBody>
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
						onChangePage={() => {}}
						count={tableRows.length}
						rowsPerPage={25}
						page={0}
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
		//width: '100%',
		overflowX: 'auto',
	},
	table: {
		//minWidth: 750,
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

export default withStyles(styles)(VoteTable);
