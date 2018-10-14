import React from 'react';
import _flowRight from 'lodash/flowRight';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { withWalletContext } from '../Context/WalletContext';

const TransactionPreview = (props) => {
	const { factoidAmount, classes } = props;
	const { sendFactoidFee } = props.walletController;

	// total send amount
	const totalFactoidAmount = factoidAmount + sendFactoidFee;

	// format output
	const transferFactoidAmountText = factoidAmount.toLocaleString(undefined, {
		maximumFractionDigits: 8,
	});

	const totalFactoidAmountText =
		totalFactoidAmount.toLocaleString(undefined, {
			maximumFractionDigits: 8,
		}) + ' FCT';

	const feeFactoidAmountText =
		sendFactoidFee.toLocaleString(undefined, {
			maximumFractionDigits: 8,
		}) + ' FCT';

	return (
		<Paper className={classes.root} elevation={2}>
			<div>Transaction Preview</div>
			<br />
			<span className={classes.transferFactoidAmountText}>
				{transferFactoidAmountText}
			</span>
			<span className={classes.transferFactoidUnitText}> FTC</span>
			<hr className={classes.divider} />
			<div className={classes.detail}>
				<div>Total Amount:</div>
				<div className={classes.factoidAmountSmallText}>
					{totalFactoidAmountText}
				</div>
			</div>
			<div className={classes.detail}>
				<div>Network Fee:</div>
				<div className={classes.factoidAmountSmallText}>
					{feeFactoidAmountText}
				</div>
			</div>
		</Paper>
	);
};
TransactionPreview.propTypes = {
	classes: PropTypes.object.isRequired,
};
const styles = {
	root: {
		width: '75%',
		margin: '0 auto',
		paddingTop: '26px',
		marginTop: '39px',
		height: '194px',
		borderRadius: '10px',
		backgroundColor: '#eef1f4',
		textAlign: 'center',
	},
	transferFactoidAmountText: {
		fontSize: '50px',
		color: '#007eff',
	},
	transferFactoidUnitText: {
		width: '55px',
		height: '24px',
		fontSize: '20px',
		color: '#007eff',
	},
	factoidAmountSmallText: {
		color: '#001830',
		paddingTop: '7px',
	},
	detail: {
		display: 'inline-block',
		paddingLeft: '65px',
		paddingRight: '65px',
	},
	divider: {
		width: '50%',
		opacity: 0.15,
		border: 'solid 1px #103152',
	},
};

const enhancer = _flowRight(withWalletContext, withStyles(styles));

export default enhancer(TransactionPreview);
