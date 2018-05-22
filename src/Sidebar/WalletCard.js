import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { convertToDollar } from '../Utils/Utils.js';

const WalletCard = (props) => {
	const factoidAmountText = props.amount.toLocaleString() + ' FCT';
	const dollarAmountText = '$' + convertToDollar(props.amount).toLocaleString();

	const { classes, active } = props;

	return (
		<Card onClick={props.onClick}>
			{active ? (
				//Active Card
				<CardContent className={classes.activeCard}>
					<Typography>Factoid Wallet #{props.id}</Typography>
					<Typography
						className={classes.amount}
						variant="headline"
						component="h2"
					>
						{factoidAmountText}
					</Typography>
					<Typography>{dollarAmountText}</Typography>
				</CardContent>
			) : (
				//Inactive Card
				<CardContent>
					<Typography>Factoid Wallet #{props.id}</Typography>
				</CardContent>
			)}
		</Card>
	);
};
WalletCard.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = {
	amount: {
		fontSize: '35px',
	},
	activeCard: {
		border: '3px solid #757de8',
	},
};

export default withStyles(styles)(WalletCard);
