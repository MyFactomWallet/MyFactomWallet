export const bip32Account = 0;
export const ecNickname = 'EC Nickname';
export const FACTOID_MULTIPLIER = 100000000;
export const FACTOSHI_MULTIPLIER = 0.00000001;
export const fctNickname = 'Factoid Nickname';
export const seedWarning =
	'Write down your seed carefully on a piece of paper. This seed provides access to all the derived addresses. If you lose this seed, you will lose access to your addresses forever!';
export const updateEcNickname = 'Entry Credit Nickname';
export const convertEcAmount = 1;
export const networkProps = {
	mainnet: {
		network: 'mainnet',
		bip32Account: 0,
		factoidAbbreviation: 'FCT',
		factoidAbbreviationFull: 'Factoid',
		ecAbbreviation: 'EC',
		ecAbbreviationFull: 'Entry Credit',
		apiUrl: 'https://api.factomd.net/v2',
	},
	testnet: {
		network: 'testnet',
		bip32Account: 2147483647,
		factoidAbbreviation: 'TTS',
		factoidAbbreviationFull: 'Testoid',
		ecAbbreviation: 'TC',
		ecAbbreviationFull: 'Test Credit',
		apiUrl: 'https://dev.factomd.net/v2',
	},
};
