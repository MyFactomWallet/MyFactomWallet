import React from 'react';
import bedrockLogo from '../bedrockLogo.png';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import tfaLogo from '../tfaLogo.png';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

function Footer(props) {
	const { classes } = props;

	const SectionHeading = (props) => (
		<Typography gutterBottom color="primary" className={classes.heading}>
			{props.children}
		</Typography>
	);

	const SectionText = (props) => (
		<Typography gutterBottom color="textSecondary">
			{props.children}
		</Typography>
	);

	return (
		<Grid container justify="center" className={classes.root}>
			<Grid item xs={12} sm={6} md={3}>
				<SectionHeading>MyFactomWallet is brought to you by</SectionHeading>
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
				<SectionHeading>Resources</SectionHeading>
				<Link
					href="https://github.com/MyFactomWallet/MyFactomWallet/"
					target="_blank"
				>
					<SectionText>Github</SectionText>
				</Link>
				<Link href="https://factomd.net/" target="_blank">
					<SectionText>Factom Open Node</SectionText>
				</Link>
			</Grid>
			<Grid item xs={12} sm={6} md={2}>
				<SectionHeading>Support</SectionHeading>
				<Link href="https://discord.gg/79kH2pp" target="_blank">
					<SectionText>Discord</SectionText>
				</Link>
				<Link href="https://help.myfactomwallet.com/" target="_blank">
					<SectionText>Documentation</SectionText>
				</Link>
			</Grid>
			<Grid item xs={12} sm={6} md={5}>
				<SectionHeading>Donations are Welcome</SectionHeading>
				<SectionText>
					FCT, PEG: FA2gS1XCHv7sbWkRDHZJUwqHDDDNhL3V6trgxb2DWEw93aHDa9DG
				</SectionText>
				<SectionText>BTC: 36xEwrdJW8rjoaQpY6NcuWwsPLdtL2utcP</SectionText>
			</Grid>
		</Grid>
	);
}

const styles = (theme) => ({
	root: {
		position: 'absolute',
		bottom: 0,
		height: '110px',
		padding: '0 0 0 20px',
		width: '100%',
	},
	heading: {
		fontWeight: '500',
	},
	logo: {
		width: '130px',
	},
});

export default withStyles(styles)(Footer);
