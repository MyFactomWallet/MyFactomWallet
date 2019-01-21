/*
 * Vote Type Values
 */
export const BINARY_CONFIG = { name: 'Binary Voting', type: 0, numOptions: 1 };
export const SINGLE_OPTION_CONFIG = {
	name: 'Single Option Voting',
	type: 1,
	numOptions: 1,
};
export const APPROVAL_CONFIG = { name: 'Approval Voting', type: 1 };
export const INSTANT_RUNOFF_CONFIG = {
	name: 'Instant-runoff Voting',
	type: 2,
};

export const VOTE_TYPE_DATA = {
	binary: BINARY_CONFIG,
	singleOption: SINGLE_OPTION_CONFIG,
	approval: APPROVAL_CONFIG,
	instantRunoff: INSTANT_RUNOFF_CONFIG,
};

export const ALL_ELIGIBLE_VOTERS = {
	text: 'All Eligible Voters',
	value: 'ALL_ELIGIBLE_VOTERS',
};

export const PARTICIPANTS_ONLY = {
	text: 'Participants Only',
	value: 'PARTICIPANTS_ONLY',
};

/**
 * Supported Hashing Algorithms
 */
export const HASH_ALGO_VALUES = [
	{ value: 'sha1', text: 'sha1' },
	{ value: 'sha256', text: 'sha256' },
	{ value: 'sha512', text: 'sha512' },
];

/**
 * Supported Hashing Algorithms
 */
export const REGEX_CHAIN_ID = /^[a-f0-9]{64}$/;

export const COMMIT_HMAC_ALGO = 'sha512';

/**
 * Poll Status
 */
export const POLL_STATUSES = {
	discussion: { value: 'discussion', displayValue: 'Discussion Phase' },
	commit: { value: 'commit', displayValue: 'Commit Phase' },
	reveal: { value: 'reveal', displayValue: 'Reveal Phase' },
	complete: { value: 'complete', displayValue: 'Complete' },
};
