import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import SendFactoidForm from './SendFactoidForm.js';

class WalletTabContent extends React.Component {
	state = {
		value: 0,
		sendFactoidAmount: 0,
	};

	handleChange = (event, value) => {
		this.setState({ value });
	};

	updateSendFactoidAmount = (amount) => {
		this.setState((prevState) => ({
			sendFactoidAmount: amount,
		}));
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
					{/* <Tab label="Wallet Info" />
						Use TFA Explorer API /api/v1/address/transactions/	GET	Retrieves all factoid transactions related to a given address
					*/}
					<Tab label="Convert to EC" />
				</Tabs>
				{value === 0 && (
					<TabContainer>
						<SendFactoidForm
							updateSendFactoidAmount={this.updateSendFactoidAmount}
							sendFactoidAmount={this.state.sendFactoidAmount}
						/>
					</TabContainer>
				)}
				{/* value === 1 && <TabContainer>Coming Soon</TabContainer> */}
				{value === 1 && <TabContainer>Coming Soon</TabContainer>}
			</div>
		);
	}
}
WalletTabContent.propTypes = {
	classes: PropTypes.object.isRequired,
};

function TabContainer(props) {
	return (
		<Typography component="div" style={{ padding: 55 }}>
			{props.children}
		</Typography>
	);
}
TabContainer.propTypes = {
	children: PropTypes.node.isRequired,
};

const styles = {
	root: { height: '675px', textAlign: 'center' },
};

export default withStyles(styles)(WalletTabContent);
