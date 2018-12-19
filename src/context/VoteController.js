import React from 'react';
import _flowRight from 'lodash/flowRight';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import { VoteContext } from './VoteContext';
import { withFactomCli } from './FactomCliContext';
import { FactomVoteManager } from 'factom-vote/dist/factom-vote';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import gql from 'graphql-tag';

const client = new ApolloClient({
	uri: 'https://vote.factoid.org/graphql',
});

/**
 * Queries
 */
const PUBLIC_KEYS_RESOLVER = gql`
	query PubKeyResolver($chain: String!) {
		identityKeysAtHeight(chain: $chain)
	}
`;

class VoteController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			factomVoteManager: this.newFactomVoteManager(),
			submitVote: this.submitVote,
		};
	}

	publicKeysResolver = async (identityChainId, blockHeight) => {
		const { data } = await client.query({
			query: PUBLIC_KEYS_RESOLVER,
			variables: {
				chain: identityChainId,
			},
		});

		if (!_isNil(_get(data, 'identityKeysAtHeight'))) {
			return _get(data, 'identityKeysAtHeight');
		} else {
			return [];
		}
	};

	newFactomVoteManager = () =>
		new FactomVoteManager(
			this.props.factomCliController.getDefaultConnectionParams(),
			{
				publicKeysResolver: this.publicKeysResolver,
				privateKeysResolver: null,
			}
		);

	submitVote = async (voteData, ecPrivateAddress) => {
		const skipValidation = true;

		const result = await this.state.factomVoteManager.createVote(
			voteData,
			ecPrivateAddress,
			skipValidation
		);

		return result;
	};

	render() {
		return (
			<ApolloProvider client={client}>
				<VoteContext.Provider value={this.state}>
					{this.props.children}
				</VoteContext.Provider>
			</ApolloProvider>
		);
	}
}

const enhancer = _flowRight(withFactomCli);

export default enhancer(VoteController);
