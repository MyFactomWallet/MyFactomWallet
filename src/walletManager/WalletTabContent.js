import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import _flowRight from 'lodash/flowRight';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import SendFactoidForm from './SendFactoidForm';
import ConvertECForm from './ConvertECForm';
import ViewPrivateKeyForm from './ViewPrivateKeyForm';
import ConvertPegnetForm from './ConvertPegnetForm';
import AddressInfoTab from './AddressInfoTab';
import { withNetwork } from '../context/NetworkContext';
import { PFCT_LBL } from '../constants/PEGNET_CONSTANTS';

class WalletTabContent extends React.Component {
	state = {
		tabValue: 0,
	};

	handleChange = (event, tabValue) => {
		this.setState({ tabValue });
	};

	render() {
		const {
			classes,
			type,
			activeAddress,
			networkController: { networkProps },
		} = this.props;

		let tabValue = this.state.tabValue;

		// handle invalid FCT tab value
		if (
			type === 'fct' &&
			tabValue >= 4 &&
			activeAddress.importType !== 'seed'
		) {
			//only seeds have tab 4
			tabValue = 0;
		}

		// handle invalid EC tab value
		if (
			type === 'ec' &&
			(tabValue > 1 || (tabValue === 1 && activeAddress.importType !== 'seed'))
		) {
			tabValue = 0;
		}

		return (
			<div className={classes.root}>
				{type === 'fct' && (
					<div>
						<Tabs
							value={tabValue}
							onChange={this.handleChange}
							indicatorColor="primary"
							textColor="primary"
							centered
						>
							<Tab label="Address Info" />
							<Tab label={'Send ' + networkProps.factoidAbbreviationFull} />
							<Tab label={'Convert to ' + networkProps.ecAbbreviation} />
							<Tab label={'Convert to ' + PFCT_LBL} />
							{activeAddress.importType === 'seed' && (
								<Tab label="View Private Key" />
							)}
						</Tabs>
						{tabValue === 0 && (
							<TabContainer classes={classes}>
								<AddressInfoTab />
							</TabContainer>
						)}
						{tabValue === 1 && (
							<TabContainer classes={classes}>
								<SendFactoidForm />
							</TabContainer>
						)}
						{tabValue === 2 && (
							<TabContainer classes={classes}>
								<ConvertECForm />
							</TabContainer>
						)}

						{tabValue === 3 && (
							<TabContainer classes={classes}>
								<ConvertPegnetForm />
							</TabContainer>
						)}
						{tabValue === 4 && (
							<TabContainer classes={classes}>
								<ViewPrivateKeyForm />
							</TabContainer>
						)}
					</div>
				)}
				{type === 'ec' && (
					<div>
						<Tabs
							value={tabValue}
							onChange={this.handleChange}
							indicatorColor="primary"
							textColor="primary"
							centered
						>
							<Tab label="Address Info" />
							{activeAddress.importType === 'seed' && (
								<Tab label="View Private Key" />
							)}
						</Tabs>
						{tabValue === 0 && (
							<TabContainer classes={classes}>
								<AddressInfoTab />
							</TabContainer>
						)}
						{tabValue === 1 && (
							<TabContainer classes={classes}>
								<ViewPrivateKeyForm />
							</TabContainer>
						)}
					</div>
				)}
			</div>
		);
	}
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
