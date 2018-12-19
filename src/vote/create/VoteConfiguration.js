import React from 'react';
import { VOTER_CHAIN_ID } from './VOTE_EXAMPLE_DATA';

export default class VoteConfiguration extends React.Component {
	state = {
		pollForm: {
			pollJSON: {
				proposal: {
					title: 'Title', //'',
					text: 'text value', //'',
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
						commitStart: 59158, //'',
						commitEnd: 59159, //'',
						revealStart: 59160, //'',
						revealEnd: 59161, //'',
					},
					eligibleVotersChainId: null, //'',
					type: 1, //'',
					config: {
						options: ['a', 'b', 'c', 'd', 'e'],
						allowAbstention: true, //'',
						computeResultsAgainst: 'ALL_ELIGIBLE_VOTERS', //'',
						minOptions: 1,
						maxOptions: 1,
						winnerCriteria: {
							minSupport: {
								b: {
									weighted: 1,
									unweighted: 1,
								},
							},
						},
						acceptanceCriteria: {
							minTurnout: {
								weighted: 1,
								unweighted: 1,
							},
						},
					},
				},
			},
			formFields: {
				commitStartDate: '12/06/2018, 7:04 PM',
				commitEndDate: '12/06/2018, 7:04 PM',
				revealStartDate: '12/06/2018, 7:04 PM',
				revealEndDate: '12/06/2018, 7:04 PM',
				voteTypeText: 'Approval Voting',
				questionSource: 'text',
				workingText: 'text value',
				workingHref: '',
				workingHashValue: '',
				workingHashAlgo: '',
				workingOption: '',
				checkedTurnout: true,
				workingWeightMinTurnout: 1,
				workingUnweightMinTurnout: 1,
				workingWeightMinSupport: 1,
				workingUnweightMinSupport: 1,
				workingMinSupportOption: 'b',
			},
		},
		eligibleVotersForm: {
			eligibleVoters: [
				{
					voterId:
						'039b14a782008c1b1543b1542941756e6f01a0d68372ff61163642382af70fc9',
					weight: 1,
				},
			],
			formFields: {
				selectedList: 'custom',
				workingVoterId: '',
				workingWeight: '',
				workingVoterChainId: VOTER_CHAIN_ID,
				loadingVoters: false,
				loadErrorMessage: '',
			},
		},
		createPollResult: {
			/* eligibleVoters: {
				txId:
					'2674edf7cef689ffa4c0e6fe3ffde296dda1b44acf6707291ba3456cd9b50bcd',
				repeatedCommit: false,
				chainId:
					'6de0876e83c081ce4ef99fd419adc274af3d7ccfba2d72bf6897ebd27ee85f7d',
				entryHash:
					'093e986b78598c990ea526a63835aadd44000cc41b35ebddc4d2f204c3831f13',
			},
			vote: {
				txId:
					'62056bad5d47afba42dac66f02994a7e2d1b958db4b1de33cee9900b3cfdbfa6',
				repeatedCommit: false,
				chainId:
					'7e4e539104ed17d1c70291a3779d4f1a2e8daa90db3333b5f49b749922fbdab8',
				entryHash:
					'a51530824b09d408b4d5ad2e454cc4704a8590aa7791cd870aadbd6ee6f83397',
			},
			registration: {
				txId:
					'e7768c8fee65b1642cd62b1e9a4c18de5b493cf449abe108c97a191a622b3c42',
				repeatedCommit: false,
				chainId:
					'a968e880ee3a7002f25ade15ae36a77c15f4dbc9d8c11fdd5fe86ba6af73a475',
				entryHash:
					'c8e69e28f95e3d0d00f20b6c424654d6a2d50a39b661d7c4d559adbebf338394',
			}, */
		},
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

/*
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
				allowAbstention:'',
				computeResultsAgainst:'',
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
		selectedList: 'standing',
		workingVoterID: '',
		workingWeight: '',
	},
},

*/
