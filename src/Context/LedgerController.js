import React from 'react';
import PropTypes from 'prop-types';
import { LedgerContext } from './LedgerContext';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import Fct from '@factoid.org/hw-app-fct';

class LedgerController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isLedgerConnected: this.isLedgerConnected,
		};
	}

	isLedgerConnected = async () => {
		console.log('Attempt');
		let result = false;
		try {
			let transport = await TransportU2F.create();
			const ledger = new Fct(transport);
			await ledger.getAppConfiguration();

			result = true;

			transport.close();
		} catch (err) {
			console.log('Transport Err:' + err);
		}
		console.log('Result: ' + result);
		return result;
	};

	render() {
		return (
			<LedgerContext.Provider value={this.state}>
				{this.props.children}
			</LedgerContext.Provider>
		);
	}
}

LedgerController.propTypes = {
	children: PropTypes.element.isRequired,
};

export default LedgerController;
