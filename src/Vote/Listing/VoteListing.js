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

		return (
			<div className={classes.body}>
				<Paper className={classes.paper}>
					<Grid container direction="row">
						<Grid item xs={3} className={classes.topFilters}>
							<Typography style={{ textAlign: 'left' }}>
								Voter ID: <input type="text" />
							</Typography>
							<Typography style={{ textAlign: 'left' }}>
								Protocol Polls Only:
								<Switch defaultChecked value="checkedF" color="primary" />
							</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography variant="headline" gutterBottom>
								Welcome to Factom's On-Chain Voting
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
						expanded={this.state.expanded}
						toggleExpand={this.toggleExpand}
					/>
				</Paper>
				<br />
			</div>
		);
	}
}

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
});

export default withStyles(styles)(VoteListing);
