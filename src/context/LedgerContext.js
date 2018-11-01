import React from 'react';

const LedgerContext = React.createContext();

const withLedger = (BaseComponent) => (props) => (
	<LedgerContext.Consumer>
		{(ledgerController) => (
			<BaseComponent {...props} ledgerController={ledgerController} />
		)}
	</LedgerContext.Consumer>
);

export { LedgerContext, withLedger };
