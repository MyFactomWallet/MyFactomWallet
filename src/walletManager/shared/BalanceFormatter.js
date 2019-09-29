import React from 'react';
import { withNetwork } from '../../context/NetworkContext';
import _flowRight from 'lodash/flowRight';
/**
 * Constants
 */
const FACTOSHI_MULTIPLIER = 0.00000001;

const FormatBalance = (props) => {
	const {
		balance,
		type,
		networkController: { networkProps },
	} = props;

	if (type === 'fct') {
		return <FormatFCTBalance balance={balance} networkProps={networkProps} />;
	} else if (type === 'ec') {
		return <FormatECBalance balance={balance} networkProps={networkProps} />;
	}
};

const FormatFCTBalance = (props) => {
	let result = '';
	const factoshiBalance = props.balance;

	const factoidBalance = parseInt(factoshiBalance, 10) * FACTOSHI_MULTIPLIER;

	result = (
		<span>
			{factoidBalance.toLocaleString(undefined, {
				maximumFractionDigits: 8,
			})}
			&nbsp;&nbsp;{props.networkProps.factoidAbbreviation}
		</span>
	);

	return result;
};

const FormatECBalance = (props) => {
	let result = '';
	const entryCreditBalance = props.balance;

	result =
		parseInt(entryCreditBalance, 10) + ' ' + props.networkProps.ecAbbreviation;

	return result;
};

const enhancer = _flowRight(withNetwork);
export default enhancer(FormatBalance);
