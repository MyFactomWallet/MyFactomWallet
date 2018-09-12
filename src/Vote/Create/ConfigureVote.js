import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import ConfigureForm from './ConfigureForm';

class ConfigureVote extends React.Component {
	state = {
		pollConfiguration: {
			title: '',
			type: '',
			options: [],
			href: '',
			hash: '',
			commitStartDate: '',
			commitEndDate: '',
			revealStartDate: '',
			revealEndDate: '',
			minTurnout: false,
			minSupport: false,
			protocolVersion: '',
			pollAdminID: '',
		},
	};

	updatePoll = (poll) => {
		console.log(poll);
		this.setState({ pollConfiguration: poll });
	};

	render() {
		const { classes } = this.props;

		return (
			<ConfigureForm
				poll={this.state.pollConfiguration}
				updatePoll={this.updatePoll}
				handleNext={this.props.handleNext}
				handleBack={this.props.handleBack}
			/>
		);
	}
}

ConfigureVote.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({});

export default withStyles(styles)(ConfigureVote);
