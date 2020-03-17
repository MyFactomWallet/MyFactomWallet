import Big from 'big.js';

import {
	FACTOID_MULTIPLIER,
	FACTOSHI_MULTIPLIER,
} from './constants/WALLET_CONSTANTS';

export const toFactoshis = (factoids) => {
	const bigFactoids = new Big(factoids);
	const factoshis = bigFactoids.times(FACTOID_MULTIPLIER);

	return parseFloat(factoshis.toString());
};

export const toFactoids = (factoshis) => {
	const bigFactoshis = new Big(factoshis);
	const factoids = bigFactoshis.times(FACTOSHI_MULTIPLIER);

	return parseFloat(factoids.toString());
};

export const addBig = (x, y) => {
	Big.RM = 0;
	const bigX = new Big(x);
	const sum = bigX.plus(y);

	return parseFloat(sum.toString());
};
