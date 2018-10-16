import React from 'react';
import _flowRight from 'lodash/flowRight';
import _isEmpty from 'lodash/isEmpty';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { withWalletContext } from '../Context/WalletContext';
import WalletInfoHeader from './Shared/WalletInfoHeader';
import Fct from '@factoid.org/hw-app-fct';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import { withNetwork } from '../Context/NetworkContext';
import Button from '@material-ui/core/Button';

const checkAddress = async (activeFctWallet, bip32Account) => {
	const path =
		"44'/131'/" + bip32Account + "'/0'/" + activeFctWallet.index + "'";

	try {
		var transport = await TransportU2F.create();
		transport.setDebugMode(true);
		const ledger = new Fct(transport);

		const result = await ledger.getAddress(path, true);
		if (result) {
		}
	} catch (err) {
		console.error('Failed getFctAddr from Ledger :', err);
	} finally {
		transport.close();
	}
};

const WalletInfo = (props) => {
	const { classes } = props;

	const { getActiveFctAddress } = props.walletController;
	const activeFctWallet = getActiveFctAddress();

	return (
		<div>
			<WalletInfoHeader wallet={activeFctWallet} />
			<br />
			{activeFctWallet.type === 'ledger' && (
				<div className={classes.root}>
					<Button
						onClick={async () => {
							await checkAddress(
								activeFctWallet,
								props.networkController.networkProps.bip32Account
							);
						}}
						variant="outlined"
						color="primary"
					>
						Verify Ledger Address
					</Button>
				</div>
			)}
		</div>
	);
};

WalletInfo.propTypes = {
	classes: PropTypes.object.isRequired,
};
const styles = { root: { textAlign: 'left' } };

const enhancer = _flowRight(withNetwork, withWalletContext, withStyles(styles));

export default enhancer(WalletInfo);
