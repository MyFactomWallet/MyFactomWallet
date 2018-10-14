import React from 'react';
import { WalletContext } from './WalletContext';
import { withFactomCli } from './FactomCliContext';
import { Transaction } from 'factom/dist/factom-struct';

const FACTOSHI_MULTIPLIER = 0.00000001;
const BIP_32_ACCOUNTS = { mainnet: 0, testnet: 2147483647 }; // network controller
const BIP_32_COIN_TYPES = { FCT: 131, EC: 132 };

class WalletController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			addresses: {
				mainnet: {
					fct: [this.mainnetFCTAddresses],
					ec: [this.mainnetECAddresses],
				},
				testnet: {
					fct: [this.testnetFCTAddresses],
					ec: [this.testnetECAddresses],
				},
			},
			//===================================================
			activeFctWalletIndex: 0,
			sendFactoidFee: undefined,
			factoidWallets: this.testnetFCTAddresses, //testnetFCTAddresses, mainnetFCTAddresses
			ecWallets: this.testnetECAddresses, //testnetECAddresses, mainnetECAddresses
			addFactoidWallet: this.addFactoidWallet,
			addECWallet: this.addECWallet,
			selectFactoidWallet: this.selectFactoidWallet,
			getActiveFctWallet: this.getActiveFctWallet,
			updateBalances: this.updateBalances,
		};
	}

	componentDidMount() {
		this.updateBalances();
		this.updateSendFactoidFee();
	}

	addFactoidWallet = (address, nickname) => {
		this.setState(
			(prevState) => ({
				factoidWallets: [...prevState.factoidWallets, { address, nickname }],
				activeFctWalletIndex: prevState.factoidWallets.length,
			}),
			this.updateBalances
		);
	};

	addECWallet = (address, nickname) => {
		this.setState(
			(prevState) => ({
				ecWallets: [...prevState.ecWallets, { address, nickname }],
			}),
			this.updateBalances
		);
	};

	selectFactoidWallet = (index) => {
		this.setState({
			activeFctWalletIndex: index,
		});
	};

	getActiveFctWallet = () => {
		return this.state.factoidWallets[this.state.activeFctWalletIndex];
	};

	updateWalletBalance = async (wallet) => {
		const balance = await this.props.factomCliController.factomCli.getBalance(
			wallet.address
		);

		return { ...wallet, balance };
	};

	updateBalances = async () => {
		const [factoidWallets, ecWallets] = await Promise.all([
			Promise.all(this.state.factoidWallets.map(this.updateWalletBalance)),
			Promise.all(this.state.ecWallets.map(this.updateWalletBalance)),
		]);

		this.setState({ factoidWallets, ecWallets });
	};

	getEntryCreditRate = async () => {
		return await this.props.factomCliController.factomCli.getEntryCreditRate();
	};

	getEstimatedECFee = (ecRate) => {
		const exampleAddress =
			'FA3E6enA33y9f5K9q9nrWfcDNrVR4zAp4xpniizNjQbV4RAmPjat';

		const fee = Transaction.builder()
			.input(exampleAddress, Number.MAX_SAFE_INTEGER)
			.output(exampleAddress, Number.MAX_SAFE_INTEGER)
			.build()
			.computeRequiredFees(ecRate, { rcdType: 1 });
		return fee;
	};

	getSendFactoidFee = async () => {
		const ecRate = await this.getEntryCreditRate();

		const ecFee = this.getEstimatedECFee(ecRate);

		//fix floating point decimal
		return ecFee * FACTOSHI_MULTIPLIER * ecRate;
	};

	updateSendFactoidFee = async () => {
		const sendFactoidFee = await this.getSendFactoidFee();
		this.setState({ sendFactoidFee });
	};

	newStandardAddress = ({ address, nickname }) => ({
		type: 'standard',
		address,
		nickname,
		balance: null,
		transactions: [],
	});

	newSeedAddress = ({ address, nickname, index }) => ({
		type: 'seed',
		address,
		nickname,
		balance: null,
		transactions: [],
		index,
	});

	newLedgerAddress = ({ address, nickname, index }) => ({
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
			//ALL
			type: '', //standard, seed, ledger
			address: 'FA2FSkSgGnZu7kF8nw5Sj1GYBt1BvSR1wpKY4JVMtCn3hPZnaXiT',
			nickname: 'Testnet Wallet A',
			balance: 0,
			transactions: [
				'TXID#1Placeholder',
				'TXID#2Placeholder',
				'TXID#3Placeholder',
			],
			//SPECIAL
			index: '',
		},
		{
			address: 'FA3mqYWmgmFdwfqkR9avyR1a78XW6rvVVh2qGm28tUKs7fTm2o6x',
			nickname: 'Testnet Wallet B',
			balance: 0,
			transactions: [],
		},
		{
			address: 'FA211akgFTpra5n7MbEg6YMPDMh9JitQxQshBASB5A2ecKtx1Q3q',
			nickname: 'Testnet Wallet C',
			balance: 0,
			transactions: [],
		},
	];
	mainnetFCTAddresses = [
		{
			address: 'FA2MZs5wASMo9cCiKezdiQKCd8KA6Zbg2xKXKGmYEZBqon9J3ZKv',
			nickname: 'Ledger Wallet',
		},
		{
			address: 'FA2MZs5wASMo9cCiKezdiQKCd8KA6Zbg2xKXKGmYEZBqon9J3ZKv',
			nickname: 'Seed Wallet',
		},

		{
			address: 'FA2MZs5wASMo9cCiKezdiQKCd8KA6Zbg2xKXKGmYEZBqon9J3ZKv',
			nickname: 'Seed Wallet',
		},
		{
			address: 'FA3pmaLxeLVypHij9WRyaqxruhdkNiPe4VML6FPBheuAhN6Mebtm',
			nickname: 'Exchange Wallet',
		},
		{
			address: 'FA2HnDrH4KUygYvD9aZ1yBBDnkYA9tdaDiZjWZqFpJgYMhvimo8p',
			nickname: 'Work Wallet',
		},
		{
			address: 'FA3foTbdFEkEyvjeUEZ6PDPddrtntsB3xoRm9qNdLHLSVtu2mpwy',
			nickname: 'Wallet #4',
		},

		{
			address: 'FA3foTbdFEkEyvjeUEZ6PDPddrtntsB3xoRm9qNdLHLSVtu2mpwy',
			nickname: 'Wallet #4',
		},
	];
	testnetECAddresses = [
		{
			address: 'EC27kDNpFcJQwvdpFXaXjPqhtDSf6VK8kRN8Fv7EkhvS9tVkuAfX',
			nickname: 'EC Wallet A',
			balance: 0,
			transactions: [],
		},
		{
			address: 'EC2TuKK9byegSGiGtcD8DYa15s6vZRrv2UWRmUf7rKfsUGjcxA4h',
			nickname: 'EC Wallet B',
			balance: 0,
			transactions: [],
		},
		{
			address: 'EC3QVDcZ88chcKxHnatyigwq4nSZbsY56B6Q7HuyL9yUEFSoSf6Q',
			nickname: 'EC4',
			balance: 0,
			transactions: [],
		},
	];
	mainnetECAddresses = [
		{
			address: 'EC27kDNpFcJQwvdpFXaXjPqhtDSf6VK8kRN8Fv7EkhvS9tVkuAfX',
			nickname: 'EC Wallet C',
		},

		{
			address: 'EC3QVDcZ88chcKxHnatyigwq4nSZbsY56B6Q7HuyL9yUEFSoSf6Q',
			nickname: 'EC3',
		},
		{
			address: 'EC3QVDcZ88chcKxHnatyigwq4nSZbsY56B6Q7HuyL9yUEFSoSf6Q',
			nickname: 'EC4',
		},
		{
			address: 'EC3QVDcZ88chcKxHnatyigwq4nSZbsY56B6Q7HuyL9yUEFSoSf6Q',
			nickname: 'EC5',
		},
	];
}

export default withFactomCli(WalletController);
