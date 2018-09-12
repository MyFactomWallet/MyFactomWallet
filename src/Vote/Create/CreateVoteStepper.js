import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ConfigureVote from './ConfigureVote.js';
import SelectParticipants from './SelectParticipants.js';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import PreviewVote from './PreviewVote.js';
import OpenInNew from '@material-ui/icons/OpenInNew';
import { Link } from 'react-router-dom';

const styles = (theme) => ({
	pad: {
		padding: '15px',
	},
});

function getSteps() {
	return ['Select Voters', 'Configure Poll', 'Preview & Sign'];
}

class CreateVoteStepper extends React.Component {
	state = {
		activeStep: 0,
	};

	getStepContent(stepIndex) {
		switch (stepIndex) {
			case 0:
				return (
					<SelectParticipants
						handleNext={this.handleNext}
						handleBack={this.handleBack}
					/>
				);
			case 1:
				return (
					<ConfigureVote
						handleNext={this.handleNext}
						handleBack={this.handleBack}
					/>
				);
			case 2:
				return (
					<PreviewVote
						handleNext={this.handleNext}
						handleBack={this.handleBack}
					/>
				);
			default:
				return 'Content D';
		}
	}

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

	render() {
		const { classes } = this.props;
		const steps = getSteps();
		const { activeStep } = this.state;

		return (
			<Grid container>
				<Grid item xs={2} />
				<Grid item xs={8}>
					<Paper className={classes.pad}>
						<Typography variant="display1" align="center">
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
						<div>
							{this.state.activeStep === steps.length ? (
								<Grid className={classes.pad} container>
									<Grid item xs={12}>
										<Typography variant="title" gutterBottom>
											Setup Complete!
										</Typography>
										<Typography gutterBottom>
											You're poll is pending confirmation on the Factom
											blockchain.&nbsp;
											<Link
												target="_blank"
												to={
													'/viewVote?id=e62aeaad853809e0a6901faa7698d305b5927fe9aeffff9fa233f3367629f098'
												}
											>
												<Button variant="outlined">
													View Poll
													<OpenInNew />
												</Button>
											</Link>
										</Typography>
									</Grid>
									<Grid item xs={12}>
										<Typography
											style={{ display: 'inline' }}
											variant="body2"
											gutterBottom
										>
											Voter Chain ID:&nbsp;
											<Typography style={{ display: 'inline' }} variant="body1">
												df3ade9eec4b08d5379cc64270c30ea7315d8a8a1a69efe2b98a60ecdd69e604&nbsp;
												<a
													target="_blank"
													href={
														'https://explorer.factom.com/eblocks/0e5570917c25c6b35dbf67c802958d802e43fd9f48dd0c35a01feec1235de267'
													}
												>
													<OpenInNew color="primary" style={{ fontSize: 15 }} />
												</a>
											</Typography>
										</Typography>

										<br />
										<Typography
											style={{ display: 'inline' }}
											variant="body2"
											gutterBottom
										>
											Poll Chain ID:&nbsp;
										</Typography>
										<Typography style={{ display: 'inline' }} variant="body1">
											e5783ef44313a678d489b6917ef96d971156615ae71a671fdf638af403146ab7&nbsp;
											<a
												target="_blank"
												href={
													'https://explorer.factom.com/eblocks/0e5570917c25c6b35dbf67c802958d802e43fd9f48dd0c35a01feec1235de267'
												}
											>
												<OpenInNew color="primary" style={{ fontSize: 15 }} />
											</a>
										</Typography>
									</Grid>
								</Grid>
							) : (
								<div>
									<div>{this.getStepContent(activeStep)}</div>
									{/* <div>
										<br />
										<Button
											disabled={activeStep === 0}
											onClick={this.handleBack}
										>
											Back
										</Button>
										<Button
											variant="raised"
											color="primary"
											onClick={this.handleNext}
										>
											{activeStep === steps.length - 1 ? 'Submit Poll' : 'Next'}
										</Button>
									</div> */}
								</div>
							)}
						</div>
					</Paper>
				</Grid>
				<Grid item xs={2} />
			</Grid>
		);
	}
}

CreateVoteStepper.propTypes = {
	classes: PropTypes.object,
};

export default withStyles(styles)(CreateVoteStepper);
