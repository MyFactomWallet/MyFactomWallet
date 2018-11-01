import React from 'react';
import _flowRight from 'lodash/flowRight';
import _flow from 'lodash/flow';
import _isEmpty from 'lodash/isEmpty';
import _noop from 'lodash/noop';
import _isNil from 'lodash/isNil';
import { WalletContext } from './WalletContext';
import { withFactomCli } from './FactomCliContext';
import { withNetwork } from './NetworkContext';
import {
	Transaction,
	keyToPrivateFctAddress,
	keyToPrivateEcAddress,
	getPublicAddress,
} from 'factom/dist/factom';
import factombip44 from 'factombip44/dist/factombip44';
import _pick from 'lodash/pick';

/**
 * Constants
 */
const FACTOSHI_MULTIPLIER = 0.00000001;
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
			isStateHydrated: false,
			isWalletEmpty: this.isWalletEmpty,
			activeAddressIndex_o: null,
			signWithSeed: this.signWithSeed,
			getSeedAddresses: this.getSeedAddresses,
			getRandomMnemonic: this.getRandomMnemonic,
			verifySeed: this.verifySeed,
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
			const prepareArray = (addressArray) =>
				addressArray.map((addr_o) => ({
					...addr_o,
					balance: null,
					transactions: [],
				}));

			const { mainnet, testnet } = localStorageAddresses;

			const storageAddresses = {
				mainnet: {
					fct: prepareArray(mainnet.fct),
					ec: prepareArray(mainnet.ec),
				},
				testnet: {
					fct: prepareArray(testnet.fct),
					ec: prepareArray(testnet.ec),
				},
			};

			await this.smartSetState((prevState) => ({
				addresses: storageAddresses,
			}));

			await this.setDefaultIndex();
			await this.updateBalances({ force: true });
		}
		await this.smartSetState({ isStateHydrated: true });
	};

	deleteAddress = async (activeAddressIndex_o) => {
		const type = activeAddressIndex_o.type;
		const { network } = this.props.networkController.networkProps;

		// create copy of current addressList
		const addressList = [...this.state.addresses[network][type]];

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

	getRandomMnemonic() {
		return factombip44.randomMnemonic();
	}

	keyToFctAddress(key) {
		return getPublicAddress(keyToPrivateFctAddress(key));
	}
	keyToECAddress(key) {
		return getPublicAddress(keyToPrivateEcAddress(key));
	}

	signWithSeed = async ({ mnemonic, index, toAddr, amount, type }) => {
		let signedTX = {};

		const bip32Account = this.props.networkController.networkProps.bip32Account;

		const wallet = new factombip44.FactomBIP44(mnemonic);

		const privateKey = keyToPrivateFctAddress(
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

	verifyKey = (privateKey, { address }) => {
		try {
			// for factom addresses
			return getPublicAddress(privateKey).valueOf() === address.valueOf();
		} catch (err) {
			return false;
		}
	};

	verifySeed = (mnemonic, { address, index }) => {
		try {
			// for factom addresses
			const wallet = new factombip44.FactomBIP44(mnemonic);
			const bip32Account = this.props.networkController.networkProps
				.bip32Account;

			const derivedAddress = this.keyToFctAddress(
				wallet.generateFactoidPrivateKey(bip32Account, 0, index)
			);

			return derivedAddress.valueOf() === address.valueOf(); // memoize
		} catch (err) {
			return false;
		}
	};

	getSeedAddresses = async (mnemonic, startIndex, amount, type) => {
		let result = [];

		const bip32Account = this.props.networkController.networkProps.bip32Account;

		const wallet = new factombip44.FactomBIP44(mnemonic);

		for (let index = startIndex; index < startIndex + amount; index++) {
			let key = null;
			let address = null;

			if (type === 'fct') {
				key = wallet.generateFactoidPrivateKey(bip32Account, 0, index);
				address = this.keyToFctAddress(key);
			} else if (type === 'ec') {
				key = wallet.generateEntryCreditPrivateKey(bip32Account, 0, index);
				address = this.keyToECAddress(key);
			}

			result.push({ address, index });
		}

		const addressList = await Promise.all(result.map(this.updateWalletBalance));

		return addressList;
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
		const balance = await this.props.factomCliController.factomCli.getBalance(
			wallet.address
		);

		return { ...wallet, balance };
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

		//fix floating point decimal
		return factoshiFee * FACTOSHI_MULTIPLIER;
	};

	newStandardAddress = (address, nickname) => ({
		importType: 'standard',
		address,
		nickname,
		balance: null,
		transactions: [],
		saveLocally: false,
	});

	newSeedAddress = (address, nickname, index) => ({
		importType: 'seed',
		address,
		nickname,
		balance: null,
		transactions: [],
		index,
		saveLocally: false,
	});

	newLedgerAddress = (address, nickname, index) => ({
		importType: 'ledger',
		address,
		nickname,
		balance: null,
		transactions: [],
		index,
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
