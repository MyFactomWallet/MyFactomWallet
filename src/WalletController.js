import React from 'react';

export default class WalletController extends React.Component {
	state = {
		selectedFCTIndex: 0,
		factoidWallets: [
			{
				address: 'XXXXXX',
				nickname: "David's wallet",
			},
		],
		ecWallets: [
			{
				address: '',
				nickname: '',
			},
		],
	};

	addFactoidWallet = (address) => {
		this.setState((prevState) => ({
			factoidWallets: [...prevState.factoidWallets, address],
		}));
	};
	addECWallet = (address) => {
		this.setState((prevState) => ({
			ecWallets: [...prevState.ecWallets, address],
		}));
	};

	render() {
		return this.props.children({
			...this.state,
			addFactoidWallet: this.addFactoidWallet,
			addECWallet: this.addECWallet,
		});
	}
}
