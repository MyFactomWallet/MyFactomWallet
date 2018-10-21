import React from 'react';

/**
 * Constants
 */
const FACTOSHI_MULTIPLIER = 0.00000001;

const FormatBalance = ({ balance, type }) => {
	if (type === 'fct') {
		return <FormatFCTBalance balance={balance} />;
	} else if (type === 'ec') {
		return <FormatECBalance balance={balance} />;
	}
};

const FormatFCTBalance = (props) => {
	let result = '';
	const factoshiBalance = props.balance;

	const factoidBalance = parseInt(factoshiBalance, 10) * FACTOSHI_MULTIPLIER;

	result =
		factoidBalance.toLocaleString(undefined, {
			maximumFractionDigits: 8,
		}) + ' FCT';

	return result;
};

const FormatECBalance = (props) => {
	let result = '';
	const entryCreditBalance = props.balance;

	result = parseInt(entryCreditBalance, 10) + ' EC';

	return result;
};

export { FormatBalance };
