import React, { useEffect } from 'react';
import { Container } from '@material-ui/core/';
import _isNil from 'lodash/isNil';
import Sidebar from './Sidebar.js';
import WalletTabContent from './WalletTabContent.js';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withWalletContext } from '../context/WalletContext';

function WalletManager(props) {
	useEffect(() => {
		props.walletController.updateBalances();
	}, []);

	const {
		walletController: { getActiveAddress, activeAddressIndex_o },
	} = props;

	const activeAddress = getActiveAddress();

	if (!_isNil(activeAddress)) {
		return (
			<Container>
				<Grid container spacing={3}>
					<Grid item md={4} xs={12}>
						<Sidebar />
					</Grid>

					<Grid item md={8} xs={12}>
						<Paper elevation={2}>
							<WalletTabContent
								type={activeAddressIndex_o.type}
								activeAddress={activeAddress}
							/>
						</Paper>
					</Grid>
				</Grid>
			</Container>
		);
	} else {
		return <></>;
	}
}

export default withWalletContext(WalletManager);
