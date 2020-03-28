// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

beforeEach(function() {
	const network = Cypress.env('network');
	cy.visit('http://dev.myfactomwallet.com:3000/');
	cy.get('[data-cy="disclaimer-accept"]').click();
	if (network === 'testnet') {
		cy.get('[data-cy="blockHeight"]').click();
		cy.contains('Connect to Testnet').click();
		cy.get('[data-cy="disclaimer-accept"]').click();
	}
});
