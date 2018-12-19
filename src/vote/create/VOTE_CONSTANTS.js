/*
 * Vote Type
 */
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

export const ALL_ELIGIBLE_VOTERS = {
	text: 'All Eligible Voters',
	value: 'ALL_ELIGIBLE_VOTERS',
};

export const PARTICIPANTS_ONLY = {
	text: 'Participants Only',
	value: 'PARTICIPANTS_ONLY',
};

export const VOTE_TYPES = {
	0: { ...BINARY_CONFIG },
	1: { SINGLE_OPTION_CONFIG, APPROVAL_CONFIG },
	2: { ...INSTANT_RUNOFF_CONFIG },
};

/**
 * Supported Hashing Algorithms
 */
export const HASH_ALGO_VALUES = [
	{ value: 'sha1', text: 'sha1' },
	{ value: 'sha256', text: 'sha256' },
	{ value: 'sha512', text: 'sha512' },
];
