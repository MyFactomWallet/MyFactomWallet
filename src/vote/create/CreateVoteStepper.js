import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import EligibleVotersForm from './EligibleVotersForm.js';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import PreviewVote from './PreviewVote.js';
import FinalStep from './FinalStep.js';
import VoteConfiguration from './VoteConfiguration';
import CreateVoteForm from './CreateVoteForm';

class CreateVoteStepper extends React.Component {
	state = {
		activeStep: 0,
	};

	handleNext = () => {
		const { activeStep } = this.state;
		this.setState({
			activeStep: activeStep + 1,
		});
	};

	handleBack = () => {
		const { activeStep } = this.state;
		this.setState({
			activeStep: activeStep - 1,
		});
	};

	getStepContent(stepIndex, createVoteSnapshot) {
		switch (stepIndex) {
			case 0:
				return (
					<EligibleVotersForm
						handleNext={this.handleNext}
						handleBack={this.handleBack}
						eligibleVotersForm={createVoteSnapshot.eligibleVotersForm}
						updateParticipants={createVoteSnapshot.updateParticipants}
						useEligibleVoterTestData={
							createVoteSnapshot.useEligibleVoterTestData
						}
					/>
				);
			case 1:
				return (
					<CreateVoteForm
						handleNext={this.handleNext}
						handleBack={this.handleBack}
						updatePoll={createVoteSnapshot.updatePoll}
						pollForm={createVoteSnapshot.pollForm}
						usePollTestData={createVoteSnapshot.usePollTestData}
					/>
				);
			case 2:
				return (
					<PreviewVote
						handleNext={this.handleNext}
						handleBack={this.handleBack}
						poll={createVoteSnapshot.pollForm}
						eligibleVoters={
							createVoteSnapshot.eligibleVotersForm.eligibleVoters
						}
						updateCreatePollResult={createVoteSnapshot.updateCreatePollResult}
					/>
				);
			default:
				return 'Content D';
		}
	}

	getSteps() {
		return ['Select Voters', 'Configure Poll', 'Preview & Sign'];
	}

	render() {
		const { classes } = this.props;
		const steps = this.getSteps();
		const { activeStep } = this.state;

		return (
			<VoteConfiguration>
				{(createVoteSnapshot) => (
					<Grid container>
						<Grid item xs={2} />
						<Grid item xs={8}>
							<Paper className={classes.pad}>
								<Typography
									variant="h4"
									style={{ opacity: '.6' }}
									align="center"
								>
									Create Poll
								</Typography>
								<Stepper activeStep={activeStep}>
									{steps.map((label) => {
										return (
											<Step key={label}>
												<StepLabel>{label}</StepLabel>
											</Step>
										);
									})}
								</Stepper>
								{this.state.activeStep === steps.length ? (
									<FinalStep
										createPollResult={createVoteSnapshot.createPollResult}
									/>
								) : (
									<div>
										<div>
											{this.getStepContent(activeStep, createVoteSnapshot)}
										</div>
									</div>
								)}
							</Paper>
						</Grid>
						<Grid item xs={2} />
					</Grid>
				)}
			</VoteConfiguration>
		);
	}
}

CreateVoteStepper.propTypes = {
	classes: PropTypes.object,
};

const styles = (theme) => ({
	pad: {
		padding: '15px',
	},
});

export default withStyles(styles)(CreateVoteStepper);
