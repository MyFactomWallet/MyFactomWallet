import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import SignVote from '../Shared/SignVote';
import VoteSummary from '../Shared/VoteSummary';

class PreviewVote extends React.Component {
	state = {
		poll: {
			title: 'This is the Title of the Poll',
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
		},
	};

	render() {
		const { classes } = this.props;

		return (
			<Grid container className={classes.pad}>
				<VoteSummary poll={this.state.poll} />
				<Grid item xs={12}>
					<Typography gutterBottom variant="title">
						Sign Transaction
					</Typography>
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
			</Grid>
		);
	}
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
});

export default withStyles(styles)(PreviewVote);
