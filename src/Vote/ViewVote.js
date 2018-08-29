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
import Info from '@material-ui/icons/InfoOutlined';

let id = 0;
const createVoterData = (voterID, commit, reveal, role, vote) => {
	id += 1;
	return { id, voterID, commit, reveal, role, vote };
};

const voterRows = [
	createVoterData(
		'Factom Inc',
		true,
		true,
		<div>
			Guide
			<br />
			ANO
		</div>,
		'A'
	),
	createVoterData('LUCIAP', true, null, 'ANO', null),
	createVoterData(
		'60303AE22B998861BCE3B28F33EEC1BE758A213C86C93C076DBE9F558C11C752',
		true,
		true,
		'',
		'A'
	),
	createVoterData('The 42nd Factoid', false, false, 'Guide', false),
	createVoterData(
		'872963d936f10cfefffae3d478d98730e1c2c731c703af2ea58710dfc5c9f45c',
		true,
		false,
		'',
		null
	),
];

class ViewVote extends React.Component {
	state = {
		tabValue: 0,
		title: 'This Is The Poll Title',
		type: 'Single Option Voting',
		href:
			'https://raw.githubusercontent.com/JacobEberhardt/ZoKrates/aa7e11/README.md',
		hash: 'F30A765AD6C5777E82EB2B64CFA53CDBB08D435546DD351880C13691867290B4',
		commitStartBlock: 154298,
		commitEndBlock: 154310,
		revealStartBlock: 154499,
		revealEndBlock: 155909,
		minTurnout: false,
		minSupport: false,
		protocolVersion: 'v0.1',
		pollAdminID:
			'888888655866a003faabd999c7b0a7c908af17d63fd2ac2951dc99e1ad2a14f4',
		expand: false,
	};

	toggleExpand = () => {
		this.setState((prevState) => ({
			expand: !prevState.expand,
		}));
	};
	/* state = {
		title: '',
		type: '',
		options: [],
		href: '',
		hash: '',
		commitStartBlock: null,
		commitEndBlock: null,
		revealStartBlock: null,
		revealEndBlock: null,
		minTurnout: false,
		minSupport: false,
		protocolVersion: null,
		pollAdminID: null,
	}; */

	handleTabChange = (event, value) => {
		this.setState({ tabValue: value });
	};

