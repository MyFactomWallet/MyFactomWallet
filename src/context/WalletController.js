import React from 'react';
import _flowRight from 'lodash/flowRight';
import _flow from 'lodash/flow';
import _isEmpty from 'lodash/isEmpty';
import _noop from 'lodash/noop';
import _isNil from 'lodash/isNil';
import _pick from 'lodash/pick';
import {
	Transaction,
	getPublicAddress,
	FactomEventEmitter,
} from 'factom/dist/factom';

import { WalletContext } from './WalletContext';
import { withFactomCli } from './FactomCliContext';
import { withNetwork } from './NetworkContext';
import { toFactoids } from '../utils';

/**
 * Constants
 */
const LOCAL_STORAGE_KEY = 'storageAddresses';
const LOCAL_STORAGE_PROPERTY_WHITELIST = [
	'importType',
	'address',
	'nickname',
	'index',
	'saveLocally',
];

class WalletController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			addresses: {
				mainnet: {
					fct: [],
					ec: [],
				},
				testnet: {
					fct: [],
					ec: [],
				},
			},
			//===================================================
			activeAddressIndex_o: null,
			isStateHydrated: false,
			readyToManageWallet: false,
			setReadyToManageWallet: this.setReadyToManageWallet,
			isWalletEmpty: this.isWalletEmpty,
			handleNetworkChange: this.handleNetworkChange,
			verifyKey: this.verifyKey,
			updateAddress: this.updateAddress,
			addAddressTransaction: this.addAddressTransaction,
			deleteAddress: this.deleteAddress,
			getAddresses: this.getAddresses,
			getFactoidAddresses: this.getFactoidAddresses,
			getEntryCreditAddresses: this.getEntryCreditAddresses,
			addAddresses: this.addAddresses,
			addAddress: this.addAddress,
			selectAddress: this.selectAddress,
			getActiveAddress: this.getActiveAddress,
			updateWalletBalance: this.updateWalletBalance,
			updateBalances: this.updateBalances,
			getEntryCreditRate: this.getEntryCreditRate,
			getFactoshiFee: this.getFactoshiFee,
			getFactoidFee: this.getFactoidFee,
			newStandardAddress: this.newStandardAddress,
			newSeedAddress: this.newSeedAddress,
			newLedgerAddress: this.newLedgerAddress,
		};
	}

	async componentDidMount() {
		//get from storage
		this.hydrateStateWithLocalStorage();
	}

	smartSetState = (newState, afterSetState = _noop) =>
		new Promise((resolve) =>
			this.setState(newState, _flow([afterSetState, resolve]))
		);

	saveStateToLocalStorage = () => {
		const filterArray = (addressArray) =>
			addressArray
				.filter((address) => address.saveLocally)
				.map((address) => _pick(address, LOCAL_STORAGE_PROPERTY_WHITELIST));

		const { mainnet, testnet } = { ...this.state.addresses };

		const storageAddresses = {
			mainnet: { fct: filterArray(mainnet.fct), ec: filterArray(mainnet.ec) },
			testnet: { fct: filterArray(testnet.fct), ec: filterArray(testnet.ec) },
		};

		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storageAddresses));
	};

	hydrateStateWithLocalStorage = async () => {
		// get local
		const localStorageAddresses = JSON.parse(
			localStorage.getItem(LOCAL_STORAGE_KEY)
		);

		if (!_isNil(localStorageAddresses)) {
			const localStorageToWalletAddresses = (addressArray) =>
				addressArray.map((addr_o) => ({
					...addr_o,
					balance: null,
					transactions: [],
					pendingAddressCallback: (pendingTransaction) => {
						this.pendingTransactionListener(pendingTransaction, addr_o.address);
					},
				}));

			const { mainnet, testnet } = localStorageAddresses;
			const factoidAddressList = localStorageToWalletAddresses(mainnet.fct);
			const testoidAddressList = localStorageToWalletAddresses(testnet.fct);

			const storageAddresses = {
				mainnet: {
					fct: factoidAddressList,
					ec: localStorageToWalletAddresses(mainnet.ec),
				},
				testnet: {
					fct: testoidAddressList,
					ec: localStorageToWalletAddresses(testnet.ec),
				},
			};

			await this.smartSetState((prevState) => ({
				addresses: storageAddresses,
			}));

			await this.setDefaultIndex();
			await this.updateBalances({ force: true });

			this.addNetworkPendingTransactionListeners();
		}
		await this.smartSetState({ readyToManageWallet: !this.isWalletEmpty() });
		await this.smartSetState({ isStateHydrated: true });
	};

	addNetworkPendingTransactionListeners = () => {
		const { network } = this.props.networkController.networkProps;
		const addressList = [...this.state.addresses[network]['fct']];

		if (addressList.length > 0) {
			this.addPendingTransactionEmitter(addressList);
		}
	};

	removeNetworkPendingTransactionListeners = () => {
		const { network } = this.props.networkController.networkProps;
		const addressList = [...this.state.addresses[network]['fct']];

		if (addressList.length > 0) {
			this.removePendingTransactionEmitter(addressList);
		}
	};

	setReadyToManageWallet = (value) => {
		this.smartSetState({
			readyToManageWallet: value,
		});
	};

	handleNetworkChange = async (network) => {
		this.removeNetworkPendingTransactionListeners();
		await this.smartSetState({ isStateHydrated: false });
		await this.props.networkController.changeNetwork(network);
		await this.props.factomCliController.connectToServer();
		this.hydrateStateWithLocalStorage();
	};

	deleteAddress = async (activeAddressIndex_o) => {
		const type = activeAddressIndex_o.type;
		const index = activeAddressIndex_o.index;
		const { network } = this.props.networkController.networkProps;

		// create copy of current addressList
		const addressList = [...this.state.addresses[network][type]];
		const addr_o = addressList[index];

		//remove address
		addressList.splice(activeAddressIndex_o.index, 1);

		// overwrite addresses
		await this.smartSetState((prevState) => ({
			addresses: {
				...prevState.addresses,
				[network]: {
					...prevState.addresses[network],
					[type]: [...addressList],
				},
			},
		}));

		await this.setDefaultIndex();

		this.saveStateToLocalStorage();

		this.removePendingTransactionEmitter([addr_o]);
	};

	addAddressTransaction = (activeAddressIndex_o, transactionID) => {
		const type = activeAddressIndex_o.type;
		const index = activeAddressIndex_o.index;
		const { network } = this.props.networkController.networkProps;

		// get address transaction list to update
		const addressList = [...this.state.addresses[network][type]];
		const addr_o = addressList[index];

		// add transaction
		addr_o.transactions.push(transactionID);

		// replace address
		addressList[activeAddressIndex_o.index] = addr_o;

		// overwrite addresses
		return this.smartSetState((prevState) => ({
			addresses: {
				...prevState.addresses,
				[network]: {
					...prevState.addresses[network],
					[type]: [...addressList],
				},
			},
		}));
	};

	updateAddress = async (activeAddressIndex_o, nickname, saveLocally) => {
		const type = activeAddressIndex_o.type;
		const { network } = this.props.networkController.networkProps;

		// create copy of current addressList
		const addressList = [...this.state.addresses[network][type]];

		// create and update copy of current address
		const addr_o = { ...addressList[activeAddressIndex_o.index] };
		addr_o.nickname = nickname;
		addr_o.saveLocally = saveLocally;

		// replace address
		addressList[activeAddressIndex_o.index] = addr_o;

		// overwrite addresses
		await this.smartSetState((prevState) => ({
			addresses: {
				...prevState.addresses,
				[network]: {
					...prevState.addresses[network],
					[type]: [...addressList],
				},
			},
		}));

		this.saveStateToLocalStorage();
	};

	isWalletEmpty = () => {
		const { network } = this.props.networkController.networkProps;

		return (
			_isEmpty(this.state.addresses[network].fct) &&
			_isEmpty(this.state.addresses[network].ec)
		);
	};

	setDefaultIndex = () => {
		if (!_isEmpty(this.getFactoidAddresses())) {
			return this.selectAddress(0, 'fct');
		} else if (!_isEmpty(this.getEntryCreditAddresses())) {
			return this.selectAddress(0, 'ec');
		} else {
			return this.smartSetState({
				activeAddressIndex_o: null,
			});
		}
	};

	verifyKey = (privateKey, { address }) => {
		try {
			// for factom addresses
			return getPublicAddress(privateKey).valueOf() === address.valueOf();
		} catch (err) {
			return false;
		}
	};

	addAddress = (address_o, type) => {
		this.addAddresses([address_o], type);

		this.selectAddress(this.getNextIndex(type), type);
	};

	addAddresses = async (addressList, type) => {
		const { network } = this.props.networkController.networkProps;

		await this.smartSetState((prevState) => ({
			addresses: {
				...prevState.addresses,
				[network]: {
					...prevState.addresses[network],
					[type]: [...prevState.addresses[network][type], ...addressList],
				},
			},
		}));
		await this.setDefaultIndex();
		await this.updateBalances();
		this.addPendingTransactionEmitter(addressList);
	};

	getNextIndex = (type) => {
		let index = 0;
		if (type === 'fct') {
			index = this.getFactoidAddresses().length - 1;
		} else if (type === 'ec') {
			index = this.getEntryCreditAddresses().length - 1;
		}
		return index;
	};

	selectAddress = (index, type) => {
		return this.smartSetState({
			activeAddressIndex_o: { index, type },
		});
	};

	getActiveAddress = () => {
		if (this.state.activeAddressIndex_o !== null) {
			const { network } = this.props.networkController.networkProps;

			return this.state.addresses[network][
				this.state.activeAddressIndex_o.type
			][this.state.activeAddressIndex_o.index];
		} else {
			return null;
		}
	};

	getFactoidAddresses = () => {
		return this.getAddresses('fct');
	};

	getEntryCreditAddresses = () => {
		return this.getAddresses('ec');
	};

	getAddresses = (type) => {
		const { network } = this.props.networkController.networkProps;

		return this.state.addresses[network][type];
	};

	updateWalletBalance = async (wallet) => {
		const balance = 0; /*await this.props.factomCliController.factomCli.getBalance(
			wallet.address
		);*/

		return { ...wallet, balance };
	};

	addPendingTransactionEmitter = (addressList) => {
		if (addressList) {
			addressList.forEach((address_o) => {
				this.props.factomCliController.factomEmitter.on(
					FactomEventEmitter.getSubscriptionToken({
						eventType: 'newPendingTransaction',
						topic: address_o.address,
					}),
					address_o.pendingAddressCallback
				);
			});
		}
	};

	removePendingTransactionEmitter = (addressList) => {
		if (addressList) {
			addressList.forEach((address_o) => {
				this.props.factomCliController.factomEmitter.removeListener(
					FactomEventEmitter.getSubscriptionToken({
						eventType: 'newPendingTransaction',
						topic: address_o.address,
					}),
					address_o.pendingAddressCallback
				);
			});
		}
	};

	pendingTransactionListener = async (pendingTransaction, pendingAddress) => {
		const { network } = this.props.networkController.networkProps;
		const factoidWallet = this.state.addresses[network].fct;

		for (const [index, address_o] of factoidWallet.entries()) {
			// update wallet address if it has a pending transaction
			if (address_o.address === pendingAddress) {
				const updatedAddress = await this.updateWalletBalance(address_o);
				factoidWallet[index] = updatedAddress;
			}
			this.smartSetState((prevState) => ({
				addresses: {
					...prevState.addresses,
					[network]: {
						...prevState.addresses[network],
						fct: factoidWallet,
					},
				},
			}));
		}
	};

	updateBalances = async ({ force = false } = {}) => {
		if (this.state.isStateHydrated || force) {
			const { network } = this.props.networkController.networkProps;

			const [factoidAddresses, ecAddresses] = await Promise.all([
				Promise.all(
					this.state.addresses[network].fct.map(this.updateWalletBalance)
				),
				Promise.all(
					this.state.addresses[network].ec.map(this.updateWalletBalance)
				),
			]);

			return this.smartSetState((prevState) => ({
				addresses: {
					...prevState.addresses,
					[network]: {
						...prevState.addresses[network],
						ec: ecAddresses,
						fct: factoidAddresses,
					},
				},
			}));
		}
	};

	getEntryCreditRate = async () => {
		return await this.props.factomCliController.factomCli.getEntryCreditRate();
	};

	getFactoshiFee = async () => {
		const ecRate = await this.getEntryCreditRate();

		const exampleAddress =
			'FA3E6enA33y9f5K9q9nrWfcDNrVR4zAp4xpniizNjQbV4RAmPjat';

		const fee = Transaction.builder()
			.input(exampleAddress, Number.MAX_SAFE_INTEGER)
			.output(exampleAddress, Number.MAX_SAFE_INTEGER)
			.build()
			.computeRequiredFees(ecRate, { rcdType: 1 });

		return fee;
	};

	getFactoidFee = async () => {
		const factoshiFee = await this.getFactoshiFee();

		return toFactoids(factoshiFee);
	};

	newStandardAddress = (address, nickname) => ({
		importType: 'standard',
		address,
		balance: null,
		nickname,
		pendingAddressCallback: (pendingTransaction) => {
			this.pendingTransactionListener(pendingTransaction, address);
		},
		transactions: [],
		saveLocally: false,
	});

	newSeedAddress = (address, nickname, index) => ({
		importType: 'seed',
		address,
		balance: null,
		nickname,
		transactions: [],
		index,
		pendingAddressCallback: (pendingTransaction) => {
			this.pendingTransactionListener(pendingTransaction, address);
		},
		saveLocally: false,
	});

	newLedgerAddress = (address, nickname, index) => ({
		importType: 'ledger',
		address,
		balance: null,
		nickname,
		transactions: [],
		index,
		pendingAddressCallback: (pendingTransaction) => {
			this.pendingTransactionListener(pendingTransaction, address);
		},
		saveLocally: false,
	});

	render() {
		if (this.state.isStateHydrated) {
			return (
				<WalletContext.Provider value={this.state}>
					{this.props.children}
				</WalletContext.Provider>
			);
		} else {
			return null;
		}
	}
}

const enhancer = _flowRight(withNetwork, withFactomCli);

export default enhancer(WalletController);
