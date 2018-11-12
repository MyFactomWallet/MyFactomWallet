import React from 'react';
import PropTypes from 'prop-types';
import { NetworkContext } from './NetworkContext';
import TestnetDisclaimer from '../TestnetDisclaimer';

class NetworkController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			networkProps: this.networkProps['mainnet'],
			changeNetwork: this.changeNetwork,
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
			explorerURL: 'https://explorer.factoid.org',
		},
		testnet: {
			network: 'testnet',
			bip32Account: 2147483647,
			factoidAbbreviation: 'TTS',
			factoidAbbreviationFull: 'Testoid',
			ecAbbreviation: 'TC',
			ecAbbreviationFull: 'Test Credit',
			apiPort: 8288,
			explorerURL: 'https://testnet.factoid.org',
		},
	};

	changeNetwork = (network) => {
		this.setState({ networkProps: this.networkProps[network] });
	};

	render() {
		return (
			<NetworkContext.Provider value={this.state}>
				{this.props.children}
				{this.state.networkProps.network === 'testnet' && <TestnetDisclaimer />}
			</NetworkContext.Provider>
		);
	}
}

NetworkController.propTypes = {
	children: PropTypes.element.isRequired,
};

export default NetworkController;
