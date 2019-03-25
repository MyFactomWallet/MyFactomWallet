import React from 'react';
import _flowRight from 'lodash/flowRight';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import { VoteContext } from './VoteContext';
import { withFactomCli } from './FactomCliContext';
import { withNetwork } from './NetworkContext';
import { FactomVoteManager } from 'factom-vote/dist/factom-vote';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import gql from 'graphql-tag';
import { POLL_STATUSES } from '../vote/create/VOTE_CONSTANTS';
import { VOTE_TYPE_DATA } from '../vote/create/VOTE_CONSTANTS';

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
			getPollStatus: this.getPollStatus,
			getPhaseEndBlock: this.getPhaseEndBlock,
			getPollType: this.getPollType,
			commitVote: this.commitVote,
			revealVote: this.revealVote,
		};
	}

	client = new ApolloClient({
		uri: this.props.networkController.networkProps.voteApiUrl,
	});

	publicKeysResolver = async (identityChainId, blockHeight) => {
		const { data } = await this.client.query({
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

	commitVote = async ({ voteChainId, vote, voter, ecPrivateAddress }) => {
		const skipValidation = false;

		const result = await this.state.factomVoteManager.commitVote(
			voteChainId,
			vote,
			voter,
			ecPrivateAddress,
			skipValidation
		);

		return result;
	};

	revealVote = async ({ voteChainId, vote, voterId, ecPrivateAddress }) => {
		const skipValidation = false;

		const result = await this.state.factomVoteManager.revealVote(
			voteChainId,
			vote,
			voterId,
			ecPrivateAddress,
			skipValidation
		);

		return result;
	};

	getPhaseEndBlock = ({ commitStart, commitEnd, revealEnd }) => {
		const workingHeight = this.props.factomCliController.blockHeight + 1;

		if (workingHeight < commitStart) {
			// discussion phase
			return commitStart - 1;
		} else if (workingHeight <= commitEnd) {
			// commit phase
			return commitEnd;
		} else if (workingHeight <= revealEnd) {
			// reveal phase
			return revealEnd;
		} else {
			return null;
		}
	};

	getPollStatus = ({ commitStart, commitEnd, revealEnd }) => {
		const workingHeight = this.props.factomCliController.blockHeight + 1;

		if (workingHeight < commitStart) {
			return POLL_STATUSES.discussion;
		} else if (workingHeight <= commitEnd) {
			return POLL_STATUSES.commit;
		} else if (workingHeight <= revealEnd) {
			return POLL_STATUSES.reveal;
		} else {
			return POLL_STATUSES.complete;
		}
	};

	getPollType = (voteType, maxOptions) => {
		let pollType_o;

		if (voteType === 0) {
			pollType_o = VOTE_TYPE_DATA['binary'];
		} else if (voteType === 1) {
			if (maxOptions === 1) {
				pollType_o = VOTE_TYPE_DATA['singleOption'];
			} else {
				pollType_o = VOTE_TYPE_DATA['approval'];
			}
		} else if (voteType === 2) {
			pollType_o = VOTE_TYPE_DATA['instantRunoff'];
		}

		return pollType_o;
	};

	render() {
		return (
			<ApolloProvider client={this.client}>
				<VoteContext.Provider value={this.state}>
					{this.props.children}
				</VoteContext.Provider>
			</ApolloProvider>
		);
	}
}

const enhancer = _flowRight(withNetwork, withFactomCli);

export default enhancer(VoteController);
