import React from 'react';

const FactomCliContext = React.createContext();

const withFactomCli = (BaseComponent) => (props) => (
	<FactomCliContext.Consumer>
		{(factomCliController) => (
			<BaseComponent {...props} factomCliController={factomCliController} />
		)}
	</FactomCliContext.Consumer>
);

export { FactomCliContext, withFactomCli };
