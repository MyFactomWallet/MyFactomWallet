Cypress.Commands.add('importSeedAddress', (address_o) => {
	cy.contains('Import addresses from mnemonic seed phrase').click();
	cy.get('[data-cy="next"]')
		.contains('Next')
		.click();
	cy.get('[name="mnemonic"]').type(address_o.seed);
	cy.contains('Next').click();
	cy.get(`[name="address_${address_o.index}"]`)
		.invoke('text')
		.then((text) => {
			expect(text).equal(address_o.fctAddress);
		});
	cy.get(`[name="checkbox_${address_o.index}"]`).click();
	cy.get(`[name="nickname_${address_o.index}"]`).type(address_o.fctName);
	cy.get('[type="submit"]')
		.contains('Add and Continue')
		.click();
	cy.get(`[name="address_${address_o.index}"]`)
		.invoke('text')
		.then((text) => {
			expect(text).equal(address_o.ecAddress);
		});
	cy.get(`[name="checkbox_${address_o.index}"]`).click();
	cy.get(`[name="nickname_${address_o.index}"]`).type(address_o.ecName);
	cy.get('[type="submit"]')
		.contains('Add and Continue')
		.click();
});
