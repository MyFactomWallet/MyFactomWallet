import React from 'react';

const IdentityContext = React.createContext();

const withIdentity = (BaseComponent) => (props) => (
	<IdentityContext.Consumer>
		{(identityController) => (
			<BaseComponent {...props} identityController={identityController} />
		)}
	</IdentityContext.Consumer>
);

export { IdentityContext, withIdentity };
