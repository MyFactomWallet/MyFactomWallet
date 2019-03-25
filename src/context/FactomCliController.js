import React from 'react';
import PropTypes from 'prop-types';
import { FactomCliContext } from './FactomCliContext';
import { FactomCli } from 'factom/dist/factom';
import { withNetwork } from './NetworkContext';
import defaultsDeep from 'lodash/fp/defaultsDeep';
import _flowRight from 'lodash/flowRight';
import _flow from 'lodash/flow';
import _noop from 'lodash/noop';
import * as moment from 'moment';

class FactomCliController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			connectToServer: this.connectToServer,
			getDefaultConnectionParams: this.getDefaultConnectionParams,
			getEstimatedBlockTimestamp: this.getEstimatedBlockTimestamp,
			updateBlockHeight: this.updateBlockHeight,
			blockHeight: null,
			blockTimestamp: null,
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
		// get latest block height
		this.updateBlockHeight();
		this.blockHeightTimerId = setInterval(this.updateBlockHeight, 60000);
	}

	componentWillUnmount() {
		clearInterval(this.blockHeightTimerId);
	}

	updateBlockHeight = async () => {
		const result = await this.state.factomCli.getDirectoryBlockHead();

		const { height, timestamp } = result;

		if (height !== this.state.blockHeight) {
			// process new block
			this.setState({
				blockHeight: height,
				blockTimestamp: timestamp,
			});
		}
	};

	getEstimatedBlockTimestamp = (blockHeight) => {
		const currentHeight = this.state.blockHeight;

		const currentBlockStartDate = moment.unix(this.state.blockTimestamp).utc();

		// get number of blocks between heights
		const blocks = blockHeight - currentHeight;

		// add time for blocks
		const minutes = blocks * 10;

		const estimatedDate = currentBlockStartDate
			.clone()
			.add(minutes * 60 * 1000, 'milliseconds');

		// return Unix Timestamp (milliseconds)
		return estimatedDate.valueOf();
	};

	getDefaultConnectionParams = () => {
		const connectionParams = {
			host: this.props.networkController.networkProps.apiHost,
			port: this.props.networkController.networkProps.apiPort,
		};

		return defaultsDeep(this.defaultConnectionParams, connectionParams);
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
