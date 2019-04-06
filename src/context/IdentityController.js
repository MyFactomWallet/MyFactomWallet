import React from 'react';
import PropTypes from 'prop-types';
import { IdentityContext } from './IdentityContext';
import { withNetwork } from './NetworkContext';
import { withFactomCli } from './FactomCliContext';
import _flowRight from 'lodash/flowRight';
import { Chain, Entry } from 'factom/dist/factom';

const IDENTITY_VERSION = 1;

class IdentityController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			registerIdentity: this.registerIdentity,
		};
	}

	registerIdentity = async ({ idPubKeys, idNames, ecPrivateKey }) => {
		let content = {
			'identity-version': IDENTITY_VERSION,
			keys: idPubKeys,
		};

		// build chain entry
		const entryBuilder = Entry.builder();

		for (const name of idNames) {
			entryBuilder.extId(name, 'utf8');
		}

		const entry = entryBuilder.content(JSON.stringify(content), 'utf8').build();

		const chain = new Chain(entry);

		// submit chain entry
		const result = await this.props.factomCliController.factomCli.add(
			chain,
			ecPrivateKey
		);

		return result;
	};

	render() {
		return (
			<IdentityContext.Provider value={this.state}>
				{this.props.children}
			</IdentityContext.Provider>
		);
	}
}

IdentityController.propTypes = {
	children: PropTypes.element.isRequired,
};

const enhancer = _flowRight(withFactomCli, withNetwork);

export default enhancer(IdentityController);
