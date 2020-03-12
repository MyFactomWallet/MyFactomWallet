import {
	FACTOID_MULTIPLIER,
	FACTOSHI_MULTIPLIER,
} from './constants/WALLET_CONSTANTS';

import Big from 'big.js';

export const toFactoshis = (factoids) => {
	return factoids * FACTOID_MULTIPLIER;
};

export const toFactoids = (factoshis) => {
	const bigFactoshis = new Big(factoshis);
	const factoids = bigFactoshis.times(FACTOSHI_MULTIPLIER);

	return factoids.toString();
};

export const addBig = (x, y) => {
	Big.RM = 0;
	const bigX = new Big(x);
	const sum = bigX.plus(y);

	return sum.toString();
};
