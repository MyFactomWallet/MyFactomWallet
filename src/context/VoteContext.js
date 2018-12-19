import React from 'react';

const VoteContext = React.createContext();

const withVote = (BaseComponent) => (props) => (
	<VoteContext.Consumer>
		{(voteController) => (
			<BaseComponent {...props} voteController={voteController} />
		)}
	</VoteContext.Consumer>
);

export { VoteContext, withVote };
