export const BINARY_CONFIG = { name: 'Binary Voting', type: 0, numOptions: 1 };
export const SINGLE_OPTION_CONFIG = {
	name: 'Single Option Voting',
	type: 1,
	numOptions: 1,
};
export const APPROVAL_CONFIG = { name: 'Approval Voting', type: 1 };
export const INSTANT_RUNOFF_CONFIG = {
	name: 'Instant Runoff Voting',
	type: 2,
};

export const ALL_ELIGIBLE_VOTERS = 'All Eligible Voters';
export const PARTICIPANTS_ONLY = 'Participants Only';
