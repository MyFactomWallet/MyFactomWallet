import React from 'react';
import PropTypes from 'prop-types';
import { FactomCliContext } from './FactomCliContext';
import { FactomCli } from 'factom/dist/factom';
import { withNetwork } from './NetworkContext';
import _flowRight from 'lodash/flowRight';
import defaultsDeep from 'lodash/fp/defaultsDeep';
import _flow from 'lodash/flow';
import _noop from 'lodash/noop';

class FactomCliController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			connectToServer: this.connectToServer,
		};
	}

	componentDidMount = () => {
		this.connectToServer();
	};

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

	newFactomCli = (connectionParams) =>
		new FactomCli(defaultsDeep(this.defaultConnectionParams, connectionParams));

	connectToServer = async () => {
		const connectionParams = {
			host: this.props.networkController.networkProps.apiHost,
			port: this.props.networkController.networkProps.apiPort,
		};

		await this.smartSetState({
			factomCli: this.newFactomCli(connectionParams),
		});
	};

	smartSetState = (newState, afterSetState = _noop) =>
		new Promise((resolve) =>
			this.setState(newState, _flow([afterSetState, resolve]))
		);

	render() {
		return (
			<FactomCliContext.Provider value={this.state}>
				{this.props.children}
			</FactomCliContext.Provider>
		);
	}
}

FactomCliController.propTypes = {
	children: PropTypes.element.isRequired,
};

const enhancer = _flowRight(withNetwork);

export default enhancer(FactomCliController);
