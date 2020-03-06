import {
	getFctPrivateKey,
	getEcPrivateKey,
	toFactoids,
	getFactoshiFee,
	getMaxFactoshis,
} from '../../../utils';
import { openNodeUrl } from '../../../constants';

const YAML = require('yamljs');

const openApiPayload = {
	jsonrpc: '2.0',
	id: 0,
	method: '',
};

describe('Import Address from Mnemonic seed phrase', function() {
	it('Test send and receive, and editing address attributes', function() {
		cy.readFile('./tests/e2e/specs/config.yaml').then((data) => {
			const config = YAML.parse(data);
			const addressOne = config.addresses.mainnet[0];
			const addressTwo = config.addresses.mainnet[1];

			// Import first seed
			cy.contains('Import addresses from mnemonic seed phrase').click();
			cy.get('[data-cy="next"]')
				.contains('Next')
				.click();
			cy.get('[name="mnemonic"]').type(addressOne.seed);
			cy.contains('Next').click();
			cy.get('[name="address_0"]')
				.invoke('text')
				.then((text) => {
					expect(text).equal(addressOne.fctAddress);
				});
			cy.get('[name="checkbox_0"]').click();
			cy.get('[name="nickname_0"]').type(addressOne.fctName);
			cy.get('[type="submit"]')
				.contains('Add and Continue')
				.click();
			cy.get('[name="address_0"]')
				.invoke('text')
				.then((text) => {
					expect(text).equal(addressOne.ecAddress);
				});
			cy.get('[name="checkbox_0"]').click();
			cy.get('[name="nickname_0"]').type(addressOne.ecName);
			cy.get('[type="submit"]')
				.contains('Add and Continue')
				.click();
			cy.contains('Add Another').click();

			// Import second seed
			cy.contains('Import addresses from mnemonic seed phrase').click();
			cy.get('[data-cy="next"]')
				.contains('Next')
				.click();
			cy.get('[name="mnemonic"]').type(addressTwo.seed);
			cy.contains('Next').click();
			cy.get('[name="address_0"]')
				.invoke('text')
				.then((text) => {
					expect(text).equal(addressTwo.fctAddress);
				});
			cy.get('[name="checkbox_0"]').click();
			cy.get('[name="nickname_0"]').type(addressTwo.fctName);
			cy.get('[type="submit"]')
				.contains('Add and Continue')
				.click();
			cy.get('[name="address_0"]')
				.invoke('text')
				.then((text) => {
					expect(text).equal(addressTwo.ecAddress);
				});
			cy.get('[name="checkbox_0"]').click();
			cy.get('[name="nickname_0"]').type(addressTwo.ecName);
			cy.get('[type="submit"]')
				.contains('Add and Continue')
				.click();
			cy.contains('Manage Wallet').click();

			// A D D R E S S  I N F O  T A B
			// Test Address Nickname
			cy.get('[data-cy="addressNickname"]').should(
				'have.text',
				addressOne.fctName
			);
			cy.get('[data-cy="address"]').should('have.text', addressOne.fctAddress);
			let factoidBalancePayload = openApiPayload;
			factoidBalancePayload['method'] = 'factoid-balance';
			factoidBalancePayload['params'] = { address: addressOne.fctAddress };
			cy.request({
				method: 'POST',
				url: openNodeUrl,
				body: JSON.stringify(factoidBalancePayload),
				headers: {
					'Content-Type': 'application/json',
				},
			}).then((response) => {
				const addressOneBalance = response.body.result.balance;
				cy.get('[data-cy="balance"]')
					.invoke('text')
					.then((text) => {
						// Test Balance
						expect(text.replace(/\u00a0/g, ' ')).equal(
							`${toFactoids(addressOneBalance)}  FCT`
						);
					});

				// S E N D  F A C T O I D  T A B
				cy.contains('Send Factoid').click();
				cy.contains('Send to one of my addresses').click();
				cy.get('[id="simple-menu"]')
					.contains(addressTwo.fctName)
					.click();
				cy.get('[name="recipientAddress"]').should(
					'have.value',
					addressTwo.fctAddress
				);
				cy.contains('Use Max').click();
				let entryRatePayload = openApiPayload;
				entryRatePayload['method'] = 'entry-credit-rate';
				cy.request({
					method: 'POST',
					url: openNodeUrl,
					body: JSON.stringify(entryRatePayload),
					headers: {
						'Content-Type': 'application/json',
					},
				}).then((response) => {
					const ecRate = response.body.result.rate;
					const maxFactoshis = getMaxFactoshis(
						addressOneBalance,
						getFactoshiFee(ecRate)
					);

					cy.log(`MaxFactoshis: ${maxFactoshis}`);
					const maxFactoids = toFactoids(maxFactoshis);
					cy.log(`Factoids: ${maxFactoids}`);
					cy.get('[name="sendFactoidAmount"]').should(
						'have.value',
						maxFactoids
					);
					cy.get('[data-cy="previewAmount"]').should('have.text', maxFactoids);
					cy.get('[data-cy="networkFee"]').should(
						'have.text',
						`${toFactoids(getFactoshiFee(ecRate))} FCT`
					);
					cy.get('[data-cy="previewTotalAmount"]').should(
						'have.text',
						`${toFactoids(addressOneBalance)} FCT`
					);
					cy.get('[name="seed"]').type(addressOne.seed);

					// Send max factoids (first address -> second address)
					cy.contains('Send Factoids').click();
					cy.wait(200);
					cy.contains('Transaction ID');
					cy.get('[data-cy="balance"]')
						.invoke('text')
						.then((text) => {
							// Test Balance
							expect(text.replace(/\u00a0/g, ' ')).equal('0  FCT');
						});
					cy.get('[data-cy="fctAddressList"]')
						.contains(addressTwo.fctName)
						.click();

					// A D D R E S S  I N F O  T A B
					cy.get('[data-cy="addressNickname"]').should(
						'have.text',
						addressTwo.fctName
					);
					cy.get('[data-cy="address"]').should(
						'have.text',
						addressTwo.fctAddress
					);
					cy.get('[data-cy="balance"]')
						.invoke('text')
						.then((text) => {
							// Test Balance
							expect(text.replace(/\u00a0/g, ' ')).equal(`${maxFactoids}  FCT`);
						});

					// S E N D  F A C T O I D  T A B
					cy.contains('Send Factoid').click();
					cy.contains('Send to one of my addresses').click();
					cy.get('[id="simple-menu"]')
						.contains(addressOne.fctName)
						.click();
					cy.get('[name="recipientAddress"]').should(
						'have.value',
						addressOne.fctAddress
					);
					cy.contains('Use Max').click();
					const newMaxFactoids = toFactoids(
						getMaxFactoshis(maxFactoids, getFactoshiFee(ecRate))
					);
					cy.get('[name="sendFactoidAmount"]').should(
						'have.value',
						newMaxFactoids
					);
					cy.get('[data-cy="previewAmount"]').should(
						'have.text',
						newMaxFactoids
					);
					cy.get('[data-cy="networkFee"]').should(
						'have.text',
						`${toFactoids(getFactoshiFee(ecRate))} FCT`
					);
					cy.get('[data-cy="previewTotalAmount"]').should(
						'have.text',
						`${newMaxFactoids} FCT`
					);
					cy.get('[name="seed"]').type(addressTwo.seed);

					// Send max factoids back (second address -> first address)
					cy.contains('Send Factoids').click();
					cy.wait(200);
					cy.contains('Transaction ID');
					cy.get('[data-cy="balance"]')
						.invoke('text')
						.then((text) => {
							// Test Balance
							expect(text.replace(/\u00a0/g, ' ')).equal('0  FCT');
						});
					cy.get('[data-cy="fctAddressList"]')
						.contains(addressOne.fctName)
						.click();

					// A D D R E S S  I N F O  T A B
					cy.get('[data-cy="addressNickname"]').should(
						'have.text',
						addressOne.fctName
					);
					cy.get('[data-cy="address"]').should(
						'have.text',
						addressOne.fctAddress
					);
					cy.get('[data-cy="balance"]')
						.invoke('text')
						.then((text) => {
							// Test Balance
							expect(text.replace(/\u00a0/g, ' ')).equal(
								`${newMaxFactoids}  FCT`
							);
						});
				});
			});
		});
	});
});
