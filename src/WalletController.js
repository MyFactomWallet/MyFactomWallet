import React from 'react';

export default class WalletController extends React.Component {
	state = {
		activeFctWalletIndex: 0,
		factoidWallets: [
			{
				address: 'FA2MZs5wASMo9cCiKezdiQKCd8KA6Zbg2xKXKGmYEZBqon9J3ZKv',
				nickname: 'Seed Wallet',
			},
			{
				address: 'FA3pmaLxeLVypHij9WRyaqxruhdkNiPe4VML6FPBheuAhN6Mebtm',
				nickname: 'Exchange Wallet',
			},
		],
		ecWallets: [
			{
				address: '',
				nickname: '',
			},
		],
	};

	addFactoidWallet = (address, nickname) => {
		this.setState((prevState) => ({
			factoidWallets: [
				...prevState.factoidWallets,
				{ address: address, nickname: nickname },
			],
			activeFctWalletIndex: prevState.factoidWallets.length,
		}));
	};

	addECWallet = (address) => {
		this.setState((prevState) => ({
			ecWallets: [...prevState.ecWallets, address],
		}));
	};

	selectFactoidWallet = (index) => {
		this.setState((prevState) => ({
			activeFctWalletIndex: index,
		}));
	};

	render() {
		return this.props.children({
			...this.state,
			addFactoidWallet: this.addFactoidWallet,
			addECWallet: this.addECWallet,
			selectFactoidWallet: this.selectFactoidWallet,
		});
	}
}

/*
function FactomWallet(id, publicAddress, balance) {
	if (!publicAddress) {
		const privateKey = fctUtils.randomPrivateKey();

		publicAddress = fctUtils.publicFactoidKeyToHumanAddress(
			fctUtils.privateKeyToPublicKey(privateKey)
		);
	}

	this.id = id;
	this.public_address = publicAddress;
	this.balance = balance ? balance : '?';
}
*/
