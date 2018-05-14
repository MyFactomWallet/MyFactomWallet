import React, { Component } from 'react';
import styled from 'styled-components';
import Sidebar from '../Sidebar/Sidebar.js';
import TransactionPreview from './TransactionPreview.js';

import { NavLink, Route } from 'react-router-dom';

class WalletManager extends Component {
	state = {
		wallets: [1, 2, 3],
		activeWalletID: 1,
		sendDollarAmount: 0
	};

	render() {
		const match = this.props.match;
		const walletID = this.props.match.params.walletID;
		const activeTabStyle = {
			borderBottomWidth: '7px',
			borderBottomColor: 'white',
			borderBottomStyle: 'solid',
			opacity: 'unset'
		};
		return (
			<div>
				<StyledSidebarWallets
					addWallet={this.addWallet}
					selectWallet={this.selectWallet}
					wallets={this.state.wallets}
					activeWalletID={this.state.activeWalletID}
				/>
				<WalletContainer>
					<WalletContainerTabs>
						<StyledLink activeStyle={activeTabStyle} to={`${match.url}/send`}>
							Send Factoid
						</StyledLink>
						<StyledLink
							activeStyle={activeTabStyle}
							to={`${match.url}/receive`}
						>
							Receive Factoid
						</StyledLink>
						<StyledLink activeStyle={activeTabStyle} to={`${match.url}/backup`}>
							Backup Wallet
						</StyledLink>
					</WalletContainerTabs>
					<Route
						path={`${match.url}/send`}
						render={() => (
							<WalletSend updateSendAmount={this.updateSendAmount} test={1} />
						)}
					/>
					<Route
						path={`${match.url}/send`}
						render={() => (
							<TransactionPreview
								networkFee={0.02}
								dollarAmount={this.state.sendDollarAmount}
							/>
						)}
					/>
				</WalletContainer>
				<Route path={`${match.url}/send`} render={() => <SendButton />} />
			</div>
		);
	}

	addWallet = (newID) => {
		this.setState((prevState) => ({
			wallets: prevState.wallets.concat(newID),
			activeWalletID: newID
		}));
	};

	updateSendAmount = (amount) => {
		this.setState((prevState) => ({
			sendDollarAmount: amount
		}));
	};

	selectWallet = (walletID) => {
		this.setState((prevState) => ({
			activeWalletID: walletID
		}));
	};
}

const SendButton = (props) => {
	return (
		<div>
			<Submit onClick={() => alert('Sent!')}>Send Funds</Submit>
			<br />
			<SendWarning>
				Please verify all details are correct before hitting send.<br />We can
				not reverse mistaken transactions.
			</SendWarning>
		</div>
	);
};

class WalletSend extends Component {
	handleChange = (event) => {
		this.props.updateSendAmount(event.target.value);
	};

	render() {
		return (
			<div>
				<FormItem>
					<Label htmlFor="recipientInput">Recipient</Label>
					<HelpText>Send to one of my wallets</HelpText>
					<br />
					<SendInput
						type="text"
						name="recipientInput"
						placeholder="Enter recipient address"
						required
					/>
				</FormItem>
				<br />
				<FormItem>
					<Label htmlFor="amountInput">Amount</Label>
					<HelpText>Use Max</HelpText>
					<br />
					<SendInput
						type="number"
						name="amountInput"
						placeholder="Enter Amount ($)"
						onChange={this.handleChange}
						required
					/>
				</FormItem>
			</div>
		);
	}
}

const FormItem = styled.div`
	text-align: left;
	padding-left: 24px;
	padding-right: 40px;
`;

const Label = styled.label`
	width: 33px;
	height: 18px;
	font-weight: bold;
	color: #001830;
	letter-spacing: normal;
	margin-left: 12px;
`;

const HelpText = styled.div`
	font-size: 12px;
	font-weight: bold;
	text-align: right;
	float: right;
	color: #007eff;
	letter-spacing: normal;
`;

const SendInput = styled.input`
	width: 651px;
	height: 55px;
	border-radius: 6px;
	border: none;
	background-color: #eef1f4;
	font-size: 20px;
	font-weight: 300;
	padding-left: 12px;
	margin-top: 7px;
	color: #007eff;
	outline-style: none;
	&:focus {
		background-color: #e6f3ff;
		border: solid 1px #007eff;
	}
`;

const Submit = styled.button`
	color: #ffffff;
	width: 730px;
	height: 60px;
	border-radius: 6px;
	background-image: linear-gradient(to bottom, #ffa539, #ff8600);
	margin-top: 16px;
	font-size: 20px;
	font-weight: bold;
	float: right;
	cursor: pointer;
`;

const SendWarning = styled.div`
	width: 730px;
	height: 44px;
	opacity: 0.75;
	font-family: OpenSans;
	font-size: 14px;
	line-height: 1.57;
	color: #ffffff;
	margin-top: 16px;
	text-align: center;
	float: right;
`;

const WalletContainer = styled.div`
	width: 730px;
	height: 626px;
	border-radius: 10px;
	box-shadow: 0 2px 13px 0 rgba(0, 16, 53, 0.5);
	margin-top: 44px;
	margin-left: 500px;
	background-color: white;
	text-align: center;
	font-size: 14px;
	font-weight: 500;
	letter-spacing: 1.4px;
	padding-top: 10px;
`;

const WalletContainerTabs = styled.div`
	margin-bottom: 50px;
	background-color: #103152;
	border-top-left-radius: 6px;
	border-top-right-radius: 6px;
	margin-top: -10px;
	text-align: center;
	padding-top: 35px;
	padding-bottom: 35px;
`;

const StyledLink = styled(NavLink)`
	color: #ffffff;
	height: 77px;
	padding: 28px;
	opacity: 0.5;
`;

const StyledSidebarWallets = styled(Sidebar)`
	float: left;
	margin-left: 81px;
`;

export default WalletManager;
