describe('Generate new addresses using mnemonic seed phrase', function() {
	it('Validates mnemonic seed phrase generates factoid address', function() {
		cy.contains('Generate new 12-word seed').click();
		cy.get('[data-cy="next"]')
			.contains('Next')
			.click();
		cy.contains(
			'Write down your seed carefully on a piece of paper. This seed provides access to all the derived addresses. If you lose this seed, you will lose access to your addresses forever!'
		);
		cy.get('[data-cy="mnemonic"]').then(($mnemonic) => {
			const seedPhrase = $mnemonic.text();
			cy.log(seedPhrase);
			cy.contains('Verify Seed').click();
			cy.get('[data-cy="formTextField"]').type(seedPhrase);
			cy.contains('Next').click();
		});
	});
});
