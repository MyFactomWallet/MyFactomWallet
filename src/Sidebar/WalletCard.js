import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

class WalletCard extends React.Component {
	state = {
		error: null,
		isLoaded: false,
		balance: null,
	};

	componentDidMount() {
		fetch(
			'https://explorer.factoid.org/api/v1/address/balance/' +
				this.props.public_address
		)
			.then((res) => res.json())
			.then(
				(result) => {
					if (!result.error) {
						const balance =
							(
								parseInt(result.result.balance, 10) * 0.00000001
							).toLocaleString() + ' FCT';
						this.setState({
							isLoaded: true,
							balance: balance,
						});
					}
				},
				(error) => {
					this.setState({
						isLoaded: true,
						error,
					});
				}
			);
	}

	render() {
		const { /*error, isLoaded,*/ balance } = this.state;

		const { classes, active } = this.props;

		return (
			<Card onClick={this.props.onClick}>
				{active ? (
					//Active Card
					<CardContent className={classes.activeCard}>
						<Typography>FCT Wallet: {this.props.nickname}</Typography>
						<Typography className={classes.balance} variant="headline">
							{balance}
						</Typography>
						<Typography className={classes.public_address}>
							{this.props.public_address}
						</Typography>
					</CardContent>
				) : (
					//Inactive Card
					<CardContent className={classes.inactiveCard}>
						<Typography>FCT Wallet: {this.props.nickname}</Typography>
						<Typography>{balance}</Typography>
					</CardContent>
				)}
			</Card>
		);
	}
}
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
