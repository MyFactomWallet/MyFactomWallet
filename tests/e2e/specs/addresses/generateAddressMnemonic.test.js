import {
	fctNickname,
	ecNickname,
	networkProps,
	seedWarning,
} from '../../../constants';

import { getFctPrivateKey, getEcPrivateKey } from '../../../utils';

const network = Cypress.env('network');

describe('Test Generate new 12-word seed', function() {
	it('Can generate new factoid addresses using a mnemonic seed phrase', function() {
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

			// Add FCT address
			cy.get('[name="checkbox_0"]').click();
			cy.get('[name="nickname_0"]').type(fctNickname);
			cy.get('[name="address_0"]').then(($fctAddress) => {
				const fctAddress = $fctAddress.text();
				cy.get('[name="balance_0"]')
					.invoke('text')
					.then((text) => {
						expect(text.replace(/\u00a0/g, ' ')).equal(
							`0  ${networkProps[network].factoidAbbreviation}`
						);
					});
				cy.get('[type="submit"]')
					.contains('Add and Continue')
					.click();

				// Add EC address
				cy.get('[name="checkbox_0"]').click();
				cy.get('[name="nickname_0"]').type(ecNickname);
				cy.get('[name="address_0"]').then(($ecAddress) => {
					const ecAddress = $ecAddress.text();
					cy.get('[name="balance_0"]')
						.invoke('text')
						.then((text) => {
							expect(text.replace(/\u00a0/g, ' ')).equal(
								`0  ${networkProps[network].ecAbbreviation}`
							);
						});

					cy.get('[type="submit"]')
						.contains('Add and Continue')
						.click();
					if (network === 'mainnet') {
						cy.contains('Manage Wallet').click();
					} else {
						cy.contains('Manage Testnet Wallet').click();
					}

					// Sidebar
					cy.get('[data-cy="sidebarFctIndex_0"]')
						.get('[data-cy="sidebarFctNickname"]')
						.should('have.text', fctNickname);
					cy.get('[data-cy="sidebarFctIndex_0"]')
						.get('[data-cy="sidebarFctBalance"]')
						.invoke('text')
						.then((text) => {
							expect(text.replace(/\u00a0/g, ' ')).equal(
								`0  ${networkProps[network].factoidAbbreviation}`
							);
						});
					cy.get('[data-cy="sidebarEcIndex_0"]')
						.get('[data-cy="sidebarEcNickname"]')
						.should('have.text', ecNickname);
					cy.get('[data-cy="sidebarEcIndex_0"]')
						.get('[data-cy="sidebarEcBalance"]')
						.invoke('text')
						.then((text) => {
							expect(text.replace(/\u00a0/g, ' ')).equal(
								`0  ${networkProps[network].ecAbbreviation}`
							);
						});

					// Overview Tab
					cy.get('[data-cy="addressNickname"]').should(
						'have.text',
						fctNickname
					);
					cy.get('[data-cy="address"]').should('have.text', fctAddress);
					cy.get('[data-cy="balance"]')
						.invoke('text')
						.then((text) => {
							expect(text.replace(/\u00a0/g, ' ')).equal(
								`0  ${networkProps[network].factoidAbbreviation}`
							);
						});

					// View Private Key Tab
					cy.contains('View Private Key').click();
					cy.get('[data-cy="formTextField"]').type(seedPhrase);
					cy.contains('Submit').click();
					cy.get('[data-cy="privateKey"]')
						.invoke('text')
						.then((text) => {
							expect(text.replace(/\u00a0/g, ' ')).equal('Private Key: ...');
						});
					cy.get('[title="Display Private Key"]').click();
					const fctPrivateKey = getFctPrivateKey(
						seedPhrase,
						fctAddress,
						0,
						networkProps[network].bip32Account
					);
					cy.get('[data-cy="privateKey"]')
						.invoke('text')
						.then((text) => {
							expect(text.replace(/\u00a0/g, ' ')).equal(
								`Private Key: ${fctPrivateKey}`
							);
						});

					// Select EC Address
					cy.get('[data-cy="ecAddressList"]')
						.contains(ecNickname)
						.click();

					// Overview Tab
					cy.get('[data-cy="addressNickname"]').should('have.text', ecNickname);
					cy.get('[data-cy="address"]').should('have.text', ecAddress);
					cy.get('[data-cy="balance"]')
						.invoke('text')
						.then((text) => {
							expect(text.replace(/\u00a0/g, ' ')).equal(
								`0  ${networkProps[network].ecAbbreviation}`
							);
						});

					// View Private Key Tab
					cy.contains('View Private Key').click();
					cy.get('[data-cy="formTextField"]').type(seedPhrase);
					cy.contains('Submit').click();
					cy.get('[data-cy="privateKey"]')
						.invoke('text')
						.then((text) => {
							expect(text.replace(/\u00a0/g, ' ')).equal('Private Key: ...');
						});
					cy.get('[title="Display Private Key"]').click();
					const ecPrivateKey = getEcPrivateKey(
						seedPhrase,
						ecAddress,
						0,
						networkProps[network].bip32Account
					);
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
