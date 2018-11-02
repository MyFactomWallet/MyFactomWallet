import React from 'react';

const SeedContext = React.createContext();

const withSeed = (BaseComponent) => (props) => (
	<SeedContext.Consumer>
		{(seedController) => (
			<BaseComponent {...props} seedController={seedController} />
		)}
	</SeedContext.Consumer>
);

export { SeedContext, withSeed };
