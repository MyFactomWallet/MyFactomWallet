import React from 'react';
import PropTypes from 'prop-types';
import { NetworkContext } from './NetworkContext';
import _flow from 'lodash/flow';
import _noop from 'lodash/noop';

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
			apiPort: 443,
			apiHost: 'api.factomd.net',
			explorerURL: 'https://explorer.factom.pro',
			transactionUrlSuffix: '/transactions/',
			pegnetApiUrl: 'https://pegapi.myfactomwallet.com/v2',
		},
		testnet: {
			network: 'testnet',
			bip32Account: 2147483647,
			factoidAbbreviation: 'TTS',
			factoidAbbreviationFull: 'Testoid',
			ecAbbreviation: 'TC',
			ecAbbreviationFull: 'Test Credit',
			apiPort: 8288,
			apiHost: 'api.myfactomwallet.com',
			explorerURL: 'https://testnet.factoid.org',
			transactionUrlSuffix: '/transaction?txid=',
			pegnetApiUrl: '',
		},
	};

	changeNetwork = async (network) => {
		await this.smartSetState({ networkProps: this.networkProps[network] });
	};

	smartSetState = (newState, afterSetState = _noop) =>
		new Promise((resolve) =>
			this.setState(newState, _flow([afterSetState, resolve]))
		);

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
