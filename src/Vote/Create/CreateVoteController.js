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
						acceptanceCriteria: [
							/*
							{
								minSupport: '',
								weighted: true,
							},
							{
								minSupport: '',
								weighted: false,
							},
							{
								minTurnout: '',
								weighted: true,
							},
							{
								minTurnout: '',
								weighted: false,
							},
							*/
						],
						minOptions: '',
						maxOptions: '',
					},
				},
			},
			formFields: {
				questionType: 'text',
				workingOption: '',
				weightMinSupport: '',
				unweightMinSupport: '',
				weightedMinTurnout: '',
				unweightedMinTurnout: '',
				checkedTurnout: false,
				checkedSupport: false,
			},
		},
		pollConfiguration: {
			title: '',
			type: '',
			options: [],
			href: '',
			hash: '',
			commitStartDate: '',
			commitEndDate: '',
			revealStartDate: '',
			revealEndDate: '',
			minTurnout: false,
			minSupport: false,
			protocolVersion: '',
			pollAdminID: '',
		},
		examplePoll: {
			title: 'This is the Title of the Poll',
			type: 'Single Option Voting',
			href:
				'https://raw.githubusercontent.com/JacobEberhardt/ZoKrates/aa7e11/README.md',
			hash: 'F30A765AD6C5777E82EB2B64CFA53CDBB08D435546DD351880C13691867290B4',
			commitStartDate: '2018-09-10',
			commitEndDate: '2018-09-11',
			revealStartDate: '2018-09-12',
			revealEndDate: '2018-09-13',
			minTurnout: false,
			minSupport: false,
		},
	};

	updatePoll = (form) => {
		this.setState({ pollForm: form });
	};

	render() {
		return this.props.children({
			...this.state,
			updatePoll: this.updatePoll,
		});
	}
}
