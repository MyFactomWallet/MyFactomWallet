import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Done from '@material-ui/icons/Done';
import Close from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import OpenInNew from '@material-ui/icons/OpenInNew';
import { Link } from 'react-router-dom';
import QS from 'qs';
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';
import VoteSummary from '../Shared/VoteSummary';
import SignVote from '../Shared/SignVote';

let id = 0;
const createVoterData = (voterID, commit, reveal, role, vote) => {
	id += 1;
	return { id, voterID, commit, reveal, role, vote };
};

const voterRows = [
	createVoterData(
		'Factom Inc',
		true,
		null,
		<div>
			Guide
			<br />
			ANO
		</div>,
		null
	),
	createVoterData('LUCIAP', true, null, 'ANO', null),
	createVoterData(
		'60303AE22B998861BCE3B28F33EEC1BE758A213C86C93C076DBE9F558C11C752',
		true,
		null,
		'',
		null
	),
	createVoterData('The 42nd Factoid', '', null, 'Guide', false),
	createVoterData(
		'872963d936f10cfefffae3d478d98730e1c2c731c703af2ea58710dfc5c9f45c',
		true,
		null,
		'',
		null
	),
];

class ViewVote extends React.Component {
	state = {
		tabValue: 0,
		poll: {
			title: 'This Is The Poll Title',
			type: 'Single Option Voting',
			href:
				'https://raw.githubusercontent.com/JacobEberhardt/ZoKrates/aa7e11/README.md',
			hash: 'F30A765AD6C5777E82EB2B64CFA53CDBB08D435546DD351880C13691867290B4',
			commitStartDate: '09/10/2018',
			commitEndDate: '09/11/2018',
			revealStartDate: '09/12/2018',
			revealEndDate: '09/13/2018',
			minTurnout: false,
			minSupport: false,
			protocolVersion: 'v0.1',
			pollAdminID:
				'888888655866a003faabd999c7b0a7c908af17d63fd2ac2951dc99e1ad2a14f4',
			pollChainID: QS.parse(this.props.location.search)['?id'],
		},
		expand: false,
	};

	toggleExpand = () => {
		this.setState((prevState) => ({
			expand: !prevState.expand,
		}));
	};

	handleTabChange = (event, value) => {
		this.setState({ tabValue: value });
	};

