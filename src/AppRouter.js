import { Route, Switch } from 'react-router-dom';
import _flowRight from 'lodash/flowRight';
import React, { Component } from 'react';
import { withWalletContext } from './context/WalletContext';
import WalletManager from './walletManager/WalletManager';
import AddInitialWallet from './addWallet/AddInitialWallet';

class AppRouter extends Component {
	render() {
		const {
			walletController: {
				readyToManageWallet,
				isWalletEmpty,
				setReadyToManageWallet,
			},
		} = this.props;

		return (
			<Switch>
				<Route
					exact
					path="/"
					render={() =>
						readyToManageWallet && !isWalletEmpty() ? (
							<WalletManager />
						) : (
							<AddInitialWallet
								setReadyToManageWallet={setReadyToManageWallet}
							/>
						)
					}
				/>
				<Route path="/test" render={() => <div>hi</div>} />
			</Switch>
		);
	}
}

const enhancer = _flowRight(withWalletContext);

export default enhancer(AppRouter);
