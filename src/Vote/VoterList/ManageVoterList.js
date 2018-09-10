import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import Clear from '@material-ui/icons/Clear';
import Person from '@material-ui/icons/Person';
import CloudDownload from '@material-ui/icons/CloudDownloadOutlined';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import QS from 'qs';
import OpenInNew from '@material-ui/icons/OpenInNew';

function Voter(id, weight, name, role) {
	this.id = id;
	this.weight = weight;
	this.name = name;
	this.role = role;
}

class ManageVoterList extends React.Component {
	state = {
		voters: [
			new Voter('ID3XRoaKZDB9Q9AaZTpvNW6UVpBwhmCRhemDJWSyXkDCxfam2wnH', 1),
			new Voter('ID2MZs5wASMo9cCiKezdiQKCd8KA6Zbg2xKXKGmYEZBqon9J3ZKv', 1),
			new Voter('ID324f871c773bd30726c7f0c85c7a95ba8695e10f51e88256b1', 1),
			new Voter('ID646f871c773bd30726c7f0c85c7a95ba8695e10f51e88256b3', 1),
			new Voter('IDDF9f871c773bd30726c7f0c85c7a95ba8695e10f51e88256bA', 1),
			new Voter('IDL9Zf871c773bd30726c7f0c85c7a95ba8695e10f51e88256bc', 1),
			new Voter('ID4fZf871c773bd30726c7f0c85c7a95ba8695e10f51e88256bD', 1),
			new Voter('ID45Xf871c773bd30726c7f0c85c7a95ba8695e10f51e88256b4', 1),
		],
		voterChainID: null,
	};

	addVoter = () => {
		this.setState((prevState) => ({
			voters: prevState.voters.concat(
				new Voter('ID45Xf871c773bd30726c7f0c85c7a95ba8695e10f51e88256b4', 1)
			),
		}));
	};

	setChain = () => {
		this.setState((prevState) => ({
			voterChainID:
				'df3ade9eec4b08d5379cc64270c30ea7315d8a8a1a69efe2b98a60ecdd69e604',
		}));
	};

	removeVoter = () => {
		this.setState((prevState) => ({
			voters: prevState.voters.slice(0, prevState.voters.length - 1),
		}));
	};

	componentDidMount() {
		this.setState((prevState) => ({
			voterChainID: QS.parse(this.props.location.search)['?voterChainID'],
		}));
	}

	render() {
		const { classes } = this.props;

		const voters = this.state.voters.map((voter, index) => (
			<ListItem key={index} disableGutters divider>
				<Person />
				<ListItemText
					primary={'Voter ID: ' + voter.id}
					secondary={'Weight: ' + voter.weight}
				/>
				<IconButton onClick={this.removeVoter} aria-label="Clear">
					<Clear />
				</IconButton>
			</ListItem>
		));

		return (
			<Grid container>
				<Grid item xs={1} />
				<Grid item xs={10}>
					<Paper elevation={3} className={classes.paper}>
						<Grid container>
							<Grid item xs={12}>
								<Typography align="center" gutterBottom variant="title">
									Manage Voter List
								</Typography>
								<br />
							</Grid>
							<Grid item xs={4}>
								<div className={classes.paper}>
									<Typography variant="body2" gutterBottom>
										Voter Chain ID:&nbsp;
										<input
											type="text"
											size="30"
											defaultValue={this.state.voterChainID}
										/>
									</Typography>
									<Button
										onClick={this.setChain}
										variant="outlined"
										color="default"
										size="small"
									>
										Load
									</Button>
									{this.state.voterChainID !== undefined && (
										<Button
											style={{ marginLeft: '15px' }}
											variant="outlined"
											color="default"
											size="small"
										>
											Download &nbsp;
											<CloudDownload style={{ fontSize: 15 }} />
										</Button>
									)}
									{this.state.voterChainID !== undefined && (
										<div>
											<br />
											<Divider />
											<br />
											<Typography variant="body2" gutterBottom>
												Add Voter
											</Typography>
											<Typography gutterBottom>
												Voter ID: <input type="text" />
											</Typography>
											<Typography gutterBottom>
												Weight:&nbsp;&nbsp;&nbsp;
												<input type="text" />
											</Typography>
											<button onClick={this.addVoter}>Add</button>
											<br />
											<br />
											<Divider />
											<br />
											<Typography gutterBottom>
												Signature:&nbsp;
												<input type="password" />
											</Typography>
											<Button variant="raised" color="primary">
												Submit Changes
											</Button>
											<br />
										</div>
									)}
								</div>
							</Grid>
							{this.state.voterChainID !== undefined && (
								<Grid item xs={8}>
									<Paper elevation={1} className={classes.paper}>
										<Typography
											style={{ display: 'inline' }}
											variant="body2"
											gutterBottom
										>
											Voter Chain ID:&nbsp;
											<Typography
												style={{ display: 'inline' }}
												variant="body1"
												gutterBottom
											>
												{this.state.voterChainID}
											</Typography>
											&nbsp;
											<a
												target="_blank"
												href={
													'https://explorer.factom.com/eblocks/0e5570917c25c6b35dbf67c802958d802e43fd9f48dd0c35a01feec1235de267'
												}
											>
												<OpenInNew color="primary" style={{ fontSize: 15 }} />
											</a>
										</Typography>

										<Divider />
										<List className={classes.list} dense>
											{voters}
										</List>
									</Paper>
								</Grid>
							)}
						</Grid>
					</Paper>
				</Grid>
				<Grid item xs={1} />
			</Grid>
		);
	}
}

ManageVoterList.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	paper: {
		padding: 15,
	},
	list: {
		overflow: 'auto',
		height: 450,
	},
});

export default withStyles(styles)(ManageVoterList);
