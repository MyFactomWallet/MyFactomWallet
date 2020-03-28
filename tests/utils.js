const bip44 = require('factombip44');
const Big = require('big.js');
import { Transaction } from 'factom/dist/factom';

import { FACTOID_MULTIPLIER, FACTOSHI_MULTIPLIER } from './constants';

import {
	isValidPublicEcAddress,
	isValidPublicFctAddress,
	seedToPrivateFctAddress,
	seedToPrivateEcAddress,
} from 'factom/dist/factom';

export const getFctPrivateKey = (mnemonic, address, index, bip32Account) => {
	let privateKey = null;
	const wallet = new bip44.FactomBIP44(mnemonic);
	if (isValidPublicFctAddress(address)) {
		const key = wallet.generateFactoidPrivateKey(bip32Account, 0, index);
		privateKey = seedToPrivateFctAddress(key);
	}

	return privateKey;
};

export const getEcPrivateKey = (mnemonic, address, index, bip32Account) => {
	let privateKey = null;
	const wallet = new bip44.FactomBIP44(mnemonic);
	if (isValidPublicEcAddress(address)) {
		const key = wallet.generateEntryCreditPrivateKey(bip32Account, 0, index);
		privateKey = seedToPrivateEcAddress(key);
	}

	return privateKey;
};

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

export const getMaxFactoshis = (balance, fee) => {
	const maxFactoshis = minusBig(balance, fee);
	if (maxFactoshis < 0) {
		return 0;
	}
	return maxFactoshis;
};

export const getFactoshiFee = (ecRate) => {
	const exampleAddress = 'FA3E6enA33y9f5K9q9nrWfcDNrVR4zAp4xpniizNjQbV4RAmPjat';

	const fee = Transaction.builder()
		.input(exampleAddress, Number.MAX_SAFE_INTEGER)
		.output(exampleAddress, Number.MAX_SAFE_INTEGER)
		.build()
		.computeRequiredFees(ecRate, { rcdType: 1 });

	return fee;
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
