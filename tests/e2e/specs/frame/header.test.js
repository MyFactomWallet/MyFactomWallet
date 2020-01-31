const openNodeUrl = 'https://api.factomd.net/v2';
let data = {
	jsonrpc: '2.0',
	id: 0,
	method: 'directory-block-head',
};

describe('Header tests', function() {
	it('Validate Mainnet Block Height', function() {
		cy.request({
			method: 'POST',
			url: openNodeUrl,
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			},
		}).then((response) => {
			cy.log(response.body.result.keymr);
			data['params'] = { keymr: response.body.result.keymr };
			data['method'] = 'directory-block';
			cy.request({
				method: 'POST',
				url: openNodeUrl,
				body: JSON.stringify(data),
				headers: {
					'Content-Type': 'application/json',
				},
			}).then((response) => {
				cy.get('[data-cy="blockHeight"]').should(
					'have.text',
					response.body.result.header.sequencenumber.toString()
				);
				cy.contains(response.body.result.header.sequencenumber.toString());
			});
		});
	});

	it('Validate Header Text', function() {
		cy.get('[data-cy=appBarHeader]').contains('Wallet');
		cy.get('[data-cy=appBarHeader]').contains('Help');
		cy.get('[data-cy=appBarHeader]').contains('MyFactomWallet');
	});
});
