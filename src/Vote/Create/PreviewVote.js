import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import SignVote from '../Shared/SignVote';
import VoteSummary from '../Shared/VoteSummary';
import Button from '@material-ui/core/Button';
import SectionHeader from '../Shared/SectionHeader';

function PreviewVote(props) {
	const { classes } = props;

	return (
		<Grid container className={classes.pad}>
			<VoteSummary poll={props.poll} />
			<Grid item xs={12}>
				<SectionHeader text="Sign Transaction" />
			</Grid>

			<Grid xs={2} item>
				<Typography gutterBottom>Poll Admin ID:</Typography>
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
			<Grid item xs={12} className={classes.stepperButtons}>
				<br />
				<Button onClick={props.handleBack}>Back</Button>
				<Button variant="contained" color="primary" onClick={props.handleNext}>
					Submit Poll
				</Button>
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
	smallGridColumn: {
		flexBasis: '19%',
	},
	optionList: {
		width: '350px',
		overflow: 'auto',
	},
	stepperButtons: {
		marginLeft: '-15px',
	},
});

export default withStyles(styles)(PreviewVote);
