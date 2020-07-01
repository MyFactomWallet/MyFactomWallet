import React, { useContext } from 'react';
import { NetworkContext } from '../../context/NetworkContext';
import OpenInNew from '@material-ui/icons/OpenInNew';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

const TransactionMessage = ({ transactionID }) => {
	const { networkProps } = useContext(NetworkContext);

	const href =
		networkProps.explorerURL +
		networkProps.transactionUrlSuffix +
		transactionID;

	if (networkProps.network === 'mainnet') {
		return <MainnetMessage href={href} />;
	} else if (networkProps.network === 'testnet') {
		return <TestnetMessage href={href} />;
	}
};

const MainnetMessage = ({ href }) => (
	<Typography>
		The transaction status is available in the{' '}
		<Tooltip title="Open Factom Explorer">
			<a target="_blank" rel="noopener noreferrer" href={href}>
				Factom Explorer.
				<OpenInNew color="primary" style={{ fontSize: 15 }} />
			</a>
		</Tooltip>{' '}
		Funds are available for use immediately.
		<br />
	</Typography>
);

const TestnetMessage = ({ href }) => (
	<Typography>
		This transaction will be visible{' '}
		<Tooltip title="Open Factom Explorer">
			<a target="_blank" rel="noopener noreferrer" href={href}>
				here <OpenInNew color="primary" style={{ fontSize: 15 }} />
			</a>
		</Tooltip>{' '}
		in 10-15 minutes, after being included in the next Factom block currently
		being processed by the blockchain. Funds are available for use immediately.
		<br />
	</Typography>
);

export default TransactionMessage;
