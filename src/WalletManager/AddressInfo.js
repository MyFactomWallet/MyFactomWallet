import React from 'react';
import _flowRight from 'lodash/flowRight';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { withWalletContext } from '../Context/WalletContext';
import { withLedger } from '../Context/LedgerContext';
import AddressInfoHeader from './Shared/AddressInfoHeader';
import Button from '@material-ui/core/Button';

const AddressInfo = (props) => {
	const {
		classes,
		ledgerController: { checkAddress },
		walletController: { getActiveAddress },
	} = props;
	const activeAddress_o = getActiveAddress();

	return (
		<div>
			<AddressInfoHeader />
			<br />
			{activeAddress_o.importType === 'ledger' && (
				<div className={classes.root}>
					<Button
						onClick={async () => {
							await checkAddress(activeAddress_o);
						}}
						variant="outlined"
						color="primary"
					>
						Verify Ledger Nano S Address
					</Button>
				</div>
			)}
		</div>
	);
};

AddressInfo.propTypes = {
	classes: PropTypes.object.isRequired,
};
const styles = { root: { textAlign: 'left' } };

const enhancer = _flowRight(withLedger, withWalletContext, withStyles(styles));

export default enhancer(AddressInfo);
