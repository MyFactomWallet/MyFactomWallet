import React from 'react';
import _flowRight from 'lodash/flowRight';
import _isEmpty from 'lodash/isEmpty';
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
const LOCAL_STORAGE_PROPERTY_WHITELIST = [
	'importType',
	'address',
	'nickname',
	'index',
];

class WalletController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			addresses: {
				mainnet: {
					//mainnetFCTAddresses, mainnetECAddresses
					fct: this.mainnetFCTAddresses,
					ec: this.mainnetECAddresses,
				},
				testnet: {
					//testnetFCTAddresses, testnetECAddresses
					fct: this.testnetFCTAddresses,
					ec: this.testnetECAddresses,
				},
			},
			//===================================================
			signWithSeed: this.signWithSeed,
			getSeedAddresses: this.getSeedAddresses,
			getRandomMnemonic: this.getRandomMnemonic,
			verifySeed: this.verifySeed,
			verifyKey: this.verifyKey,
			getAddresses: this.getAddresses,
			getFactoidAddresses: this.getFactoidAddresses,
			getEntryCreditAddresses: this.getEntryCreditAddresses,
			addAddresses: this.addAddresses,
			addAddress: this.addAddress,
			activeAddressIndex_o: null,
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

	componentDidMount() {
		//get from storage
		//this.hydrateStateWithLocalStorage();
		this.saveStateToLocalStorage(); // testing
		this.updateBalances();
		this.setDefaultIndex();
	}

	deleteAddress(address, type) {
		const { network } = this.props.networkController.networkProps;

		//delete from local state

		//save to local storage
		this.saveStateToLocalStorage();
	}

	saveStateToLocalStorage() {
		const filterArray = (addressArray) =>
			addressArray
				.filter((address) => address.saveLocally)
				.map((address) => _pick(address, LOCAL_STORAGE_PROPERTY_WHITELIST));

		const { mainnet, testnet } = this.state.addresses;

		const storageAddresses = {
			addresses: {
				mainnet: { fct: filterArray(mainnet.fct), ec: filterArray(mainnet.ec) },
				testnet: { fct: filterArray(testnet.fct), ec: filterArray(testnet.ec) },
			},
		};

		//console.log(storageAddresses);
	}
	/* 
	hydrateStateWithLocalStorage() {
		// for all items in state
		for (let key in this.state) {
		  // if the key exists in localStorage
		  if (localStorage.hasOwnProperty(key)) {
			// get the key's value from localStorage
			let value = localStorage.getItem(key);
	
			// parse the localStorage string and setState
			try {
			  value = JSON.parse(value);
			  this.setState({ [key]: value });
			} catch (e) {
			  // handle empty string
			  this.setState({ [key]: value });
			}
		  }
		}
	  } */

	hydrateStateWithLocalStorage() {
		const storageAddresses = {};

		const address_o = {
			importType: 'ledger',
			address: 'FA2nS1ueCTKuLXoZuXnGChU24D4VLs13McSSwdcWYbxwnpMkAHzw',
			nickname: 'Ledger Wallet D',
			balance: null,
			transactions: [],
			index: 0,
		};

		const storageAddress_o = _pick(address_o, LOCAL_STORAGE_PROPERTY_WHITELIST);
		console.log(storageAddress_o);
		//lodash omit
	}

	setDefaultIndex = () => {
		if (!_isEmpty(this.getFactoidAddresses())) {
			this.selectAddress(0, 'fct');
		} else if (!_isEmpty(this.getEntryCreditAddresses())) {
			this.selectAddress(0, 'ec');
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

			return derivedAddress.valueOf() === address.valueOf();
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

	addAddresses = (addressList, type) => {
		const { network } = this.props.networkController.networkProps;

		this.setState(
			(prevState) => ({
				...prevState,
				addresses: {
					...prevState.addresses,
					[network]: {
						...prevState.addresses[network],
						[type]: [...prevState.addresses[network][type], ...addressList],
					},
				},
			}),
			() => {
				this.setDefaultIndex();
				this.updateBalances();
			}
		);
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
		this.setState({
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

	updateBalances = async () => {
		const { network } = this.props.networkController.networkProps;

		const [factoidAddresses, ecAddresses] = await Promise.all([
			Promise.all(
				this.state.addresses[network].fct.map(this.updateWalletBalance)
			),
			Promise.all(
				this.state.addresses[network].ec.map(this.updateWalletBalance)
			),
		]);

		this.setState((prevState) => ({
			...prevState,
			addresses: {
				...prevState.addresses,
				[network]: {
					...prevState.addresses[network],
					ec: ecAddresses,
					fct: factoidAddresses,
				},
			},
		}));
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
		return (
			<WalletContext.Provider value={this.state}>
				{this.props.children}
			</WalletContext.Provider>
		);
	}

	testnetFCTAddresses = [
		{
			importType: 'seed',
			address: 'FA26xe6wDQv3jWgddnywfcCugFgKm86uZT6r8HpK44YtVWhRipN1',
			nickname: 'Wallet D',
			balance: null,
			transactions: [],
			index: 0,
			saveLocally: true,
		},
		{
			importType: 'standard', //standard, seed, ledger
			address: 'FA2FSkSgGnZu7kF8nw5Sj1GYBt1BvSR1wpKY4JVMtCn3hPZnaXiT',
			nickname: 'Testnet Wallet A',
			balance: null,
			transactions: [],
			saveLocally: false,
		},
		{
			importType: 'standard',
			address: 'FA3mqYWmgmFdwfqkR9avyR1a78XW6rvVVh2qGm28tUKs7fTm2o6x',
			nickname: 'Testnet Wallet B',
			balance: null,
			transactions: [],
			saveLocally: false,
		},
		{
			importType: 'standard',
			address: 'FA211akgFTpra5n7MbEg6YMPDMh9JitQxQshBASB5A2ecKtx1Q3q',
			nickname: 'Testnet Wallet C',
			balance: null,
			transactions: [],
			saveLocally: false,
		},
	];
	mainnetFCTAddresses = [
		{
			importType: 'standard',
			address: 'FA2MZs5wASMo9cCiKezdiQKCd8KA6Zbg2xKXKGmYEZBqon9J3ZKv',
			nickname: 'My Wallet',
			balance: null,
			transactions: [],
			saveLocally: true,
		},
		{
			importType: 'standard',
			address: 'FA2MZs5wASMo9cCiKezdiQKCd8KA6Zbg2xKXKGmYEZBqon9J3ZKv',
			nickname: 'Standard Wallet',
			balance: null,
			transactions: [],
			saveLocally: false,
		},

		{
			importType: 'standard',
			address: 'FA2MZs5wASMo9cCiKezdiQKCd8KA6Zbg2xKXKGmYEZBqon9J3ZKv',
			nickname: 'Standard Wallet',
			balance: null,
			transactions: [],
			saveLocally: false,
		},
		{
			importType: 'standard',
			address: 'FA3pmaLxeLVypHij9WRyaqxruhdkNiPe4VML6FPBheuAhN6Mebtm',
			nickname: 'Exchange Wallet',
			balance: null,
			transactions: [],
			saveLocally: false,
		},
		{
			importType: 'standard',
			address: 'FA2HnDrH4KUygYvD9aZ1yBBDnkYA9tdaDiZjWZqFpJgYMhvimo8p',
			nickname: 'Work Wallet',
			balance: null,
			transactions: [],
			saveLocally: false,
		},
		{
			importType: 'standard',
			address: 'FA3foTbdFEkEyvjeUEZ6PDPddrtntsB3xoRm9qNdLHLSVtu2mpwy',
			nickname: 'Wallet #4',
			balance: null,
			transactions: [],
			saveLocally: false,
		},
	];
	testnetECAddresses = [
		{
			importType: 'seed',
			address: 'EC27kDNpFcJQwvdpFXaXjPqhtDSf6VK8kRN8Fv7EkhvS9tVkuAfX',
			nickname: 'EC Wallet A',
			balance: null,
			transactions: [],
			saveLocally: true,
			index: 0,
		},
		{
			importType: 'ledger',
			address: 'EC2TuKK9byegSGiGtcD8DYa15s6vZRrv2UWRmUf7rKfsUGjcxA4h',
			nickname: 'EC Wallet B',
			balance: null,
			transactions: [],
			saveLocally: false,
			index: 0,
		},
		{
			importType: 'standard',
			address: 'EC3QVDcZ88chcKxHnatyigwq4nSZbsY56B6Q7HuyL9yUEFSoSf6Q',
			nickname: 'EC Wallet C',
			balance: null,
			transactions: [],
			saveLocally: false,
		},
	];
	mainnetECAddresses = [
		{
			importType: 'standard',
			address: 'EC27kDNpFcJQwvdpFXaXjPqhtDSf6VK8kRN8Fv7EkhvS9tVkuAfX',
			nickname: 'EC Wallet C',
			balance: null,
			transactions: [],
			saveLocally: true,
		},

		{
			importType: 'standard',
			address: 'EC3QVDcZ88chcKxHnatyigwq4nSZbsY56B6Q7HuyL9yUEFSoSf6Q',
			nickname: 'EC3',
			balance: null,
			transactions: [],
			saveLocally: false,
		},
		{
			importType: 'standard',
			address: 'EC3QVDcZ88chcKxHnatyigwq4nSZbsY56B6Q7HuyL9yUEFSoSf6Q',
			nickname: 'EC4',
			balance: null,
			transactions: [],
			saveLocally: false,
		},
		{
			importType: 'standard',
			address: 'EC3QVDcZ88chcKxHnatyigwq4nSZbsY56B6Q7HuyL9yUEFSoSf6Q',
			nickname: 'EC5',
			balance: null,
			transactions: [],
			saveLocally: false,
		},
	];
}

const enhancer = _flowRight(withNetwork, withFactomCli);

export default enhancer(WalletController);
