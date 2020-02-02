import React from 'react';
import bedrockLogo from '../bedrockLogo.png';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import tfaLogo from '../tfaLogo.png';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

function Footer(props) {
	const { classes } = props;

	const Heading = (props) => (
		<Typography gutterBottom color="primary" className={classes.headingText}>
			{props.children}
		</Typography>
	);

	const Text = (props) => (
		<Typography gutterBottom color="textSecondary">
			{props.children}
		</Typography>
	);

	return (
		<Container maxWidth="false" className={classes.root}>
			<Grid container spacing={3}>
				<Grid item>
					<Heading>MyFactomWallet is brought to you by</Heading>
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
				<Grid item>
					<Heading>Resources</Heading>
					<Link
						href="https://github.com/MyFactomWallet/MyFactomWallet/"
						target="_blank"
					>
						<Text>Github</Text>
					</Link>
					<Link href="https://factomd.net/" target="_blank">
						<Text>Factom Open Node</Text>
					</Link>
				</Grid>
				<Grid item>
					<Heading>Support</Heading>
					<Link href="https://discord.gg/79kH2pp" target="_blank">
						<Text>Discord</Text>
					</Link>
					<Link href="https://help.myfactomwallet.com/" target="_blank">
						<Text>Documentation</Text>
					</Link>
				</Grid>
				<Grid item>
					<Heading>Donations are Welcome</Heading>
					<Text>
						FCT, PEG: FA2gS1XCHv7sbWkRDHZJUwqHDDDNhL3V6trgxb2DWEw93aHDa9DG
					</Text>
					<Text>BTC: 36xEwrdJW8rjoaQpY6NcuWwsPLdtL2utcP</Text>
				</Grid>
			</Grid>
		</Container>
	);
}

const styles = (theme) => ({
	root: {
		backgroundColor: '#0f609b17',
		bottom: 0,
		height: '134px',
		overflowX: 'hidden',
		padding: '8px 16px 0 64px',
		position: 'absolute',
		width: '100%',
	},
	headingText: {
		fontWeight: '500',
	},
	logo: {
		width: '130px',
	},
});

export default withStyles(styles)(Footer);
