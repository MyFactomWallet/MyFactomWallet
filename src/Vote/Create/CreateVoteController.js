import React from 'react';

export class CreateVoteController extends React.Component {
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
					participantChainId: '',
					type: '',
					config: {
						options: [],
						acceptanceCriteria: {
							weightedMinSupport: '',
							unweightedMinSupport: '',
							weightedMinTurnout: '',
							unweightedMinTurnout: '',
						},
						minOptions: '',
						maxOptions: '',
					},
				},
			},
			formFields: {
				questionSource: '',
				workingOption: '',
				checkedTurnout: false,
				checkedSupport: false,
			},
		},
		participantsForm: {
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
		this.setState({ participantsForm: form });
	};

	render() {
		return this.props.children({
			...this.state,
			updatePoll: this.updatePoll,
			updateParticipants: this.updateParticipants,
		});
	}
}
