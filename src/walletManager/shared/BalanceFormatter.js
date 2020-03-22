import React, { useContext } from 'react';
import { NetworkContext } from '../../context/NetworkContext';
import { toFactoids } from '../../utils';

const FormatBalance = (props) => {
	const { networkProps } = useContext(NetworkContext);

	const { balance, type } = props;

	if (type === 'fct') {
		return <FormatFCTBalance balance={balance} networkProps={networkProps} />;
	} else if (type === 'ec') {
		return <FormatECBalance balance={balance} networkProps={networkProps} />;
	}
};

const FormatFCTBalance = (props) => {
	const { networkProps, balance } = props;

	let result = '';

	const factoshiBalance = balance;
	const factoidBalance = toFactoids(parseInt(factoshiBalance, 10));

	result = (
		<span>
			{factoidBalance.toLocaleString(undefined, {
				maximumFractionDigits: 8,
			})}
			&nbsp;&nbsp;{networkProps.factoidAbbreviation}
		</span>
	);

	return result;
};

const FormatECBalance = (props) => {
	const { networkProps, balance } = props;

	let result = '';

	const entryCreditBalance = parseInt(balance, 10);

	result = (
		<span>
			{entryCreditBalance}
			&nbsp;&nbsp;{networkProps.ecAbbreviation}
		</span>
	);

	return result;
};

export default FormatBalance;
