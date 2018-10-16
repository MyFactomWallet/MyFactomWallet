import React from 'react';

const NetworkContext = React.createContext();

const withNetwork = (BaseComponent) => (props) => (
	<NetworkContext.Consumer>
		{(networkController) => (
			<BaseComponent {...props} networkController={networkController} />
		)}
	</NetworkContext.Consumer>
);

export { NetworkContext, withNetwork };
