import React from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import bedrockLogo from '../bedrockLogo.png';
import tfaLogo from '../tfaLogo.png';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import CreditsModal from './CreditsModal';

function Footer(props) {
	const { classes } = props;
	const addressContainer = { paddingLeft: '50px' };

	return (
		<div className={classes.root}>
			<Divider style={{ margin: '24px auto', width: 200 }} />
			<Grid container justify={'center'}>
				<Grid item xs={12} sm={6} md={3}>
					<Typography gutterBottom color={'black'}>
						MyFactomWallet is brought to you by:
					</Typography>
					<img
						className={classes.bedrockLogo}
						src={bedrockLogo}
						alt="bedrockLogo"
					/>
					<br />
					<img className={classes.tfaLogo} src={tfaLogo} alt="tfaLogo" />
				</Grid>
				<Grid item xs={12} sm={6} md={3} style={addressContainer}>
					<Link
						href="https://github.com/MyFactomWallet/MyFactomWallet"
						target="_blank"
					>
						<Typography
							align={'left'}
							gutterBottom
							color={'textSecondary'}
							style={{ fontWeight: '550' }}
						>
							Github
						</Typography>
					</Link>
					<Link href="https://discord.gg/79kH2pp" target="_blank">
						<Typography
							align={'left'}
							gutterBottom
							color={'textSecondary'}
							style={{ fontWeight: '550' }}
						>
							Discord
						</Typography>
					</Link>
					<Link href="https://help.myfactomwallet.com/" target="_blank">
						<Typography
							align={'left'}
							gutterBottom
							color={'textSecondary'}
							style={{ fontWeight: '550' }}
						>
							Ledger Nano X/S docs
						</Typography>
					</Link>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Typography align={'left'} gutterBottom color={'textSecondary'}>
						Donations are accepted here
					</Typography>
					<Typography align={'left'} gutterBottom color={'textSecondary'}>
						FCT Address:
					</Typography>
					<Typography align={'left'} gutterBottom color={'textSecondary'}>
						BTC Address:
					</Typography>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<CreditsModal />
				</Grid>
			</Grid>
		</div>
	);
}

const styles = (theme) => ({
	root: {
		margin: 'auto',
		maxWidth: 1000,
	},
	bedrockLogo: {
		width: '130px',
	},
	tfaLogo: {
		width: '130px',
	},
});

export default withStyles(styles)(Footer);
