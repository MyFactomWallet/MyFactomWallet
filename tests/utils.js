import { bip32Account } from './constants';
const bip44 = require('factombip44');

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
	return factoids * 100000000;
};

export const toFactoids = (factoshis) => {
	return factoshis * 0.00000001;
};
