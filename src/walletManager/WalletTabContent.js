import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import _flowRight from 'lodash/flowRight';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import SendFactoidForm from './SendFactoidForm';
import ConvertECForm from './ConvertECForm';
import ViewPrivateKeyForm from './ViewPrivateKeyForm';
import AddressInfoTab from './AddressInfoTab';
import { withNetwork } from '../context/NetworkContext';

function WalletTabContent(props) {
	const [tabValue, setTabValue] = useState(0);

	function handleChange(event, tabValue) {
		setTabValue(tabValue);
	}

	const {
		classes,
		type,
		activeAddress,
		networkController: { networkProps },
	} = props;

	let activeTab = tabValue;

	// handle invalid FCT tab value
	if (type === 'fct' && activeTab >= 3 && activeAddress.importType !== 'seed') {
		//only seeds have tab 3
		activeTab = 0;
	}

	// handle invalid EC tab value
	if (
		type === 'ec' &&
		(activeTab > 1 || (activeTab === 1 && activeAddress.importType !== 'seed'))
	) {
		activeTab = 0;
	}

	return (
		<div className={classes.root}>
			{type === 'fct' && (
				<div>
					<Tabs
						value={activeTab}
						onChange={handleChange}
						indicatorColor="primary"
						textColor="primary"
						centered
					>
						<Tab label="Overview" />
						<Tab label={'Send ' + networkProps.factoidAbbreviationFull} />
						<Tab label={'Convert to ' + networkProps.ecAbbreviation} />
						{activeAddress.importType === 'seed' && (
							<Tab label="View Private Key" />
						)}
					</Tabs>
					{activeTab === 0 && (
						<TabContainer classes={classes}>
							<AddressInfoTab />
						</TabContainer>
					)}
					{activeTab === 1 && (
						<TabContainer classes={classes}>
							<SendFactoidForm />
						</TabContainer>
					)}
					{activeTab === 2 && (
						<TabContainer classes={classes}>
							<ConvertECForm />
						</TabContainer>
					)}
					{activeTab === 3 && (
						<TabContainer classes={classes}>
							<ViewPrivateKeyForm />
						</TabContainer>
					)}
				</div>
			)}
			{type === 'ec' && (
				<div>
					<Tabs
						value={activeTab}
						onChange={handleChange}
						indicatorColor="primary"
						textColor="primary"
						centered
					>
						<Tab label="Overview" />
						{activeAddress.importType === 'seed' && (
							<Tab label="View Private Key" />
						)}
					</Tabs>
					{activeTab === 0 && (
						<TabContainer classes={classes}>
							<AddressInfoTab />
						</TabContainer>
					)}
					{activeTab === 1 && (
						<TabContainer classes={classes}>
							<ViewPrivateKeyForm />
						</TabContainer>
					)}
				</div>
			)}
		</div>
	);
}
WalletTabContent.propTypes = {
	classes: PropTypes.object.isRequired,
};

function TabContainer(props) {
	return (
		<Typography component="div" className={props.classes.tabContainer}>
			{props.children}
		</Typography>
	);
}
TabContainer.propTypes = {
	children: PropTypes.node.isRequired,
};

const styles = {
	root: { textAlign: 'center' },
	tabContainer: {
		paddingLeft: 55,
		paddingRight: 55,
		paddingTop: 18,
		paddingBottom: 10,
	},
};

const enhancer = _flowRight(withNetwork, withStyles(styles));
export default enhancer(WalletTabContent);
