import React from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import bedrockLogo from '../bedrockLogo.png';
import tfaLogo from '../tfaLogo.png';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

function Footer(props) {
	const { classes } = props;
	const addressContainer = { paddingLeft: '50px' };

	return (
		<div className={classes.root}>
			<Divider className={classes.divider} />
			<Grid container justify={'center'}>
				<Grid item xs={12} sm={6} md={3}>
					<Typography gutterBottom className={classes.heading}>
						MyFactomWallet is brought to you by
					</Typography>
					<Link
						href="https://factomize.com/forums/major-contributors/ano/bedrock-solutions/"
						target="_blank"
					>
						<img className={classes.logo} src={bedrockLogo} alt="bedrockLogo" />
					</Link>
					<br />
					<Link href="https://factoid.org/" target="_blank">
						<img className={classes.logo} src={tfaLogo} alt="tfaLogo" />
					</Link>
				</Grid>
				<Grid item xs={12} sm={6} md={3} style={addressContainer}>
					<Typography gutterBottom className={classes.heading}>
						Resources
					</Typography>
					<Link
						href="https://github.com/MyFactomWallet/MyFactomWallet/"
						target="_blank"
					>
						<Typography align={'left'} gutterBottom color={'textSecondary'}>
							Github
						</Typography>
					</Link>
					<Link href="https://discord.gg/79kH2pp" target="_blank">
						<Typography align={'left'} gutterBottom color={'textSecondary'}>
							Discord
						</Typography>
					</Link>
					<Link href="https://help.myfactomwallet.com/" target="_blank">
						<Typography align={'left'} gutterBottom color={'textSecondary'}>
							Ledger Nano X/S docs
						</Typography>
					</Link>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Typography gutterBottom className={classes.heading}>
						Projects
					</Typography>
					<Link href="https://factomd.net/" target="_blank">
						<Typography align={'left'} gutterBottom color={'textSecondary'}>
							Factom Open Node
						</Typography>
					</Link>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Typography gutterBottom className={classes.heading}>
						Donations are Welcome
					</Typography>
					<Typography align={'left'} gutterBottom color={'textSecondary'}>
						Factom Address:
					</Typography>
					<Typography align={'left'} gutterBottom color={'textSecondary'}>
						Bitcoin Address: 36xEwrdJW8rjoaQpY6NcuWwsPLdtL2utcP
					</Typography>
				</Grid>
			</Grid>
		</div>
	);
}

const styles = (theme) => ({
	root: {
		margin: 'auto',
		maxWidth: 1050,
	},
	divider: {
		margin: '24px auto',
		width: 300,
	},
	heading: {
		align: 'left',
		fontWeight: '500',
		color: '#0F609B',
	},
	logo: {
		width: '130px',
	},
});

export default withStyles(styles)(Footer);