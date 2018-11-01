import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import OpenInNew from '@material-ui/icons/OpenInNew';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import SectionHeader from '../shared/SectionHeader';

const styles = (theme) => ({
	pad: {
		padding: '15px',
	},
});

function FinalStep(props) {
	const { classes } = props;

	return (
		<Grid className={classes.pad} container>
			<Grid item xs={12}>
				<SectionHeader text="Setup Complete!" />

				<Typography gutterBottom>
					You're poll is pending confirmation on the Factom blockchain.&nbsp;
					<Link
						target="_blank"
						rel="noopener noreferrer"
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
				<Typography style={{ display: 'inline', fontWeight: 500 }} gutterBottom>
					Voter Chain ID:&nbsp;
					<Typography style={{ display: 'inline' }}>
						df3ade9eec4b08d5379cc64270c30ea7315d8a8a1a69efe2b98a60ecdd69e604&nbsp;
						<a
							target="_blank"
							rel="noopener noreferrer"
							href={
								'https://explorer.factom.com/eblocks/0e5570917c25c6b35dbf67c802958d802e43fd9f48dd0c35a01feec1235de267'
							}
						>
							<OpenInNew color="primary" style={{ fontSize: 15 }} />
						</a>
					</Typography>
				</Typography>

				<br />
				<Typography style={{ display: 'inline', fontWeight: 500 }} gutterBottom>
					Poll Chain ID:&nbsp;
				</Typography>
				<Typography style={{ display: 'inline' }}>
					e5783ef44313a678d489b6917ef96d971156615ae71a671fdf638af403146ab7&nbsp;
					<a
						target="_blank"
						rel="noopener noreferrer"
						href={
							'https://explorer.factom.com/eblocks/0e5570917c25c6b35dbf67c802958d802e43fd9f48dd0c35a01feec1235de267'
						}
					>
						<OpenInNew color="primary" style={{ fontSize: 15 }} />
					</a>
				</Typography>
			</Grid>
		</Grid>
	);
}

FinalStep.propTypes = {
	classes: PropTypes.object,
};

export default withStyles(styles)(FinalStep);
