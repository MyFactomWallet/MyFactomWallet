const FACTOSHI_MULTIPLIER = 0.00000001;

function FormatFCTBalance(props) {
	let result = '';
	const factoshiBalance = props.balance;

	const factoidBalance = parseInt(factoshiBalance, 10) * FACTOSHI_MULTIPLIER;

	result =
		factoidBalance.toLocaleString(undefined, {
			maximumFractionDigits: 8,
		}) + ' FCT';

	return result;
}

function FormatECBalance(props) {
	let result = '';
	const entryCreditBalance = props.balance;

	result = parseInt(entryCreditBalance, 10) + ' EC';

	return result;
}

export { FormatFCTBalance, FormatECBalance };
