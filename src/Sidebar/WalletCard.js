import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const WalletCard = (props) => {
	const factoidBalanceText = props.balance.toLocaleString() + ' FCT';

	const { classes, active } = props;

	return (
		<Card onClick={props.onClick}>
			{active ? (
				//Active Card
				<CardContent className={classes.activeCard}>
					<Typography>Factoid Wallet #{props.id}</Typography>
					<Typography className={classes.balance} variant="headline">
						{factoidBalanceText}
					</Typography>
					<Typography className={classes.public_address}>
						{props.public_address}
					</Typography>
				</CardContent>
			) : (
				//Inactive Card
				<CardContent className={classes.inactiveCard}>
					<Typography>Factoid Wallet #{props.id}</Typography>
					<Typography>{factoidBalanceText}</Typography>
				</CardContent>
			)}
		</Card>
	);
};
WalletCard.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = {
	balance: {
		fontSize: '35px',
	},
	activeCard: {
		border: '3px solid #757de8',
	},
	inactiveCard: {
		display: 'flex',
		justifyContent: 'space-between',
	},
	public_address: {
		wordWrap: 'break-word',
	},
};

export default withStyles(styles)(WalletCard);
