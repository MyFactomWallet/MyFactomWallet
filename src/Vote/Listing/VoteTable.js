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
const createData = (
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

const rows = [
	createData(
		'e62aeaad853809e0a6901faa7698d305b5927fe9aeffff9fa233f3367629f098',
		'9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08',

		'Discussion Phase Example',
		'Discussion Phase',
		<span>
			Start: 08/22/2018
			<br />
			End: 08/30/2018
		</span>,
		<span>
			Start: 09/01/2018
			<br />
			End: 09/15/2018
		</span>
	),

	createData(
		'c12941cbe6be9ae67caa3a34e2298bdf1b2feebe67a7144a40064aef908686b4',
		'60303AE22B998861BCE3B28F33EEC1BE758A213C86C93C076DBE9F558C11C752',
		'Commit Phase Example',
		'Commit Phase',
		<span>
			Start: 08/22/2018
			<br />
			End: 08/30/2018
		</span>,
		<span>
			Start: 09/01/2018
			<br />
			End: 09/15/2018
		</span>
	),
	createData(
		'872963d936f10cfefffae3d478d98730e1c2c731c703af2ea58710dfc5c9f45c',
		'60303AE22B998861BCE3B28F33EEC1BE758A213C86C93C076DBE9F558C11C752',

		'Reveal Phase Example',
		'Reveal Phase',
		<span>
			Start: 08/22/2018
			<br />
			End: 08/30/2018
		</span>,
		<span>
			Start: 09/01/2018
			<br />
			End: 09/15/2018
		</span>
	),
	createData(
		'71a7fc2f9e956515b2f2d43d6df67d2213fd5fe4cd37e477f8b9d6344120508f',
		'2F110B81263414DFA03211351D7D2D3FFBCB7E1C4D699B3626ED520C6CD9738B',

		'Completed Example',
		'Completed',

		<span>
			Start: 08/22/2018
			<br />
			End: 08/30/2018
		</span>,
		<span>
			Start: 09/01/2018
			<br />
			End: 09/15/2018
		</span>
	),
	createData(
		'dc1da9c406f1fa6a382840c1e268e25f083e66897dc8645aa337e2fc2e6f5424',
		'DB90FFB7EAFF3C3DF027777F4B2C0D426000FDCBAA7097712408E1DBD955067A',
		'Invalidated Example',
		'Invalidated',
		<span>
			Start: 08/22/2018
			<br />
			End: 08/30/2018
		</span>,
		<span>
			Start: 09/01/2018
			<br />
			End: 09/15/2018
		</span>
	),
];

class VoteTable extends React.Component {
	render() {
		const { classes } = this.props;
		const expanded = this.props.expanded;

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
										{/* <br />
										<input type="text" /> */}
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
										{/* <br />
										<input type="text" /> */}
									</TableCell>
								)}
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((row) => {
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
						count={rows.length}
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
