import { networkProps } from '../../../constants';
import { newOpenApiPayload } from '../../../utils';

const directoryBlockHeadPayload = newOpenApiPayload('directory-block-head');
const network = Cypress.env('network');

describe('Test the header', function() {
	it('Should have the correct Block Height', function() {
		cy.request({
			method: 'POST',
			url: networkProps[network].apiUrl,
			body: JSON.stringify(directoryBlockHeadPayload),
			headers: {
				'Content-Type': 'application/json',
			},
		}).then((response) => {
			const directoryBlockPayload = newOpenApiPayload('directory-block', {
				keymr: response.body.result.keymr,
			});
			cy.request({
				method: 'POST',
				url: networkProps[network].apiUrl,
				body: JSON.stringify(directoryBlockPayload),
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

	it('Should have the correct app bar headers', function() {
		cy.get('[data-cy=appBarHeader]').contains('Wallet');
		cy.get('[data-cy=appBarHeader]').contains('Help');
		cy.get('[data-cy=appBarHeader]').contains('MyFactomWallet');
		if (network === 'testnet') {
			cy.get('[data-cy="testnetHeader"]').contains('TESTNET');
		}
	});
});
