import React from 'react';
import PropTypes from 'prop-types';
import _flowRight from 'lodash/flowRight';
import { LedgerContext } from './LedgerContext';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import Fct from '@factoid.org/hw-app-fct';
import { withNetwork } from '../context/NetworkContext';
import { withWalletContext } from '../context/WalletContext';
import { Transaction } from 'factom/dist/factom';
/**
 * Constants
 */
const BIP_32_COIN_TYPES = { fct: 131, ec: 132, identity: 281 };

class LedgerController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isLedgerConnected: this.isLedgerConnected,
			getLedgerAddresses: this.getLedgerAddresses,
			getLedgerIdentityAddress: this.getLedgerIdentityAddress,
			signTransaction: this.signTransaction,
			signConvertToPFCT: this.signConvertToPFCT,
			signMessageRaw: this.signMessageRaw,
			checkAddress: this.checkAddress,
			storeChainId: this.storeChainId,
		};
	}

	getLedgerAddresses = async (startIndex, amount, type) => {
		const result = [];

		const bip32Account = this.props.networkController.networkProps.bip32Account;
		const coinType = BIP_32_COIN_TYPES[type];

		const transport = await TransportU2F.create();
		const ledger = new Fct(transport);

		for (let index = startIndex; index < startIndex + amount; index++) {
			const path = "44'/" + coinType + "'/" + bip32Account + "'/0/" + index;
			const address_o = await ledger.getAddress(path);

			result.push({ address: address_o.address });
		}

		transport.close();

		return result;
	};

	getLedgerIdentityAddress = async (index) => {
		const bip32Account = this.props.networkController.networkProps.bip32Account;
		const coinType = BIP_32_COIN_TYPES['identity'];

		const transport = await TransportU2F.create();
		const ledger = new Fct(transport);

		const path = "44'/" + coinType + "'/" + bip32Account + "'/0/" + index;
		const address_o = await ledger.getAddress(path);

		transport.close();

		return address_o;
	};

	signTransaction = async ({ fromAddr, toAddr, amount, index }) => {
		let signedTX = {};
		let transport = await TransportU2F.create();

		const bip32Account = this.props.networkController.networkProps.bip32Account;
		const path = "44'/131'/" + bip32Account + "'/0/" + index;

		const ledger = new Fct(transport);

		const unsignedTX = Transaction.builder()
			.input(
				fromAddr,
				amount + (await this.props.walletController.getFactoshiFee())
			)
			.output(toAddr, amount)
			.build();

		const result = await ledger.signTransaction(
			path,
			unsignedTX.marshalBinarySig.toString('hex')
		);

		if (result) {
			signedTX = Transaction.builder(unsignedTX)
				.rcdSignature(
					Buffer.from(result['r'], 'hex'),
					Buffer.from(result['s'], 'hex')
				)
				.build();
		}
		transport.close();
		return signedTX;
	};

	signConvertToPFCT = async ({ fromAddr, amount, index }) => {
		let signedTX = {};
		let transport = await TransportU2F.create();

		const bip32Account = this.props.networkController.networkProps.bip32Account;
		const path = "44'/131'/" + bip32Account + "'/0/" + index;

		const ledger = new Fct(transport);

		const unsignedTX = this.props.walletController.signConvertToPFCT({
			fromAddr,
			amount,
		});

		const result = await ledger.signTransaction(
			path,
			unsignedTX.marshalBinarySig.toString('hex')
		);

		if (result) {
			signedTX = Transaction.builder(unsignedTX)
				.rcdSignature(
					Buffer.from(result['r'], 'hex'),
					Buffer.from(result['s'], 'hex')
				)
				.build();
		}
		transport.close();
		return signedTX;
	};

	signMessageRaw = async (message) => {
		const bip32Account = this.props.networkController.networkProps.bip32Account;
		const index = 0;
		const path =
			"44'/" +
			BIP_32_COIN_TYPES['identity'] +
			"'/" +
			bip32Account +
			"'/0/" +
			index;

		let transport = await TransportU2F.create();

		try {
			const ledger = new Fct(transport);

			const result = await ledger.signMessageRaw(path, message);

			return result.s;
		} catch (err) {
			console.error('Failed to sign raw transaction from Ledger :', err);
			throw err;
		} finally {
			transport.close();
		}
	};

	checkAddress = async (activeFctWallet, type) => {
		const bip32Account = this.props.networkController.networkProps.bip32Account;
		const coinType = BIP_32_COIN_TYPES[type];

		const path =
			"44'/" + coinType + "'/" + bip32Account + "'/0/" + activeFctWallet.index;

		try {
			var transport = await TransportU2F.create();

			const ledger = new Fct(transport);

			await ledger.getAddress(path, true);

			transport.close();
		} catch (err) {
			console.error('Failed getFctAddr from Ledger Nano X/S :', err);
		}
	};

	isLedgerConnected = async () => {
		let result = false;
		try {
			let transport = await TransportU2F.create();
			const ledger = new Fct(transport);
			await ledger.getAppConfiguration();

			result = true;

			transport.close();
		} catch (err) {
			console.log('Transport Err:' + err);
		}
		return result;
	};

	storeChainId = async (chainId) => {
		let transport = await TransportU2F.create();

		try {
			const fct = new Fct(transport);

			await fct.storeChainId(chainId);
		} catch (err) {
			console.error('Failed to store chain ID to Ledger:', err);
			throw err;
		} finally {
			transport.close();
		}
	};

	render() {
		return (
			<LedgerContext.Provider value={this.state}>
				{this.props.children}
			</LedgerContext.Provider>
		);
	}
}

LedgerController.propTypes = {
	children: PropTypes.element.isRequired,
};

const enhancer = _flowRight(withWalletContext, withNetwork);

export default enhancer(LedgerController);
