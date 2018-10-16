import React from 'react';
import PropTypes from 'prop-types';
import { NetworkContext } from './NetworkContext';

class NetworkController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			networkProps: this.networkProps['testnet'],
		};
	}

	networkProps = {
		mainnet: {
			network: 'mainnet',
			bip32Account: 0,
			factoidAbbreviation: 'FCT',
			factoidAbbreviationFull: 'Factoid',
			ecAbbreviation: 'EC',
			ecAbbreviationFull: 'Entry Credit',
			apiPort: 8188,
		},
		testnet: {
			network: 'testnet',
			bip32Account: 2147483647,
			factoidAbbreviation: 'TST',
			factoidAbbreviationFull: 'Testoid',
			ecAbbreviation: 'TC',
			ecAbbreviationFull: 'Test Credit',
			apiPort: 8288,
		},
	};

	changeNetwork(network) {
		this.setState({ networkProps: this.networkProps[network] });
	}

	render() {
		return (
			<NetworkContext.Provider value={this.state}>
				{this.props.children}
			</NetworkContext.Provider>
		);
	}
}

NetworkController.propTypes = {
	children: PropTypes.element.isRequired,
};

export default NetworkController;