	render() {
		const { classes } = this.props;
		const voteID = QS.parse(this.props.location.search)['?id'];

		return (
			<Grid container spacing={24}>
				<Grid item xs={2} />
				<Grid item xs={8}>
					<Paper className={classes.paper}>
						<Grid container>
							<Grid item xs={12}>
								<Typography align="center" gutterBottom variant="title">
									Poll: {this.state.title}
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<Paper className={classes.paper}>
									<Typography
										style={{ display: 'inline' }}
										variant="body2"
										gutterBottom
									>
										Status:&nbsp;
									</Typography>
									<Typography style={{ display: 'inline' }}>
										Reveal phase ends on 12/12/2018 @ 12:00 AM UTC.
									</Typography>
								</Paper>
								<br />
							</Grid>
							<Grid item xs={12}>
								<Paper className={classes.paper}>
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
										<div>
											<br />
											<Grid item container xs={12}>
												<Grid item xs={3} className={classes.smallGridColumn}>
													<Typography variant="body2" gutterBottom>
														Poll Chain ID:
													</Typography>
												</Grid>
												<Grid item xs={9}>
													<Typography>
														{voteID}
														&nbsp;
														<a
															target="_blank"
															href={
																'https://explorer.factom.com/eblocks/0e5570917c25c6b35dbf67c802958d802e43fd9f48dd0c35a01feec1235de267'
															}
														>
															<OpenInNew
																color="primary"
																style={{ fontSize: 15 }}
															/>
														</a>
													</Typography>
												</Grid>
												<Grid item xs={3} className={classes.smallGridColumn}>
													<Typography variant="body2" gutterBottom>
														Poll Admin ID:
													</Typography>
												</Grid>
												<Grid item xs={9}>
													<Typography>
														{this.state.pollAdminID}
														&nbsp;
														<a
															target="_blank"
															href={
																'https://explorer.factom.com/eblocks/0e5570917c25c6b35dbf67c802958d802e43fd9f48dd0c35a01feec1235de267'
															}
														>
															<OpenInNew
																color="primary"
																style={{ fontSize: 15 }}
															/>
														</a>
													</Typography>
												</Grid>
												<Grid item xs={3} className={classes.smallGridColumn}>
													<Typography variant="body2" gutterBottom>
														Type:
													</Typography>
												</Grid>
												<Grid item xs={9}>
													<Typography>{this.state.type}</Typography>
												</Grid>

												<Grid item xs={3} className={classes.smallGridColumn}>
													<Typography variant="body2" gutterBottom>
														Proposal href:
													</Typography>
												</Grid>
												<Grid item xs={9}>
													<a href={this.state.href}>
														<Typography>{this.state.href}</Typography>
													</a>
												</Grid>
												<Grid item xs={3} className={classes.smallGridColumn}>
													<Typography variant="body2" gutterBottom>
														Proposal Hash:&nbsp;
														<Info
															style={{ fontSize: '15px' }}
															titleAccess="Hash Type: SHA-256"
														/>
													</Typography>
												</Grid>
												<Grid item xs={9}>
													<Typography>{this.state.hash}</Typography>
												</Grid>
												<Grid item xs={3} className={classes.smallGridColumn}>
													<Typography variant="body2" gutterBottom>
														Commit Start Block:
													</Typography>
												</Grid>
												<Grid item xs={9}>
													<Typography>{this.state.commitStartBlock}</Typography>
												</Grid>
												<Grid item xs={3} className={classes.smallGridColumn}>
													<Typography variant="body2" gutterBottom>
														Commit End Block:
													</Typography>
												</Grid>
												<Grid item xs={9}>
													<Typography>{this.state.commitEndBlock}</Typography>
												</Grid>
												<Grid item xs={3} className={classes.smallGridColumn}>
													<Typography variant="body2" gutterBottom>
														Reveal Start Block:
													</Typography>
												</Grid>
												<Grid item xs={9}>
													<Typography>{this.state.revealStartBlock}</Typography>
												</Grid>
												<Grid item xs={3} className={classes.smallGridColumn}>
													<Typography variant="body2" gutterBottom>
														Reveal End Block:
													</Typography>
												</Grid>
												<Grid item xs={9}>
													<Typography>{this.state.revealEndBlock}</Typography>
												</Grid>
												<Grid item xs={3} className={classes.smallGridColumn}>
													<Typography variant="body2" gutterBottom>
														Protocol Version:
													</Typography>
												</Grid>
												<Grid item xs={9}>
													<Typography>{this.state.protocolVersion}</Typography>
												</Grid>
											</Grid>
											<Grid item xs={12}>
												<Paper elevation={1} className={classes.paper}>
													<Typography variant="body2" gutterBottom>
														Invalidation Criteria:
													</Typography>
													<List dense>
														<ListItem>
															<Grid container>
																<Grid item xs={4}>
																	<FormControlLabel
																		control={
																			<Checkbox
																				color="default"
																				checked={true}
																			/>
																		}
																		label="Minimum Turnout"
																	/>
																</Grid>
																<Grid item xs={8}>
																	<div>
																		<Typography
																			style={{ display: 'inline' }}
																			variant="body2"
																		>
																			Turnout Ratio:&nbsp;
																		</Typography>
																		0.4
																		<br />
																		<Typography
																			style={{ display: 'inline' }}
																			variant="body2"
																		>
																			Weighted:&nbsp;
																		</Typography>
																		True
																	</div>
																</Grid>
															</Grid>
														</ListItem>
													</List>
												</Paper>
												<br />
											</Grid>
											<Grid item xs={12}>
												<Paper elevation={1} className={classes.paper}>
													<Typography variant="body2" gutterBottom>
														Options:
													</Typography>
													<List dense>
														<ListItem divider>
															<ListItemText primary="A. Yes" />
														</ListItem>
														<ListItem>
															<ListItemText primary="B. No" />
														</ListItem>
													</List>
												</Paper>
											</Grid>
										</div>
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
																			<Close color="secondary" />
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
										<div>
											<br />
											<Typography variant="body2" gutterBottom>
												Answer:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
												<select>
													<option />
													<option>True</option>
													<option>False</option>
												</select>
											</Typography>
											<Typography variant="body2" gutterBottom>
												Voter ID:&nbsp;&nbsp;&nbsp;&nbsp;
												<input type="text" />
											</Typography>
											<Typography variant="body2" gutterBottom>
												Signature:&nbsp;
												<input type="password" />
											</Typography>
											<br />
											<Button
												variant="raised"
												color="primary"
												onClick={this.handleNext}
											>
												Submit Vote
											</Button>
										</div>
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
	paper: {
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
