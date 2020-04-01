import Big from 'big.js';

import {
	FACTOID_MULTIPLIER,
	FACTOSHI_MULTIPLIER,
} from './constants/WALLET_CONSTANTS';

export const toFactoshis = (factoids) => {
	const bigFactoids = new Big(factoids);
	const factoshis = bigFactoids.times(FACTOID_MULTIPLIER);

	return parseFloat(factoshis);
};

export const toFactoids = (factoshis) => {
	const bigFactoshis = new Big(factoshis);
	const factoids = bigFactoshis.times(FACTOSHI_MULTIPLIER);

	return parseFloat(factoids);
};

export const addBig = (x, y) => {
	const bigX = new Big(x);
	const sum = bigX.plus(y);

	return parseFloat(sum);
};

export const minusBig = (x, y) => {
	const bigX = new Big(x);
	const diff = bigX.minus(y);

	return parseFloat(diff);
};

export const divideBig = (x, y) => {
	const bigX = new Big(x);
	const div = bigX.div(y);

	return parseFloat(div);
};
