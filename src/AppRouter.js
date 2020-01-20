import { Route, Switch } from 'react-router-dom';
import _flowRight from 'lodash/flowRight';
import React from 'react';
import { withWalletContext } from './context/WalletContext';
import WalletManager from './walletManager/WalletManager';
import AddInitialWallet from './addWallet/AddInitialWallet';

function AppRouter(props) {
	const {
		walletController: {
			readyToManageWallet,
			isWalletEmpty,
			setReadyToManageWallet,
		},
	} = props;

	return (
		<Switch>
			<Route
				path="/"
				render={() =>
					readyToManageWallet && !isWalletEmpty() ? (
						<WalletManager />
					) : (
						<AddInitialWallet setReadyToManageWallet={setReadyToManageWallet} />
					)
				}
			/>
		</Switch>
	);
}

const enhancer = _flowRight(withWalletContext);

export default enhancer(AppRouter);
