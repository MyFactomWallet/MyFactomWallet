import React from 'react';

export default class CreateVoteController extends React.Component {
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
					eligibleVotersChainId: '',
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
				voteTypeText: '',
				questionSource: '',
				workingHref: '',
				workingOption: '',
				checkedTurnout: false,
				checkedSupport: false,
				workingWeightMinTurnout: '',
				workingUnweightMinTurnout: '',
				workingWeightMinSupport: '',
				workingUnweightMinSupport: '',
				workingMinSupportOption: '',
				applyMinSupportToAllOptions: true,
			},
		},
		eligibleVotersForm: {
			participantsJSON: [],
			formFields: {
				selectedList: 'standing',
				workingVoterID: '',
				workingWeight: '',
			},
		},
	};

	updatePoll = (form) => {
		this.setState({ pollForm: form });
	};

	updateParticipants = (form) => {
		this.setState({ eligibleVotersForm: form });
	};

	render() {
		return this.props.children({
			...this.state,
			updatePoll: this.updatePoll,
			updateParticipants: this.updateParticipants,
		});
	}
}
