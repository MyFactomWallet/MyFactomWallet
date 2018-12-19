import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import SubmitVoteForm from './SubmitVoteForm';
import VoteSummary from '../shared/VoteSummary';

function PreviewVote(props) {
	const { classes } = props;

	return (
		<Grid container className={classes.pad}>
			<VoteSummary poll={props.poll} eligibleVoters={props.eligibleVoters} />
			<Grid item xs={12} className={classes.submitVoteForm}>
				<SubmitVoteForm
					poll={props.poll}
					eligibleVoters={props.eligibleVoters}
					updateCreatePollResult={props.updateCreatePollResult}
					handleNext={props.handleNext}
					handleBack={props.handleBack}
				/>
			</Grid>
		</Grid>
	);
}

PreviewVote.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	pad: {
		padding: 15,
	},
	submitVoteForm: {
		marginTop: '25px',
	},
});

export default withStyles(styles)(PreviewVote);