	render() {
		const { classes } = this.props;

		return (
			<Grid container spacing={24}>
				<Grid item xs={2} />
				<Grid item xs={8}>
					<Paper className={classes.pad}>
						<Grid container>
							<Grid item xs={12}>
								<Typography align="center" gutterBottom variant="title">
									View Poll: {this.state.poll.title}
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<Paper className={classes.pad}>
									<Typography
										style={{ display: 'inline' }}
										variant="body2"
										gutterBottom
									>
										Status:&nbsp;
									</Typography>
									<Typography style={{ display: 'inline' }}>
										Commit Phase
									</Typography>
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
										<Tab label="View Details" />
										<Tab label="View Voters" />
										<Tab label="Cast Vote" />
									</Tabs>
									{this.state.tabValue === 0 && (
										<Grid container className={classes.pad}>
											<VoteSummary
												className={classes.pad}
												poll={this.state.poll}
											/>
										</Grid>
									)}
									{this.state.tabValue === 1 && (
										<div>
											<Link
												target="_blank"
												to={
													'/manageVoters?voterChainID=df3ade9eec4b08d5379cc64270c30ea7315d8a8a1a69efe2b98a60ecdd69e604'
												}
											>
												<Button size="small" variant="outlined">
													Manage Voter List&nbsp;
													<OpenInNew />
												</Button>
											</Link>
											<div className={classes.tableWrapper}>
												<Table>
													<TableHead>
														<TableRow>
															<th className={classes.expandColumn}>
																{this.state.expand ? (
																	<Remove
																		style={{ cursor: 'pointer' }}
																		onClick={this.toggleExpand}
																		titleAccess="Collapse"
																	/>
																) : (
																	<Add
																		style={{ cursor: 'pointer' }}
																		onClick={this.toggleExpand}
																		titleAccess="Expand"
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
															<TableCell>Vote</TableCell>
															<TableCell>Role</TableCell>
														</TableRow>
													</TableHead>
													<TableBody>
														{voterRows.map((row) => {
															return (
																<TableRow key={row.voterID}>
																	<td className={classes.expandColumn} />
																	{this.state.expand ? (
																		<TableCell>{row.voterID}</TableCell>
																	) : (
																		<TableCell
																			className={classes.chainIDColumn}
																		>
																			{row.voterID}
																		</TableCell>
																	)}
																	<TableCell>
																		{Boolean(row.commit) &&
																		row.voterID !== 127867674886783419 ? (
																			<Done color="primary" />
																		) : (
																			''
																		)}
																	</TableCell>
																	<TableCell>
																		{Boolean(row.reveal) &&
																			row.voterID !== 127867674886783419 && (
																				<Done color="primary" />
																			)}
																		{row.voterID === 127867674886783419 && (
																			<Close color="secondary" />
																		)}
																	</TableCell>
																	<TableCell>
																		{Boolean(row.vote) &&
																		row.voterID !== 127867674886783419 ? (
																			<Typography>{row.vote}</Typography>
																		) : (
																			<Typography>{row.vote}</Typography>
																		)}
																		{row.voterID === 127867674886783419 && (
																			<Close color="secondary" />
																		)}
																	</TableCell>
																	<TableCell>{row.role}</TableCell>
																</TableRow>
															);
														})}
													</TableBody>
												</Table>
											</div>
										</div>
									)}
									{this.state.tabValue === 2 && (
										<Grid container className={classes.pad}>
											<Grid item xs={12}>
												<br />
												<Typography gutterBottom variant="title">
													Question
												</Typography>
											</Grid>
											<Grid item xs={2} className={classes.smallGridColumn}>
												<Typography gutterBottom>URL Link:</Typography>
											</Grid>
											<Grid item xs={10}>
												<a href="https://raw.githubusercontent.com/JacobEberhardt/ZoKrates/aa7e11/README.md">
													<Typography>
														https://raw.githubusercontent.com/JacobEberhardt/ZoKrates/aa7e11/README.md
													</Typography>
												</a>
											</Grid>
											<Grid item xs={12}>
												<br />
												<Typography gutterBottom variant="title">
													Answer
												</Typography>
											</Grid>
											<Grid item xs={12}>
												<select>
													<option selected disabled hidden>
														Choose an Answer
													</option>
													<option>True</option>
													<option>False</option>
												</select>
											</Grid>
											<Grid item xs={12}>
												<br />
												<Typography gutterBottom variant="title">
													Sign Transaction
												</Typography>
											</Grid>
											<Grid xs={2} item>
												<Typography gutterBottom>Voter ID:</Typography>
											</Grid>
											<Grid xs={10} item>
												<input type="text" />
											</Grid>
											<Grid xs={2} item>
												<Typography gutterBottom>Signature:</Typography>
											</Grid>
											<Grid xs={10} item>
												<input type="password" />
											</Grid>
											<Grid xs={2} item>
												<Typography gutterBottom>EC Private Key:</Typography>
											</Grid>
											<Grid xs={10} item>
												<input type="password" />
											</Grid>
											<Grid item xs={12}>
												<SignVote />
											</Grid>
											<Grid item xs={12}>
												<br />
												<Button
													variant="raised"
													color="primary"
													onClick={this.handleNext}
												>
													Submit Vote
												</Button>
											</Grid>
										</Grid>
									)}
								</Paper>
							</Grid>
						</Grid>
					</Paper>
				</Grid>

				<Grid item xs={2} />
			</Grid>
		);
	}
}

ViewVote.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	pad: {
		padding: 15,
	},
	tableWrapper: {
		//width: '100%',
		overflowX: 'auto',
	},
	smallGridColumn: {
		flexBasis: '19%',
	},
	expandColumn: {
		maxWidth: '3px',
	},
	chainIDColumn: {
		maxWidth: '265px',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
});

export default withStyles(styles)(ViewVote);
