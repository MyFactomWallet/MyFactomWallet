const network = Cypress.env('network');

describe('Test the footer', function() {
	it('Has the testnet warning', function() {
		if (network === 'testnet') {
			cy.get('[data-cy="testnetWarning"]').contains(
				'You are connected to the Factom Testnet'
			);
		}
	});
});
