import React from 'react';
import _flowRight from 'lodash/flowRight';
import { SeedContext } from './SeedContext';
import { withFactomCli } from './FactomCliContext';
import { withNetwork } from './NetworkContext';
import { withWalletContext } from './WalletContext';
import {
	isValidPublicEcAddress,
	isValidPublicFctAddress,
	seedToPrivateFctAddress,
	seedToPrivateEcAddress,
	getPublicAddress,
} from 'factom/dist/factom';
import factombip44 from 'factombip44/dist/factombip44';

/**
 * Constants
 */
const keyToFctAddress = (key) => getPublicAddress(seedToPrivateFctAddress(key));
const keyToECAddress = (key) => getPublicAddress(seedToPrivateEcAddress(key));

class SeedController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			getSeedAddresses: this.getSeedAddresses,
			signWithSeed: this.signWithSeed,
			signConvertToPFCT: this.signConvertToPFCT,
			verifySeed: this.verifySeed,
			getRandomMnemonic: this.getRandomMnemonic,
			getPrivateKey: this.getPrivateKey,
		};
	}

	getSeedAddresses = async (mnemonic, startIndex, amount, type) => {
		let result = [];

		const bip32Account = this.props.networkController.networkProps.bip32Account;

		const wallet = new factombip44.FactomBIP44(mnemonic);

		for (let index = startIndex; index < startIndex + amount; index++) {
			let key = null;
			let address = null;

			if (type === 'fct') {
				key = wallet.generateFactoidPrivateKey(bip32Account, 0, index);
				address = keyToFctAddress(key);
			} else if (type === 'ec') {
				key = wallet.generateEntryCreditPrivateKey(bip32Account, 0, index);
				address = keyToECAddress(key);
			}

			result.push({ address, index });
		}

		const addressList = await Promise.all(
			result.map(this.props.walletController.updateWalletBalance)
		);

		return addressList;
	};

	signWithSeed = async ({ mnemonic, index, toAddr, amount, type }) => {
		let signedTX = {};

		const bip32Account = this.props.networkController.networkProps.bip32Account;

		const wallet = new factombip44.FactomBIP44(mnemonic);

		const privateKey = seedToPrivateFctAddress(
			wallet.generateFactoidPrivateKey(bip32Account, 0, index)
		);

		if (type === 'sendFCT') {
			signedTX = await this.props.factomCliController.factomCli.createFactoidTransaction(
				privateKey,
				toAddr,
				amount
			);
		} else if (type === 'convertFCT') {
			signedTX = await this.props.factomCliController.factomCli.createEntryCreditPurchaseTransaction(
				privateKey,
				toAddr,
				amount
			);
		}

		return signedTX;
	};

	signConvertToPFCT = ({ mnemonic, index, amount }) => {
		let signedTX = {};

		const bip32Account = this.props.networkController.networkProps.bip32Account;

		const wallet = new factombip44.FactomBIP44(mnemonic);

		const key = seedToPrivateFctAddress(
			wallet.generateFactoidPrivateKey(bip32Account, 0, index)
		);

		signedTX = this.props.walletController.signConvertToPFCT({
			key,
			amount,
		});

		return signedTX;
	};

	verifySeed = (mnemonic, { address, index }) => {
		try {
			const wallet = new factombip44.FactomBIP44(mnemonic);
			const bip32Account = this.props.networkController.networkProps
				.bip32Account;

			let derivedAddress = null;
			if (isValidPublicFctAddress(address)) {
				derivedAddress = keyToFctAddress(
					wallet.generateFactoidPrivateKey(bip32Account, 0, index)
				);
			} else if (isValidPublicEcAddress(address)) {
				derivedAddress = keyToECAddress(
					wallet.generateEntryCreditPrivateKey(bip32Account, 0, index)
				);
			}

			return derivedAddress.valueOf() === address.valueOf(); // memoize
		} catch (err) {
			return false;
		}
	};

	getRandomMnemonic() {
		return factombip44.randomMnemonic();
	}

	getPrivateKey = (mnemonic, { address, index }) => {
		const bip32Account = this.props.networkController.networkProps.bip32Account;
		const wallet = new factombip44.FactomBIP44(mnemonic);
		let privateKey = null;
		if (isValidPublicFctAddress(address)) {
			const key = wallet.generateFactoidPrivateKey(bip32Account, 0, index);
			privateKey = seedToPrivateFctAddress(key);
		} else if (isValidPublicEcAddress(address)) {
			const key = wallet.generateEntryCreditPrivateKey(bip32Account, 0, index);
			privateKey = seedToPrivateEcAddress(key);
		}
		return privateKey;
	};

	render() {
		return (
			<>
				<SeedContext.Provider value={this.state}>
					{this.props.children}
				</SeedContext.Provider>
			</>
		);
	}
}

const enhancer = _flowRight(withWalletContext, withNetwork, withFactomCli);

export default enhancer(SeedController);
