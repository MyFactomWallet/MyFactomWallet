import React from 'react';
import _flowRight from 'lodash/flowRight';
import { WalletContext } from './WalletContext';
import { withFactomCli } from './FactomCliContext';
import { withNetwork } from './NetworkContext';
import { Transaction } from 'factom/dist/factom-struct';

const FACTOSHI_MULTIPLIER = 0.00000001;
const BIP_32_COIN_TYPES = { FCT: 131, EC: 132 };

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
			activeFctAddressIndex: 0,
			sendFactoidFee: null,
			entryCreditRate: null,
			getFctAddresses: this.getFctAddresses,
			getEcAddresses: this.getEcAddresses,
			addFactoidAddress: this.addFactoidAddress,
			addECAddress: this.addECAddress,
			selectFactoidAddress: this.selectFactoidAddress,
			getActiveFctAddress: this.getActiveFctAddress,
			updateBalances: this.updateBalances,
			getFactoshiFee: this.getFactoshiFee,
			newStandardAddress: this.newStandardAddress,
			newSeedAddress: this.newSeedAddress,
			newLedgerAddress: this.newLedgerAddress,
			getFactoidFee: this.getFactoidFee,
		};
	}

	componentDidMount() {
		this.updateBalances();
		this.updateEntryCreditRate();
	}

	addFactoidAddress = (fctAddress_o) => {
		const network = this.props.networkController.networkProps.network;

		this.setState((prevState) => ({
			...prevState,
			addresses: {
				...prevState.addresses,
				[network]: {
					...prevState.addresses[network],
					fct: [...prevState.addresses[network].fct, fctAddress_o],
				},
			},
		}));
	};

	addECAddress = (ecAddress_o) => {
		const network = this.props.networkController.networkProps.network;

		this.setState((prevState) => ({
			...prevState,
			addresses: {
				...prevState.addresses,
				[network]: {
					...prevState.addresses[network],
					ec: [...prevState.addresses[network].ec, ecAddress_o],
				},
			},
		}));
	};

	selectFactoidAddress = (index) => {
		this.setState({
			activeFctAddressIndex: index,
		});
	};

	getActiveFctAddress = () => {
		const network = this.props.networkController.networkProps.network;

		return this.state.addresses[network].fct[this.state.activeFctAddressIndex];
	};

	getFctAddresses = () => {
		const network = this.props.networkController.networkProps.network;

		return this.state.addresses[network].fct;
	};

	getEcAddresses = () => {
		const network = this.props.networkController.networkProps.network;

		return this.state.addresses[network].ec;
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

	updateEntryCreditRate = async () => {
		const entryCreditRate = await this.getEntryCreditRate();
		this.setState({ entryCreditRate });
	};

	getFactoshiFee = () => {
		const ecRate = this.state.entryCreditRate;
		const exampleAddress =
			'FA3E6enA33y9f5K9q9nrWfcDNrVR4zAp4xpniizNjQbV4RAmPjat';

		const fee = Transaction.builder()
			.input(exampleAddress, Number.MAX_SAFE_INTEGER)
			.output(exampleAddress, Number.MAX_SAFE_INTEGER)
			.build()
			.computeRequiredFees(ecRate, { rcdType: 1 });

		return fee;
	};

	getFactoidFee = () => {
		const ecFee = this.getFactoshiFee();

		//fix floating point decimal
		return ecFee * FACTOSHI_MULTIPLIER;
	};

	newStandardAddress = (address, nickname) => ({
		type: 'standard',
		address,
		nickname,
		balance: null,
		transactions: [],
	});

	newSeedAddress = (address, nickname, index) => ({
		type: 'seed',
		address,
		nickname,
		balance: null,
		transactions: [],
		index,
	});

	newLedgerAddress = (address, nickname, index) => ({
		type: 'ledger',
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
			type: 'standard', //standard, seed, ledger
			address: 'FA2FSkSgGnZu7kF8nw5Sj1GYBt1BvSR1wpKY4JVMtCn3hPZnaXiT',
			nickname: 'Testnet Wallet A',
			balance: null,
			transactions: [],
		},
		{
			type: 'standard',
			address: 'FA3mqYWmgmFdwfqkR9avyR1a78XW6rvVVh2qGm28tUKs7fTm2o6x',
			nickname: 'Testnet Wallet B',
			balance: null,
			transactions: [],
		},
		{
			type: 'standard',
			address: 'FA211akgFTpra5n7MbEg6YMPDMh9JitQxQshBASB5A2ecKtx1Q3q',
			nickname: 'Testnet Wallet C',
			balance: null,
			transactions: [],
		},
	];
	mainnetFCTAddresses = [
		{
			type: 'standard',
			address: 'FA2MZs5wASMo9cCiKezdiQKCd8KA6Zbg2xKXKGmYEZBqon9J3ZKv',
			nickname: 'My Wallet',
			balance: null,
			transactions: [],
		},
		{
			type: 'standard',
			address: 'FA2MZs5wASMo9cCiKezdiQKCd8KA6Zbg2xKXKGmYEZBqon9J3ZKv',
			nickname: 'Standard Wallet',
			balance: null,
			transactions: [],
		},

		{
			type: 'standard',
			address: 'FA2MZs5wASMo9cCiKezdiQKCd8KA6Zbg2xKXKGmYEZBqon9J3ZKv',
			nickname: 'Standard Wallet',
			balance: null,
			transactions: [],
		},
		{
			type: 'standard',
			address: 'FA3pmaLxeLVypHij9WRyaqxruhdkNiPe4VML6FPBheuAhN6Mebtm',
			nickname: 'Exchange Wallet',
			balance: null,
			transactions: [],
		},
		{
			type: 'standard',
			address: 'FA2HnDrH4KUygYvD9aZ1yBBDnkYA9tdaDiZjWZqFpJgYMhvimo8p',
			nickname: 'Work Wallet',
			balance: null,
			transactions: [],
		},
		{
			type: 'standard',
			address: 'FA3foTbdFEkEyvjeUEZ6PDPddrtntsB3xoRm9qNdLHLSVtu2mpwy',
			nickname: 'Wallet #4',
			balance: null,
			transactions: [],
		},
	];
	testnetECAddresses = [
		{
			type: 'standard',
			address: 'EC27kDNpFcJQwvdpFXaXjPqhtDSf6VK8kRN8Fv7EkhvS9tVkuAfX',
			nickname: 'EC Wallet A',
			balance: null,
			transactions: [],
		},
		{
			type: 'standard',
			address: 'EC2TuKK9byegSGiGtcD8DYa15s6vZRrv2UWRmUf7rKfsUGjcxA4h',
			nickname: 'EC Wallet B',
			balance: null,
			transactions: [],
		},
		{
			type: 'standard',
			address: 'EC3QVDcZ88chcKxHnatyigwq4nSZbsY56B6Q7HuyL9yUEFSoSf6Q',
			nickname: 'EC Wallet C',
			balance: null,
			transactions: [],
		},
	];
	mainnetECAddresses = [
		{
			type: 'standard',
			address: 'EC27kDNpFcJQwvdpFXaXjPqhtDSf6VK8kRN8Fv7EkhvS9tVkuAfX',
			nickname: 'EC Wallet C',
			balance: null,
			transactions: [],
		},

		{
			type: 'standard',
			address: 'EC3QVDcZ88chcKxHnatyigwq4nSZbsY56B6Q7HuyL9yUEFSoSf6Q',
			nickname: 'EC3',
			balance: null,
			transactions: [],
		},
		{
			type: 'standard',
			address: 'EC3QVDcZ88chcKxHnatyigwq4nSZbsY56B6Q7HuyL9yUEFSoSf6Q',
			nickname: 'EC4',
			balance: null,
			transactions: [],
		},
		{
			type: 'standard',
			address: 'EC3QVDcZ88chcKxHnatyigwq4nSZbsY56B6Q7HuyL9yUEFSoSf6Q',
			nickname: 'EC5',
			balance: null,
			transactions: [],
		},
	];
}

const enhancer = _flowRight(withNetwork, withFactomCli);

export default enhancer(WalletController);
