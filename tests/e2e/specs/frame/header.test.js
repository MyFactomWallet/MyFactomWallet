import { networkProps } from '../../../constants';

const openApiPayload = {
	jsonrpc: '2.0',
	id: 0,
	method: 'directory-block-head',
};
const network = Cypress.env('network');

describe('Test the header', function() {
	it('Has the correct Block Height', function() {
		cy.request({
			method: 'POST',
			url: networkProps[network].apiUrl,
			body: JSON.stringify(openApiPayload),
			headers: {
				'Content-Type': 'application/json',
			},
		}).then((response) => {
			let directoryBlockPayload = openApiPayload;
			directoryBlockPayload['params'] = { keymr: response.body.result.keymr };
			directoryBlockPayload['method'] = 'directory-block';
			cy.request({
				method: 'POST',
				url: networkProps[network].apiUrl,
				body: JSON.stringify(openApiPayload),
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

	it('Has the correct text', function() {
		cy.get('[data-cy=appBarHeader]').contains('Wallet');
		cy.get('[data-cy=appBarHeader]').contains('Help');
		cy.get('[data-cy=appBarHeader]').contains('MyFactomWallet');
		if (network === 'testnet') {
			cy.get('[data-cy="testnetHeader"]').contains('TESTNET');
		}
	});
});
