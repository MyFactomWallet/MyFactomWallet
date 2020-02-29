import {
	fctNickname,
	ecNickname,
	updateEcNickname,
	seedWarning,
} from '../../../constants';

import { getFctPrivateKey, getEcPrivateKey } from '../../../utils';

describe('New Mnemonic seed phrase', function() {
	it('Test factoid address generation, and editing address attributes', function() {
		cy.contains('Generate new 12-word seed').click();
		cy.get('[data-cy="next"]')
			.contains('Next')
			.click();
		cy.contains(seedWarning);
		cy.get('[data-cy="mnemonic"]').then(($mnemonic) => {
			const seedPhrase = $mnemonic.text();

			cy.contains('Verify Seed').click();
			cy.get('[data-cy="formTextField"]').type(seedPhrase);
			cy.contains('Next').click();
			cy.get('[name="checkbox_0"]').click();
			cy.get('[name="nickname_0"]').type(fctNickname);
			cy.get('[name="address_0"]').then(($fctAddress) => {
				const fctAddress = $fctAddress.text();
				cy.get('[name="balance_0"]').then(($fctBalance) => {
					const fctBalance = $fctBalance.text();
					cy.get('[type="submit"]')
						.contains('Add and Continue')
						.click();
					cy.get('[name="checkbox_0"]').click();
					cy.get('[name="nickname_0"]').type(ecNickname);
					cy.get('[name="address_0"]').then(($ecAddress) => {
						const ecAddress = $ecAddress.text();
						cy.get('[name="balance_0"]').then(($ecBalance) => {
							const ecBalance = $ecBalance.text();
							cy.get('[type="submit"]')
								.contains('Add and Continue')
								.click();
							cy.contains('Manage Wallet').click();

							// Test factoid address info
							cy.get('[data-cy="addressNickname"]').should(
								'have.text',
								fctNickname
							);
							cy.get('[data-cy="address"]').should('have.text', fctAddress);
							cy.get('[data-cy="balance"]')
								.invoke('text')
								.then((text) => {
									expect(text.replace(/\u00a0/g, ' ')).equal('0  FCT');
								});

							// Test fct private key
							cy.contains('View Private Key').click();
							cy.get('[data-cy="formTextField"]').type(seedPhrase);
							cy.contains('Submit').click();
							cy.get('[data-cy="privateKey"]')
								.invoke('text')
								.then((text) => {
									expect(text.replace(/\u00a0/g, ' ')).equal(
										'Private Key: ...'
									);
								});
							cy.get('[title="Display Private Key"]').click();
							const fctPrivateKey = getFctPrivateKey(seedPhrase, fctAddress, 0);
							cy.get('[data-cy="privateKey"]')
								.invoke('text')
								.then((text) => {
									expect(text.replace(/\u00a0/g, ' ')).equal(
										`Private Key: ${fctPrivateKey}`
									);
								});

							// Test ec address info
							cy.get('[data-cy="ecAddressList"]')
								.contains(ecNickname)
								.click();

							cy.get('[data-cy="addressNickname"]').should(
								'have.text',
								ecNickname
							);
							cy.get('[data-cy="address"]').should('have.text', ecAddress);
							cy.get('[data-cy="balance"]')
								.invoke('text')
								.then((text) => {
									expect(text.replace(/\u00a0/g, ' ')).equal('0  EC');
								});

							// Test Edit Address

							// Test EC Private Key
							cy.contains('View Private Key').click();
							cy.get('[data-cy="formTextField"]').type(seedPhrase);
							cy.contains('Submit').click();
							cy.get('[data-cy="privateKey"]')
								.invoke('text')
								.then((text) => {
									expect(text.replace(/\u00a0/g, ' ')).equal(
										'Private Key: ...'
									);
								});
							cy.get('[title="Display Private Key"]').click();
							const ecPrivateKey = getEcPrivateKey(seedPhrase, ecAddress, 0);
							cy.get('[data-cy="privateKey"]')
								.invoke('text')
								.then((text) => {
									expect(text.replace(/\u00a0/g, ' ')).equal(
										`Private Key: ${ecPrivateKey}`
									);
								});
						});
					});
				});
			});
		});
	});
	it('test update address name', function() {});
});
