import React from 'react';
import PropTypes from 'prop-types';
import { FactomCliContext } from './FactomCliContext';
import { FactomCli, FactomEventEmitter } from 'factom/dist/factom';
import { withNetwork } from './NetworkContext';
import defaultsDeep from 'lodash/fp/defaultsDeep';
import _flowRight from 'lodash/flowRight';
import _flow from 'lodash/flow';
import _noop from 'lodash/noop';

class FactomCliController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			connectToServer: this.connectToServer,
			blockHeight: null,
			isStateHydrated: false,
		};
	}

	defaultConnectionParams = {
		path: '/v2',
		debugPath: '/debug',
		protocol: 'https',
		rejectUnauthorized: true,
		retry: {
			retries: 4,
			factor: 2,
			minTimeout: 500,
			maxTimeout: 2000,
		},
	};

	async componentDidMount() {
		await this.connectToServer();

		await this.smartSetState({ isStateHydrated: true });
	}

	getDefaultConnectionParams = () => {
		const connectionParams = {
			host: this.props.networkController.networkProps.apiHost,
			port: this.props.networkController.networkProps.apiPort,
		};

		return defaultsDeep(this.defaultConnectionParams, connectionParams);
	};

	newFactomCli = (connectionParams) =>
		new FactomCli(defaultsDeep(this.defaultConnectionParams, connectionParams));

	newFactomEmitter = (factomCli) =>
		new FactomEventEmitter(factomCli, {
			interval: 10000,
		});

	updateBlock = (directoryBlock) => {
		const { height } = directoryBlock;
		// process new block
		this.setState({
			blockHeight: height,
		});
	};

	connectToServer = async () => {
		if (this.state.factomEmitter) {
			this.state.factomEmitter.removeListener(
				'newDirectoryBlock',
				this.updateBlock
			);
		}

		const connectionParams = {
			host: this.props.networkController.networkProps.apiHost,
			port: this.props.networkController.networkProps.apiPort,
		};

		const factomCli = this.newFactomCli(connectionParams);
		const factomEmitter = this.newFactomEmitter(factomCli);

		await this.smartSetState({
			factomCli,
			factomEmitter,
		});

		this.state.factomEmitter.on('newDirectoryBlock', this.updateBlock);
	};

	smartSetState = (newState, afterSetState = _noop) =>
		new Promise((resolve) =>
			this.setState(newState, _flow([afterSetState, resolve]))
		);

	render() {
		if (this.state.isStateHydrated) {
			return (
				<FactomCliContext.Provider value={this.state}>
					{this.props.children}
				</FactomCliContext.Provider>
			);
		} else {
			return null;
		}
	}
}

FactomCliController.propTypes = {
	children: PropTypes.element.isRequired,
};

const enhancer = _flowRight(withNetwork);

export default enhancer(FactomCliController);
