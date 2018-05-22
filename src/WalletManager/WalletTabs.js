import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import SendFactoidForm from './SendFactoidForm.js';
import TransactionPreview from './TransactionPreview.js';
import Button from '@material-ui/core/Button';

class WalletTabs extends React.Component {
	state = {
		value: 0,
	};

	handleChange = (event, value) => {
		this.setState({ value });
	};

	render() {
		const { classes } = this.props;
		const { value } = this.state;

		return (
			<div className={classes.root}>
				<Tabs
					value={this.state.value}
					onChange={this.handleChange}
					indicatorColor="primary"
					textColor="primary"
					centered
				>
					<Tab label="Send Factoid" />
					<Tab label="Wallet Info" />
					<Tab label="Entry Credits" />
				</Tabs>
				{value === 0 && (
					<TabContainer>
						<SendFactoidForm
							updateSendFactoidAmount={this.props.updateSendFactoidAmount}
						/>
						<TransactionPreview factoidAmount={this.props.sendFactoidAmount} />
						<br />
						<Button
							className={classes.sendButton}
							variant="raised"
							color="primary"
						>
							Send Funds
						</Button>
						<br />
						<br />
						<Typography>
							Please verify all details are correct before hitting send.<br />We
							can not reverse mistaken transactions.
						</Typography>
					</TabContainer>
				)}
				{value === 1 && <TabContainer>Coming Soon</TabContainer>}
				{value === 2 && <TabContainer>Coming Soon</TabContainer>}
			</div>
		);
	}
}
WalletTabs.propTypes = {
	classes: PropTypes.object.isRequired,
};

function TabContainer(props) {
	return (
		<Typography component="div" style={{ padding: 8 * 3 }}>
			{props.children}
		</Typography>
	);
}
TabContainer.propTypes = {
	children: PropTypes.node.isRequired,
};

const styles = {
	root: { height: '675px', textAlign: 'center' },
	sendButton: {
		width: '50%',
		height: '24px',
	},
};

export default withStyles(styles)(WalletTabs);
