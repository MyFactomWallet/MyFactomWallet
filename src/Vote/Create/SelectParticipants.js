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
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';

function Voter(id, weight, name, role) {
	this.id = id;
	this.weight = weight;
	this.name = name;
	this.role = role;
}

class SelectParticipants extends React.Component {
	state = {
		selectedValue: 'b',
		voters: [],
		standingParties: [
			new Voter(
				null,
				2,
				'Factom Incorporated',
				(
					<div>
						Guide
						<br />
						ANO
					</div>
				)
			),
			new Voter(null, 1, 'Centis BV', 'Guide'),
			new Voter(
				null,
				2,
				'DBGrow Incorporated',
				(
					<div>
						Guide
						<br />
						ANO
					</div>
				)
			),
			new Voter(
				null,
				2,
				'Canonical ledgers',
				(
					<div>
						Guide
						<br />
						ANO
					</div>
				)
			),
			new Voter(null, 1, 'THE 42ND FACTOID', 'Guide'),
			new Voter(null, 1, 'Blockchain Innovation Foundation', 'ANO'),
			new Voter(null, 1, 'Block Party', 'ANO'),
			new Voter(null, 1, 'Blockrock Mining', 'ANO'),
			new Voter(null, 1, 'Building Innovation Management', 'ANO'),
			new Voter(null, 1, 'CryptoVikings', 'ANO'),
			new Voter(null, 1, 'Factomatic', 'ANO'),
			new Voter(null, 1, 'Factomize', 'ANO'),
			new Voter(null, 1, 'Factoshi', 'ANO'),
			new Voter(null, 1, 'Go Immutable', 'ANO'),
			new Voter(null, 1, 'HashNStore', 'ANO'),
			new Voter(null, 1, 'LUCIAP', 'ANO'),
			new Voter(null, 1, 'Matter of Fact', 'ANO'),
			new Voter(null, 1, 'LayerTech', 'ANO'),
			new Voter(null, 1, 'RewardChain', 'ANO'),
			new Voter(null, 1, 'Stamp-It', 'ANO'),
			new Voter(null, 1, 'Syncroblock', 'ANO'),
			new Voter(null, 1, 'The Factoid Authority', 'ANO'),
		],
	};

	addVoter = () => {
		this.setState((prevState) => ({
			voters: prevState.voters.concat(
				new Voter('ID45Xf871c773bd30726c7f0c85c7a95ba8695e10f51e88256b4', 1)
			),
		}));
	};

	removeVoter = () => {
		this.setState((prevState) => ({
			voters: prevState.voters.slice(0, prevState.voters.length - 1),
		}));
	};

	handleChange = (event) => {
		this.setState({ selectedValue: event.target.value });
	};

	render() {
		const { classes } = this.props;
		const standingParties = this.state.standingParties.map((voter) => (
			<ListItem key={voter.name} divider>
				<Person />
				<ListItemText
					primary={voter.name}
					secondary={'Weight: ' + voter.weight}
				/>
				<Typography variant="caption">{voter.role}</Typography>
			</ListItem>
		));
		const voters =
			this.state.voters.length > 0 ? (
				this.state.voters.map((voter, index) => (
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
				))
			) : (
				<ListItem disableGutters divider>
					<ListItemText primary={'No Voters have been added'} />
				</ListItem>
			);

		return (
			<Grid container className={classes.pad}>
				<Grid item xs={12}>
					<Typography gutterBottom variant="title">
						Select Voters
					</Typography>
				</Grid>
				<Grid item container xs={12}>
					<Grid item xs={3}>
						<FormControl component="fieldset">
							<RadioGroup
								value={this.state.selectedValue}
								onChange={this.handleChange}
							>
								<FormControlLabel
									value="b"
									control={<Radio />}
									label="Standing Parties"
								/>
								<FormControlLabel
									className={classes.raiseRadio}
									value="a"
									control={<Radio />}
									label="Create New List"
								/>
							</RadioGroup>
						</FormControl>
					</Grid>
					{this.state.selectedValue === 'a' ? (
						<Grid item xs={4} className={classes.borders}>
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
						</Grid>
					) : (
						<Grid item xs={4} />
					)}
					{this.state.selectedValue === 'a' ? (
						<Grid item xs={5} className={classes.padLoadVoters}>
							<div>
								<Typography variant="body2" gutterBottom>
									Load Voters
								</Typography>
								<Typography gutterBottom>
									File: <input type="file" />
								</Typography>
								<Typography>
									Voter Chain ID: <input type="text" />
								</Typography>
								<Typography gutterBottom>
									Authority Nodes
									<input type="checkbox" />
									<br />
									Guides <input type="checkbox" />
								</Typography>
								<button>Load</button>
							</div>
						</Grid>
					) : (
						<Grid item xs={5} />
					)}
				</Grid>
				{this.state.selectedValue === 'a' && (
					<Grid item xs={12}>
						<Paper elevation={10} className={classes.listContainer}>
							<Typography variant="subheading">Custom List</Typography>
							<List className={classes.list} dense>
								{voters}
							</List>
						</Paper>
					</Grid>
				)}
				{this.state.selectedValue === 'b' && (
					<Grid item xs={12}>
						{/* 	<Paper elevation={10} className={classes.listContainer}>
								<Typography variant="subheading">
									Standing Party List
								</Typography>

								<List className={classes.list} dense>
									{standingParties}
								</List>
							</Paper> */}
					</Grid>
				)}
				<Grid item xs={12} className={classes.stepperButtons}>
					<br />
					<Button disabled onClick={this.props.handleBack}>
						Back
					</Button>
					<Button
						variant="raised"
						color="primary"
						onClick={this.props.handleNext}
					>
						Next
					</Button>
				</Grid>
			</Grid>
		);
	}
}

SelectParticipants.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	pad: {
		padding: '15px',
	},
	list: {
		overflow: 'auto',
		height: 350,
	},
	borders: {
		borderRightStyle: 'solid',
		borderRightColor: 'lightgray',
		borderRightWidth: '1px',
		borderLeftStyle: 'solid',
		borderLeftColor: 'lightgray',
		borderLeftWidth: '1px',
		padding: '10px',
	},
	padLoadVoters: {
		padding: '10px',
	},
	listContainer: {
		marginTop: '10px',
		padding: '15px',
	},
	raiseRadio: {
		position: 'relative',
		top: '-16px',
	},
	stepperButtons: {
		marginLeft: '-15px',
	},
});

export default withStyles(styles)(SelectParticipants);
