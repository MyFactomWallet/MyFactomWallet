import React, { useContext } from 'react';
import { NetworkContext } from '../../context/NetworkContext';
import OpenInNew from '@material-ui/icons/OpenInNew';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

const TransactionMessage = ({ transactionID }) => {
	const { networkProps } = useContext(NetworkContext);

	if (networkProps.network === 'mainnet') {
		return (
			<MainnetMessage
				transactionID={transactionID}
				networkProps={networkProps}
			/>
		);
	} else if (networkProps.network === 'testnet') {
		return (
			<TestnetMessage
				transactionID={transactionID}
				networkProps={networkProps}
			/>
		);
	}
};

const MainnetMessage = ({ transactionID, networkProps }) => (
	<Typography>
		The transaction status is available in the{' '}
		<Tooltip title="Open Factom Explorer">
			<a
				target="_blank"
				rel="noopener noreferrer"
				href={networkProps.explorerURL + '/transactions/' + transactionID}
			>
				Factom Explorer.
				<OpenInNew color="primary" style={{ fontSize: 15 }} />
			</a>
		</Tooltip>{' '}
		Funds are available for use immediately.
		<br />
	</Typography>
);

const TestnetMessage = ({ transactionID, networkProps }) => (
	<Typography>
		This transaction will be visible{' '}
		<Tooltip title="Open Factom Explorer">
			<a
				target="_blank"
				rel="noopener noreferrer"
				href={networkProps.explorerURL + '/transaction?txid=' + transactionID}
			>
				here <OpenInNew color="primary" style={{ fontSize: 15 }} />
			</a>
		</Tooltip>{' '}
		in 10-15 minutes, after being included in the next Factom block currently
		being processed by the blockchain. Funds are available for use immediately.
		<br />
	</Typography>
);

export default TransactionMessage;
