import React from 'react';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _isNumber from 'lodash/isNumber';
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

class EligibleVotersList extends React.Component {
	render() {
		const { classes, eligibleVoters, arrayHelpers } = this.props;

		return (
			<Paper elevation={2} className={classes.listContainer}>
				<Typography variant="subtitle1">Eligible Voter List</Typography>
				<List className={classes.list} dense>
					{eligibleVoters.length > 0 ? (
						eligibleVoters.map((voter, index) => (
							<ListItem key={index} disableGutters divider>
								<Person />
								<ListItemText
									primary={'Voter ID: ' + voter.voterId}
									secondary={voter.weight && 'Weight: ' + voter.weight}
								/>
								{arrayHelpers && (
									<IconButton
										onClick={() => {
											arrayHelpers.remove(index);
										}}
										aria-label="Clear"
									>
										<Clear />
									</IconButton>
								)}
							</ListItem>
						))
					) : (
						<ListItem disableGutters divider>
							<ListItemText primary={'No Voters have been added'} />
						</ListItem>
					)}
				</List>
			</Paper>
		);
	}
}

EligibleVotersList.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	list: {
		overflow: 'auto',
		maxHeight: 350,
	},
	listContainer: {
		marginTop: '10px',
		padding: '15px',
	},
});

export default withStyles(styles)(EligibleVotersList);
