import React from 'react';
import _flowRight from 'lodash/flowRight';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withNetwork } from '../../context/NetworkContext';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import SectionHeader from '../shared/SectionHeader';
import ExplorerLink from '../shared/ExplorerLink';

function FinalStep(props) {
	const {
		classes,
		createPollResult,
		networkController: { networkProps },
	} = props;

	const entryHashURL = networkProps.explorerURL + '/entry?hash=';

	return (
		<Grid className={classes.pad} container>
			<Grid item xs={12}>
				<SectionHeader text="Setup Complete!" color="green" />

				<Typography gutterBottom>
					Your poll is pending confirmation. The entries will be visible in
					10-15 minutes, after being included in the next block currently being
					processed by the Factom blockchain.
				</Typography>
				<br />
			</Grid>

			<Grid item xs={12}>
				<ExplorerLink
					label="Eligible Voters"
					value={createPollResult.eligibleVoters.entryHash}
					href={entryHashURL + createPollResult.eligibleVoters.entryHash}
				/>
			</Grid>
			<Grid item xs={12}>
				<ExplorerLink
					label="Vote Configuration"
					value={createPollResult.vote.entryHash}
					href={entryHashURL + createPollResult.vote.entryHash}
				/>
			</Grid>
			<Grid item xs={12}>
				<ExplorerLink
					label="Vote Registration"
					value={createPollResult.registration.entryHash}
					href={entryHashURL + createPollResult.registration.entryHash}
				/>
			</Grid>
		</Grid>
	);
}

const styles = (theme) => ({
	pad: {
		padding: '15px',
	},
});

FinalStep.propTypes = {
	classes: PropTypes.object,
};

const enhancer = _flowRight(withNetwork, withStyles(styles));

export default enhancer(FinalStep);
