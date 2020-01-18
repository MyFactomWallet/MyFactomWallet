import React from 'react';
import bedrockLogo from '../bedrockLogo.png';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import tfaLogo from '../tfaLogo.png';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

function Footer(props) {
	const { classes } = props;

	return (
		<Grid container justify={'center'} className={classes.root}>
			<Grid item xs={12} sm={6} md={3}>
				<Typography gutterBottom className={classes.heading} color="primary">
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
			<Grid item xs={12} sm={6} md={2}>
				<Typography gutterBottom className={classes.heading} color="primary">
					Resources
				</Typography>
				<Link
					href="https://github.com/MyFactomWallet/MyFactomWallet/"
					target="_blank"
				>
					<Typography
						gutterBottom
						color="textSecondary"
						className={classes.body}
					>
						Github
					</Typography>
				</Link>
				<Link href="https://factomd.net/" target="_blank">
					<Typography
						gutterBottom
						color="textSecondary"
						className={classes.body}
					>
						Factom Open Node
					</Typography>
				</Link>
			</Grid>
			<Grid item xs={12} sm={6} md={2}>
				<Typography gutterBottom className={classes.heading} color="primary">
					Support
				</Typography>
				<Link href="https://discord.gg/79kH2pp" target="_blank">
					<Typography
						gutterBottom
						color="textSecondary"
						className={classes.body}
					>
						Discord
					</Typography>
				</Link>
				<Link href="https://help.myfactomwallet.com/" target="_blank">
					<Typography
						gutterBottom
						color="textSecondary"
						className={classes.body}
					>
						Ledger Nano X/S docs
					</Typography>
				</Link>
			</Grid>
			<Grid item xs={12} sm={6} md={5}>
				<Typography gutterBottom color="primary" className={classes.heading}>
					Donations are Welcome
				</Typography>
				<Typography gutterBottom className={classes.body} color="textSecondary">
					FCT: FA2gS1XCHv7sbWkRDHZJUwqHDDDNhL3V6trgxb2DWEw93aHDa9DG
				</Typography>
				<Typography gutterBottom color="textSecondary" className={classes.body}>
					BTC: 36xEwrdJW8rjoaQpY6NcuWwsPLdtL2utcP
				</Typography>
			</Grid>
		</Grid>
	);
}

const styles = (theme) => ({
	root: {
		position: 'absolute',
		bottom: 0,
		height: '110px',
		padding: '0 50px 0 120px',
		width: '100%',
	},
	heading: {
		align: 'left',
		fontWeight: '500',
		whiteSpace: 'nowrap',
	},
	logo: {
		width: '130px',
	},
	body: {
		color: 'textSecondary',
		fontWeight: '400',
		whiteSpace: 'nowrap',
		align: 'left',
	},
});

export default withStyles(styles)(Footer);
