import React from 'react';
import _flowRight from 'lodash/flowRight';
import _isEmpty from 'lodash/isEmpty';
import { WalletContext } from './WalletContext';
import { withFactomCli } from './FactomCliContext';
import { withNetwork } from './NetworkContext';
import {
	Transaction,
	keyToPrivateFctAddress,
	getPublicAddress,
	keyToPrivateEcAddress,
} from 'factom/dist/factom';
import factombip44 from 'factombip44/dist/factombip44';

/**
 * Constants
 */
const FACTOSHI_MULTIPLIER = 0.00000001;

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
		this.updateBalances();
		this.setDefaultIndex();
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
		const network = this.props.networkController.networkProps.network;

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
			const network = this.props.networkController.networkProps.network;

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
		const network = this.props.networkController.networkProps.network;

		return this.state.addresses[network][type];
	};

	updateWalletBalance = async (wallet) => {
		const balance = await this.props.factomCliController.factomCli.getBalance(
			wallet.address
		);

		return { ...wallet, balance };
	};

	updateBalances = async () => {
		const network = this.props.networkController.networkProps.network;

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
	});

	newSeedAddress = (address, nickname, index) => ({
		importType: 'seed',
		address,
		nickname,
		balance: null,
		transactions: [],
		index,
	});

	newLedgerAddress = (address, nickname, index) => ({
		importType: 'ledger',
		address,
		nickname,
		balance: null,
		transactions: [],
		index,
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
			importType: 'standard', //standard, seed, ledger
			address: 'FA2FSkSgGnZu7kF8nw5Sj1GYBt1BvSR1wpKY4JVMtCn3hPZnaXiT',
			nickname: 'Testnet Wallet A',
			balance: null,
			transactions: [],
		},
		{
			importType: 'standard',
			address: 'FA3mqYWmgmFdwfqkR9avyR1a78XW6rvVVh2qGm28tUKs7fTm2o6x',
			nickname: 'Testnet Wallet B',
			balance: null,
			transactions: [],
		},
		{
			importType: 'standard',
			address: 'FA211akgFTpra5n7MbEg6YMPDMh9JitQxQshBASB5A2ecKtx1Q3q',
			nickname: 'Testnet Wallet C',
			balance: null,
			transactions: [],
		},
	];
	mainnetFCTAddresses = [
		{
			importType: 'standard',
			address: 'FA2MZs5wASMo9cCiKezdiQKCd8KA6Zbg2xKXKGmYEZBqon9J3ZKv',
			nickname: 'My Wallet',
			balance: null,
			transactions: [],
		},
		{
			importType: 'standard',
			address: 'FA2MZs5wASMo9cCiKezdiQKCd8KA6Zbg2xKXKGmYEZBqon9J3ZKv',
			nickname: 'Standard Wallet',
			balance: null,
			transactions: [],
		},

		{
			importType: 'standard',
			address: 'FA2MZs5wASMo9cCiKezdiQKCd8KA6Zbg2xKXKGmYEZBqon9J3ZKv',
			nickname: 'Standard Wallet',
			balance: null,
			transactions: [],
		},
		{
			importType: 'standard',
			address: 'FA3pmaLxeLVypHij9WRyaqxruhdkNiPe4VML6FPBheuAhN6Mebtm',
			nickname: 'Exchange Wallet',
			balance: null,
			transactions: [],
		},
		{
			importType: 'standard',
			address: 'FA2HnDrH4KUygYvD9aZ1yBBDnkYA9tdaDiZjWZqFpJgYMhvimo8p',
			nickname: 'Work Wallet',
			balance: null,
			transactions: [],
		},
		{
			importType: 'standard',
			address: 'FA3foTbdFEkEyvjeUEZ6PDPddrtntsB3xoRm9qNdLHLSVtu2mpwy',
			nickname: 'Wallet #4',
			balance: null,
			transactions: [],
		},
	];
	testnetECAddresses = [
		{
			importType: 'standard',
			address: 'EC27kDNpFcJQwvdpFXaXjPqhtDSf6VK8kRN8Fv7EkhvS9tVkuAfX',
			nickname: 'EC Wallet A',
			balance: null,
			transactions: [],
		},
		{
			importType: 'standard',
			address: 'EC2TuKK9byegSGiGtcD8DYa15s6vZRrv2UWRmUf7rKfsUGjcxA4h',
			nickname: 'EC Wallet B',
			balance: null,
			transactions: [],
		},
		{
			importType: 'standard',
			address: 'EC3QVDcZ88chcKxHnatyigwq4nSZbsY56B6Q7HuyL9yUEFSoSf6Q',
			nickname: 'EC Wallet C',
			balance: null,
			transactions: [],
		},
	];
	mainnetECAddresses = [
		{
			importType: 'standard',
			address: 'EC27kDNpFcJQwvdpFXaXjPqhtDSf6VK8kRN8Fv7EkhvS9tVkuAfX',
			nickname: 'EC Wallet C',
			balance: null,
			transactions: [],
		},

		{
			importType: 'standard',
			address: 'EC3QVDcZ88chcKxHnatyigwq4nSZbsY56B6Q7HuyL9yUEFSoSf6Q',
			nickname: 'EC3',
			balance: null,
			transactions: [],
		},
		{
			importType: 'standard',
			address: 'EC3QVDcZ88chcKxHnatyigwq4nSZbsY56B6Q7HuyL9yUEFSoSf6Q',
			nickname: 'EC4',
			balance: null,
			transactions: [],
		},
		{
			importType: 'standard',
			address: 'EC3QVDcZ88chcKxHnatyigwq4nSZbsY56B6Q7HuyL9yUEFSoSf6Q',
			nickname: 'EC5',
			balance: null,
			transactions: [],
		},
	];
}

const enhancer = _flowRight(withNetwork, withFactomCli);

export default enhancer(WalletController);
