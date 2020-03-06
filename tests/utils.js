const bip44 = require('factombip44');
const Big = require('big.js');
import {
	bip32Account,
	FACTOID_MULTIPLIER,
	FACTOSHI_MULTIPLIER,
} from './constants';
import { Transaction } from 'factom/dist/factom';

import {
	isValidPublicEcAddress,
	isValidPublicFctAddress,
	seedToPrivateFctAddress,
	seedToPrivateEcAddress,
} from 'factom/dist/factom';

export const getFctPrivateKey = (mnemonic, address, index) => {
	let privateKey = null;
	const wallet = new bip44.FactomBIP44(mnemonic);
	if (isValidPublicFctAddress(address)) {
		const key = wallet.generateFactoidPrivateKey(bip32Account, 0, index);
		privateKey = seedToPrivateFctAddress(key);
	}

	return privateKey;
};

export const getEcPrivateKey = (mnemonic, address, index) => {
	let privateKey = null;
	const wallet = new bip44.FactomBIP44(mnemonic);
	if (isValidPublicEcAddress(address)) {
		const key = wallet.generateEntryCreditPrivateKey(bip32Account, 0, index);
		privateKey = seedToPrivateEcAddress(key);
	}

	return privateKey;
};

export const toFactoshis = (factoids) => {
	return factoids * FACTOID_MULTIPLIER;
};

export const toFactoids = (factoshis) => {
	const bigFactoshis = new Big(factoshis);
	const factoids = bigFactoshis.times(FACTOSHI_MULTIPLIER);

	return factoids.valueOf();
};

export const getMaxFactoshis = (balance, fee) => {
	const balanceInFactoshis = new Big(balance);
	const maxFactoshis = balanceInFactoshis.minus(fee);
	if (maxFactoshis < 0) {
		return 0;
	}

	return maxFactoshis.valueOf();
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
