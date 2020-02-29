import { getFctPrivateKey, getEcPrivateKey, toFactoids } from '../../../utils';
import { openNodeUrl } from '../../../constants';

const YAML = require('yamljs');

let factoidBalancePayload = {
	jsonrpc: '2.0',
	id: 0,
	method: 'factoid-balance',
};

describe('Import Address from Mnemonic seed phrase', function() {
	it('Test send and receive, and editing address attributes', function() {
		cy.readFile('./tests/e2e/specs/config.yaml').then((data) => {
			const config = YAML.parse(data);
			const address1 = config.addresses[0];
			const address2 = config.addresses[1];

			// Import first seed
			cy.contains('Import addresses from mnemonic seed phrase').click();
			cy.get('[data-cy="next"]')
				.contains('Next')
				.click();
			cy.get('[name="mnemonic"]').type(address1.seed);
			cy.contains('Next').click();
			cy.get('[name="address_0"]')
				.invoke('text')
				.then((text) => {
					expect(text).equal(address1.fctAddress);
				});
			cy.get('[name="checkbox_0"]').click();
			cy.get('[name="nickname_0"]').type(address1.fctName);
			cy.get('[type="submit"]')
				.contains('Add and Continue')
				.click();
			cy.get('[name="address_0"]')
				.invoke('text')
				.then((text) => {
					expect(text).equal(address1.ecAddress);
				});
			cy.get('[name="checkbox_0"]').click();
			cy.get('[name="nickname_0"]').type(address1.ecName);
			cy.get('[type="submit"]')
				.contains('Add and Continue')
				.click();
			cy.contains('Add Another').click();

			// Import second seed
			cy.contains('Import addresses from mnemonic seed phrase').click();
			cy.get('[data-cy="next"]')
				.contains('Next')
				.click();
			cy.get('[name="mnemonic"]').type(address2.seed);
			cy.contains('Next').click();
			cy.get('[name="address_0"]')
				.invoke('text')
				.then((text) => {
					expect(text).equal(address2.fctAddress);
				});
			cy.get('[name="checkbox_0"]').click();
			cy.get('[name="nickname_0"]').type(address2.fctName);
			cy.get('[type="submit"]')
				.contains('Add and Continue')
				.click();
			cy.get('[name="address_0"]')
				.invoke('text')
				.then((text) => {
					expect(text).equal(address2.ecAddress);
				});
			cy.get('[name="checkbox_0"]').click();
			cy.get('[name="nickname_0"]').type(address2.ecName);
			cy.get('[type="submit"]')
				.contains('Add and Continue')
				.click();
			cy.contains('Manage Wallet').click();

			// A D D R E S S  I N F O  T A B
			// Test Address Nickname
			cy.get('[data-cy="addressNickname"]').should(
				'have.text',
				address1.fctName
			);
			cy.get('[data-cy="address"]').should('have.text', address1.fctAddress);
			factoidBalancePayload['params'] = { address: address1.fctAddress };
			cy.request({
				method: 'POST',
				url: openNodeUrl,
				body: JSON.stringify(factoidBalancePayload),
				headers: {
					'Content-Type': 'application/json',
				},
			}).then((response) => {
				// cy.log(response.body.result.balance);
				cy.get('[data-cy="balance"]')
					.invoke('text')
					.then((text) => {
						// Test Balance
						expect(text.replace(/\u00a0/g, ' ')).equal(
							`${toFactoids(response.body.result.balance)}  FCT`
						);
					});

				// S E N D  F A C T O I D  T A B
				cy.contains('Send Factoid').click();
				cy.contains('Send to one of my addresses').click();
				cy.get('[id="simple-menu"]')
					.contains(address2.fctName)
					.click();
				cy.get('[name="recipientAddress"]').should(
					'have.value',
					address2.fctAddress
				);
			});
		});
	});
});
