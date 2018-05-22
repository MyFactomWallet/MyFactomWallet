var dollarPriceMultiplier = 25;
var networkFee = 0.02;

function convertToDollar(factoidAmount) {
	return factoidAmount * dollarPriceMultiplier;
}

function getNetworkFee() {
	return networkFee;
}

export { convertToDollar, getNetworkFee };
