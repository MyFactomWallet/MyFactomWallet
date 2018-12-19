import React from 'react';
import PropTypes from 'prop-types';
import { NetworkContext } from './NetworkContext';
import TestnetDisclaimer from '../TestnetDisclaimer';
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
			apiPort: 8188,
			explorerURL: 'https://explorer.factoid.org',
			explorerApiURL: 'https://explorer.factoid.org/api/v1',
			voteRegistrationChainID: '',
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
			explorerApiURL: 'https://testnet.factoid.org/api/v1',
			voteRegistrationChainID:
				'a968e880ee3a7002f25ade15ae36a77c15f4dbc9d8c11fdd5fe86ba6af73a475',
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
				{this.state.networkProps.network === 'testnet' && <TestnetDisclaimer />}
			</NetworkContext.Provider>
		);
	}
}

NetworkController.propTypes = {
	children: PropTypes.element.isRequired,
};

export default NetworkController;
