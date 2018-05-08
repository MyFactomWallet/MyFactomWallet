import React from "react";
import styled from "styled-components";

const TransactionPreview = (props) => {
	const transferDollarAmount = props.dollarAmount;
	const factoidFee = props.networkFee;

	const transferFactoidAmount = transferDollarAmount / 25;
	const dollarFee = factoidFee * 25;
	const totalDollarAmount = transferDollarAmount + dollarFee;
	const totalFactoidAmount = transferFactoidAmount + factoidFee;

	const transferDollarAmountText = "$" + transferDollarAmount.toLocaleString() + " USD";
	const transferFactoidAmountText = transferFactoidAmount.toLocaleString();
	const totalDollarAmountText = "$" + totalDollarAmount.toLocaleString() + " USD";
	const totalFactoidAmountText = totalFactoidAmount.toLocaleString() + " FCT";
	const feeDollarAmountText = "$" + dollarFee.toLocaleString() + " USD";
	const feeFactoidAmountText = factoidFee.toLocaleString() + " FCT";

	return (
		<StyledTransactionPreview>
			<Label>Transaction Preview</Label>
			<FactoidAmountLarge>{transferFactoidAmountText}</FactoidAmountLarge>
			<FactoidUnitLarge> FTC</FactoidUnitLarge>
			<DollarAmountLarge>{transferDollarAmountText}</DollarAmountLarge>
			<Divider />
			<Detail>
				<Label>Amount:</Label>
				<FactoidAmountSmall>{totalFactoidAmountText}</FactoidAmountSmall>
				<DollarAmountSmall>{totalDollarAmountText}</DollarAmountSmall>
			</Detail>
			<Detail>
				<Label>Network Fee:</Label>
				<FactoidAmountSmall>{feeFactoidAmountText}</FactoidAmountSmall>
				<DollarAmountSmall>{feeDollarAmountText}</DollarAmountSmall>
			</Detail>
		</StyledTransactionPreview>
	);
};

const StyledTransactionPreview = styled.div`
	padding-top: 23px;
	margin-top: 39px;
	height: 258px;
	border-radius: 10px;
	background-color: #eef1f4;
	letter-spacing: normal;
`;

const FactoidAmountLarge = styled.span`
	font-size: 50px;
	color: #007eff;
`;

const FactoidUnitLarge = styled.span`
	width: 55px;
	height: 24px;
	font-family: Montserrat;
	font-size: 20px;
	font-weight: normal;
	font-style: normal;
	font-stretch: normal;
	line-height: normal;
	letter-spacing: normal;
	text-align: right;
	color: #007eff;
`;

const DollarAmountLarge = styled.div`
	opacity: 0.5;
	font-size: 12px;
	line-height: 2.5;
	color: #007eff;
	font-family: roboto;
`;

const FactoidAmountSmall = styled.div`
	font-size: 20px;
	color: #001830;
	padding-top: 7px;
`;

const DollarAmountSmall = styled.div`
	opacity: 0.3;
	font-size: 12px;
	line-height: 1.5;
	color: #001830;
	font-family: roboto;
`;

const Detail = styled.div`
	display: inline-block;
	padding-left: 65px;
	padding-right: 65px;
`;

const Label = styled.div`
	font-weight: bold;
`;

const Divider = styled.hr`
	width: 50%;
	opacity: 0.15;
	border: solid 1px #103152;
`;

export default TransactionPreview;
