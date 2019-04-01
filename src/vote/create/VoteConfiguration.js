import React from 'react';

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
				revealEndDate: '',
				voteTypeText: '',
				questionSource: 'text',
				workingText: '',
				workingHref: '',
				workingHashValue: '',
				workingHashAlgo: '',
				workingOption: '',
				checkedTurnout: false,
				enableMinSupportConfig: true,
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

	render() {
		return this.props.children({
			...this.state,
			updatePoll: this.updatePoll,
			updateParticipants: this.updateParticipants,
			updateCreatePollResult: this.updateCreatePollResult,
		});
	}
}
