import React from 'react';
import _flowRight from 'lodash/flowRight';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import OpenInNew from '@material-ui/icons/OpenInNew';
import { withNetwork } from '../../context/NetworkContext';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import SectionHeader from '../shared/SectionHeader';

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
				<SectionHeader text="Setup Complete!" />
				{/* <pre>{JSON.stringify(createPollResult, null, 2)}</pre> */}
				<Typography gutterBottom>
					You're poll is pending confirmation on the Factom blockchain.&nbsp;
					<Link
						target="_blank"
						rel="noopener noreferrer"
						to={'/viewVote?id=' + createPollResult.vote.entryHash}
					>
						<Button variant="outlined">
							View Poll
							<OpenInNew />
						</Button>
					</Link>
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<SectionHeader text="Eligible Voters" />
				<ExplorerLink
					label={'Entry Hash'}
					URL={entryHashURL}
					ID={createPollResult.eligibleVoters.entryHash}
				/>
			</Grid>
			<Grid item xs={12}>
				<SectionHeader text="Vote Configuration" />
				<ExplorerLink
					label={'Entry Hash'}
					URL={entryHashURL}
					ID={createPollResult.vote.entryHash}
				/>
			</Grid>
			<Grid item xs={12}>
				<SectionHeader text="Vote Registration" />
				<ExplorerLink
					label={'Entry Hash'}
					URL={entryHashURL}
					ID={createPollResult.registration.entryHash}
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

const ExplorerLink = ({ label, URL, ID }) => {
	return (
		<>
			<Typography style={{ display: 'inline' }} gutterBottom>
				{label + ':'}&nbsp;
			</Typography>
			<Typography style={{ display: 'inline' }}>
				{ID}&nbsp;
				<a target="_blank" rel="noopener noreferrer" href={URL + ID}>
					<OpenInNew color="primary" style={{ fontSize: 15 }} />
				</a>
			</Typography>
		</>
	);
};

FinalStep.propTypes = {
	classes: PropTypes.object,
};

const enhancer = _flowRight(withNetwork, withStyles(styles));

export default enhancer(FinalStep);
