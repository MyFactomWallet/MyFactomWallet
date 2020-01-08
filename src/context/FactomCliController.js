import React from 'react';
import PropTypes from 'prop-types';
import { FactomCliContext } from './FactomCliContext';
import { FactomCli, FactomEventEmitter } from 'factom/dist/factom';
import { withNetwork } from './NetworkContext';
import defaultsDeep from 'lodash/fp/defaultsDeep';
import _flowRight from 'lodash/flowRight';
import _flow from 'lodash/flow';
import _noop from 'lodash/noop';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Header from '../frame/Header';

class FactomCliController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			connectToServer: this.connectToServer,
			blockHeight: null,
			isConnected: false,
			error: false,
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
		// reset state
		await this.smartSetState({
			isConnected: false,
			blockHeight: null,
		});

		// disable event emitter
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
		try {
			// test connection
			if (
				await factomCli.factomdApi('properties', null, {
					timeout: 2000,
					retry: { retries: 0 },
				})
			) {
				// successful connection
				const factomEmitter = this.newFactomEmitter(factomCli);

				await this.smartSetState({
					factomCli,
					factomEmitter,
				});

				await this.state.factomEmitter.on(
					'newDirectoryBlock',
					this.updateBlock
				);

				await this.smartSetState({
					isConnected: true,
				});
			}
		} catch (e) {
			// unsuccessful connection
			console.log('Error connecting to server.');
			console.log(e);
			await this.smartSetState({ error: true });
		}
	};

	smartSetState = (newState, afterSetState = _noop) =>
		new Promise((resolve) =>
			this.setState(newState, _flow([afterSetState, resolve]))
		);

	render() {
		if (this.state.error) {
			return (
				<FactomCliContext.Provider value={this.state}>
					<Grid container>
						<Grid item xs={12}>
							<Header disabled />
						</Grid>
						<Grid item xs={12} justify="center" container>
							<Typography variant="h5">
								PLACEHOLDER Unable to connect to Factom node PLACEHOLDER
							</Typography>
						</Grid>
					</Grid>
				</FactomCliContext.Provider>
			);
		} else if (!this.state.isConnected) {
			return (
				<FactomCliContext.Provider value={this.state}>
					<Header disabled greenConnection />
				</FactomCliContext.Provider>
			);
		} else {
			return (
				<FactomCliContext.Provider value={this.state}>
					{this.props.children}
				</FactomCliContext.Provider>
			);
		}
	}
}

FactomCliController.propTypes = {
	children: PropTypes.element.isRequired,
};

const enhancer = _flowRight(withNetwork);

export default enhancer(FactomCliController);
