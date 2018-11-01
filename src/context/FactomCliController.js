import React from 'react';
import PropTypes from 'prop-types';
import { FactomCliContext } from './FactomCliContext';
import { FactomCli } from 'factom/dist/factom';
import { withNetwork } from './NetworkContext';
import _flowRight from 'lodash/flowRight';
import defaultsDeep from 'lodash/fp/defaultsDeep';

class FactomCliController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			factomCli: this.newFactomCli(),
			connectToServer: this.connectToServer,
		};
	}

	defaultConnectionParams = {
		host: 'api.myfactomwallet.com',
		port: this.props.networkController.networkProps.apiPort,
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

	newFactomCli = (connectionParams = {}) =>
		new FactomCli(defaultsDeep(connectionParams, this.defaultConnectionParams));

	connectToServer = (connectionParams = {}) => {
		this.setState({
			factomCli: this.newFactomCli(connectionParams),
		});
	};

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
