import React from 'react';
import _flowRight from 'lodash/flowRight';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const ConvertTransactionPreview = (props) => {
	const {
		ecAmount,
		factoidAmount,
		classes,
		networkProps,
		sendFactoidFee,
	} = props;

	// total send amount
	const totalFactoidAmount = factoidAmount + sendFactoidFee;

	// format output
	const convertECAmountText = ecAmount.toLocaleString(undefined, {
		maximumFractionDigits: 8,
	});

	const totalFactoidCostText =
		totalFactoidAmount.toLocaleString(undefined, {
			maximumFractionDigits: 8,
		}) +
		' ' +
		networkProps.factoidAbbreviation;

	const feeFactoidAmountText =
		sendFactoidFee.toLocaleString(undefined, {
			maximumFractionDigits: 8,
		}) +
		' ' +
		networkProps.factoidAbbreviation;

	return (
		<Paper className={classes.root} elevation={2}>
			<div>Transaction Preview</div>
			<br />
			<span className={classes.convertECAmountText}>{convertECAmountText}</span>
			<span className={classes.ecUnitText}>
				{' ' + networkProps.ecAbbreviation}
			</span>
			<hr className={classes.divider} />
			<div className={classes.detail}>
				<div>Total Cost:</div>
				<div className={classes.factoidCostSmallText}>
					{totalFactoidCostText}
				</div>
			</div>
			<div className={classes.detail}>
				<div>Network Fee:</div>
				<div className={classes.factoidCostSmallText}>
					{feeFactoidAmountText}
				</div>
			</div>
		</Paper>
	);
};
ConvertTransactionPreview.propTypes = {
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
	convertECAmountText: {
		fontSize: '50px',
		color: '#007eff',
	},
	ecUnitText: {
		width: '55px',
		height: '24px',
		fontSize: '20px',
		color: '#007eff',
	},
	factoidCostSmallText: {
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

const enhancer = _flowRight(withStyles(styles));

export default enhancer(ConvertTransactionPreview);
