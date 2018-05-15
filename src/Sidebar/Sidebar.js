import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

class Sidebar extends Component {
	render() {
		const activeWalletID = this.props.activeWalletID;
		const sideBar_o = this;

		const listWallets = this.props.wallets.map(function(walletID, index) {
			const isActive = walletID === activeWalletID ? true : false;

			return (
				<Link key={index} to={'/wallet/manage/' + walletID + '/send'}>
					<WalletSmall
						amount={1203022.02}
						onClick={() => sideBar_o.props.selectWallet(walletID)}
						active={isActive}
						id={walletID}
					/>
				</Link>
			);
		});

		return (
			<span className={this.props.className}>
				{listWallets}
				<AddWallet
					onClick={() => this.props.addWallet(this.props.wallets.length + 1)}
				>
					+ New Wallet
				</AddWallet>
			</span>
		);
	}
}

const Wallet = (props) => {
	const dollarAmountText = '$' + props.amount.toLocaleString();
	const factoidAmountText = (props.amount / 25).toLocaleString() + ' FCT';

	return (
		<div className={props.className} onClick={props.onClick}>
			My Wallet #{props.id}
			<br />
			<br />
			<DollarAmount active={props.active}>{dollarAmountText}</DollarAmount>
			<br />
			<br />
			{factoidAmountText}
		</div>
	);
};

const WalletSmall = styled(Wallet)`
	width: 343px;
	height: 150px;
	border-radius: 6px;
	background-color: #103151;
	color: #ffffff;
	padding-left: 19px;
	padding-top: 17px;
	position: relative;
	margin-bottom: 40px;
	font-family: Roboto;
	font-weight: 300;
	letter-spacing: 0.4px;
	${(props) =>
		props.active
			? 'background-image: linear-gradient(to bottom, #06c7ff, #0372ff); box-shadow: 0 0 10px 0 #007eff; '
			: ''};
`;

const AddWallet = styled.div`
	font-family: Montserrat;
	font-size: 20px;
	line-height: 1.25;
	color: #007eff;
	text-align: center;
	width: 150px;
	margin: 0 auto;
	cursor: pointer;
`;

const DollarAmount = styled.span`
	font-size: 35px;

	${(props) => (props.active ? 'font-weight: 400;' : '')};
`;

export default Sidebar;
