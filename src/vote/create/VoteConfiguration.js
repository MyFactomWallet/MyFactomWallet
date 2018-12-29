import React from 'react';
import { VOTE_EXAMPLE_CONFIG } from './VOTE_EXAMPLE_DATA';

export default class VoteConfiguration extends React.Component {
	state = {
		pollForm: {
			pollJSON: {
				proposal: {
					title: '',
					text: '',
					externalRef: {
						href: '',
						hash: {
							value: '',
							algo: '',
						},
					},
				},
				vote: {
					phasesBlockHeights: {
						commitStart: '',
						commitEnd: '',
						revealStart: '',
						revealEnd: '',
					},
					eligibleVotersChainId: null,
					type: '',
					config: {
						options: [],
						allowAbstention: '',
						computeResultsAgainst: '',
						minOptions: '',
						maxOptions: '',
						winnerCriteria: {},
						acceptanceCriteria: {},
					},
				},
			},
			formFields: {
				commitStartDate: '',
				commitEndDate: '',
				revealStartDate: '',
				revealEndDate: '',
				voteTypeText: '',
				questionSource: 'text',
				workingText: '',
				workingHref: '',
				workingHashValue: '',
				workingHashAlgo: '',
				workingOption: '',
				checkedTurnout: false,
				workingWeightMinTurnout: '',
				workingUnweightMinTurnout: '',
				workingWeightMinSupport: '',
				workingUnweightMinSupport: '',
				workingMinSupportOption: '',
			},
		},
		eligibleVotersForm: {
			eligibleVoters: [],
			formFields: {
				selectedList: 'custom',
				workingIdentityChainId: '',
				workingWeight: '',
				workingEligibleChainId: '',
				loadingVoters: false,
				loadErrorMessage: '',
				loadSuccessMessage: '',
				workingFileName: '',
				workingFile: '',
			},
		},
		createPollResult: {},
	};

	updatePoll = (form) => {
		this.setState({ pollForm: form });
	};

	updateParticipants = (form) => {
		this.setState({ eligibleVotersForm: form });
	};

	updateCreatePollResult = (result) => {
		this.setState({ createPollResult: result });
	};

	/**
	 * For Testing
	 */
	useEligibleVoterTestData = () => {
		this.updateParticipants(VOTE_EXAMPLE_CONFIG.eligibleVotersForm);
	};

	/**
	 * For Testing
	 */
	usePollTestData = () => {
		this.updatePoll(VOTE_EXAMPLE_CONFIG.pollForm);
	};

	render() {
		return this.props.children({
			...this.state,
			updatePoll: this.updatePoll,
			updateParticipants: this.updateParticipants,
			updateCreatePollResult: this.updateCreatePollResult,
			useEligibleVoterTestData: this.useEligibleVoterTestData,
			usePollTestData: this.usePollTestData,
		});
	}
}
