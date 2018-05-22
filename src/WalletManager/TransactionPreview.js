import React from 'react';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { convertToDollar, getNetworkFee } from '../Utils/Utils.js';

const TransactionPreview = (props) => {
	const { classes } = props;

	//Send Request Amount
	var transferFactoidAmount = parseInt(props.factoidAmount, 10);
	if (isNaN(transferFactoidAmount)) {
		transferFactoidAmount = 0;
	}
	const transferDollarAmount = convertToDollar(transferFactoidAmount);

	//Fees
	const factoidFee = getNetworkFee();
	const dollarFee = convertToDollar(factoidFee);

	//Total Send Amount
	const totalDollarAmount = transferDollarAmount + dollarFee;
	const totalFactoidAmount = transferFactoidAmount + factoidFee;

	//Format Output
	const transferDollarAmountText =
		'$' + transferDollarAmount.toLocaleString() + ' USD';
	const transferFactoidAmountText = transferFactoidAmount.toLocaleString();

	const totalDollarAmountText =
		'$' + totalDollarAmount.toLocaleString() + ' USD';
	const totalFactoidAmountText = totalFactoidAmount.toLocaleString() + ' FCT';

	const feeDollarAmountText = '$' + dollarFee.toLocaleString() + ' USD';
	const feeFactoidAmountText = factoidFee.toLocaleString() + ' FCT';

	return (
		<Paper className={classes.root} elevation={2}>
			<div>Transaction Preview</div>
			<br />
			<FactoidAmountLarge>{transferFactoidAmountText}</FactoidAmountLarge>
			<FactoidUnitLarge> FTC</FactoidUnitLarge>
			<DollarAmountLarge>{transferDollarAmountText}</DollarAmountLarge>
			<Divider />
			<Detail>
				<div>Total Amount:</div>
				<FactoidAmountSmall>{totalFactoidAmountText}</FactoidAmountSmall>
				<DollarAmountSmall>{totalDollarAmountText}</DollarAmountSmall>
			</Detail>
			<Detail>
				<div>Network Fee:</div>
				<FactoidAmountSmall>{feeFactoidAmountText}</FactoidAmountSmall>
				<DollarAmountSmall>{feeDollarAmountText}</DollarAmountSmall>
			</Detail>
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
		paddingTop: '23px',
		marginTop: '39px',
		height: '230px',
		borderRadius: '10px',
		backgroundColor: '#eef1f4',
		textAlign: 'center',
	},
};

const FactoidAmountLarge = styled.span`
	font-size: 50px;
	color: #007eff;
`;

const FactoidUnitLarge = styled.span`
	width: 55px;
	height: 24px;
	font-size: 20px;
	color: #007eff;
`;

const DollarAmountLarge = styled.div`
	opacity: 0.5;
	color: #007eff;
`;

const FactoidAmountSmall = styled.div`
	color: #001830;
	padding-top: 7px;
`;

const DollarAmountSmall = styled.div`
	opacity: 0.3;
	font-size: 12px;
	color: #001830;
`;

const Detail = styled.div`
	display: inline-block;
	padding-left: 65px;
	padding-right: 65px;
`;

const Divider = styled.hr`
	width: 50%;
	opacity: 0.15;
	border: solid 1px #103152;
`;

export default withStyles(styles)(TransactionPreview);
