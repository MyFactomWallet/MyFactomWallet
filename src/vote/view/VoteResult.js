import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const VoteResult = ({ result }) => {
	return (
		<ExpansionPanel>
			<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
				<Typography style={{ fontWeight: 500 }}>Result</Typography>
			</ExpansionPanelSummary>
			<ExpansionPanelDetails>
				<Grid container>
					<Grid item xs={12} />
					<Grid item xs={12}>
						<pre>{JSON.stringify(result, null, 2)}</pre>
					</Grid>
				</Grid>
			</ExpansionPanelDetails>
		</ExpansionPanel>
	);
};

const styles = (theme) => ({});

export default withStyles(styles)(VoteResult);
