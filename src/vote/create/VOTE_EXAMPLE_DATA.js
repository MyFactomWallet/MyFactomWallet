/*
 * Example Data
 */

export const EC_PRIV = 'Es3q9wGteUmhWBxe948wcvY6m9reXQfbeSddpKrrQfDMaBuBdUDC';
export const IDENTITY = {
	chainId: 'dfd78b9bebf0a9a89da2d807c814552ae33ff9fd57d1efe311ca4a6bed5f490b',
	key: 'idsec2wH72BNR9QZhTMGDbxwLWGrghZQexZvLTros2wCekkc62N9h7s',
};

export const VOTER_CHAIN_ID =
	'1bb663fd9463c19ff3ad179c83653763d4ede49db58f7edce48ac82aebccb908';

/**
 * Test Vote Configuration
 */

export const VOTE_EXAMPLE_CONFIG = {
	pollForm: {
		pollJSON: {
			proposal: {
				title: 'Example Poll Title',
				text: 'What is the answer to life, the universe, and everything?',
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
					commitStart: 61258,
					commitEnd: 61259,
					revealStart: 61260,
					revealEnd: 61261,
				},
				eligibleVotersChainId: null,
				type: 1,
				config: {
					options: ['a', 'b', 'c', '42'],
					allowAbstention: true,
					computeResultsAgainst: 'ALL_ELIGIBLE_VOTERS',
					minOptions: 1,
					maxOptions: 3,
					winnerCriteria: {
						minSupport: {
							'*': {
								weighted: 0.3,
								unweighted: 0.5,
							},
						},
					},
					acceptanceCriteria: {
						minTurnout: {
							weighted: 0.1,
							unweighted: 0.3,
						},
					},
				},
			},
		},
		formFields: {
			commitStartDate: '2019-01-06T03:00:00.000',
			commitEndDate: '2019-01-06T03:10:00.000',
			revealStartDate: '2019-01-06T03:20:00.000',
			revealEndDate: '2019-01-06T03:30:00.000',
			voteTypeText: 'Approval Voting',
			questionSource: 'text',
			workingText: 'What is the answer to life, the universe, and everything?',
			workingHref: '',
			workingHashValue: '',
			workingHashAlgo: '',
			workingOption: '',
			checkedTurnout: true,
			workingWeightMinTurnout: 0.1,
			workingUnweightMinTurnout: 0.3,
			workingWeightMinSupport: 0.3,
			workingUnweightMinSupport: 0.5,
			workingMinSupportOption: '',
		},
	},
	eligibleVotersForm: {
		eligibleVoters: [
			{
				voterId:
					'd12c0c85b1731a9a5108b86cd084db6230ced269d86c6aad91168d39955cbf2c',
				weight: 0.5,
			},
			{
				voterId:
					'89aa72a260fd88c6a813d9157a863db83b2327e9935a30f0e8303ae944c5b653',
				weight: 1,
			},
		],
		formFields: {
			selectedList: 'custom',
			workingIdentityChainId: '',
			workingWeight: '',
			workingEligibleChainId: VOTER_CHAIN_ID,
			loadingVoters: false,
			loadErrorMessage: '',
			loadSuccessMessage: '',
			workingFileName: '',
			workingFile: '',
		},
	},
};
