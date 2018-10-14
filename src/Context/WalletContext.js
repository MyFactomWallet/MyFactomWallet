import React from 'react';

const WalletContext = React.createContext();

const withWalletContext = (BaseComponent) => (props) => (
	<WalletContext.Consumer>
		{(walletController) => (
			<BaseComponent {...props} walletController={walletController} />
		)}
	</WalletContext.Consumer>
);

export { WalletContext, withWalletContext };
