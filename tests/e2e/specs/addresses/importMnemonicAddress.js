import { toFactoids, getFactoshiFee, getMaxFactoshis } from '../../../utils';
import { networkProps } from '../../../constants';

const YAML = require('yamljs');

const openApiPayload = {
	jsonrpc: '2.0',
	id: 0,
	method: '',
};
const network = Cypress.env('network');

describe('Import Addresses from Mnemonic seed', function() {
	it('Can import addresses and make transactions', function() {
		cy.readFile('./tests/e2e/config.yaml').then((data) => {
			const config = YAML.parse(data);
			const addressOne = config.addresses.mainnet[0];
			const addressTwo = config.addresses.mainnet[1];

			// Import first seed address
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

			// O V E R V I E W  T A B
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
				url: networkProps[network].apiUrl,
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
							`${toFactoids(addressOneBalance)}  ${
								networkProps[network].factoidAbbreviation
							}`
						);
					});

				// Sidebar
				//fct addresses
				cy.get('[data-cy="sidebarFctIndex_0"]').within(() => {
					cy.get('[data-cy="sidebarFctNickname"]').should(
						'have.text',
						addressOne.fctName
					);
					cy.get('[data-cy="sidebarFctBalance"]')
						.invoke('text')
						.then((text) => {
							expect(text.replace(/\u00a0/g, ' ')).equal(
								`${toFactoids(addressOneBalance)}  ${
									networkProps[network].factoidAbbreviation
								}`
							);
						});
				});
				cy.get('[data-cy="sidebarFctIndex_1"]').within(() => {
					cy.get('[data-cy="sidebarFctNickname"]').should(
						'have.text',
						addressTwo.fctName
					);
					cy.get('[data-cy="sidebarFctBalance"]')
						.invoke('text')
						.then((text) => {
							expect(text.replace(/\u00a0/g, ' ')).equal(
								`0  ${networkProps[network].factoidAbbreviation}`
							);
						});
				});

				//ec addresses
				cy.get('[data-cy="sidebarEcIndex_0"]').within(() => {
					cy.get('[data-cy="sidebarEcNickname"]').should(
						'have.text',
						addressOne.ecName
					);
					cy.get('[data-cy="sidebarEcBalance"]')
						.invoke('text')
						.then((text) => {
							expect(text.replace(/\u00a0/g, ' ')).equal(
								`0  ${networkProps[network].ecAbbreviation}`
							);
						});
				});
				cy.get('[data-cy="sidebarEcIndex_1"]').within(() => {
					cy.get('[data-cy="sidebarEcNickname"]').should(
						'have.text',
						addressTwo.ecName
					);
					cy.get('[data-cy="sidebarEcBalance"]')
						.invoke('text')
						.then((text) => {
							expect(text.replace(/\u00a0/g, ' ')).equal(
								`0  ${networkProps[network].ecAbbreviation}`
							);
						});
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
					url: networkProps[network].apiUrl,
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
					const maxFactoids = toFactoids(maxFactoshis);
					cy.get('[name="seed"]').type(addressOne.seed);
					cy.get('[name="sendFactoidAmount"]').should(
						'have.value',
						maxFactoids.toString()
					);
					cy.get('[data-cy="previewAmount"]').should(
						'have.text',
						maxFactoids.toString()
					);
					cy.get('[data-cy="networkFee"]').should(
						'have.text',
						`${toFactoids(getFactoshiFee(ecRate))} ${
							networkProps[network].factoidAbbreviation
						}`
					);
					cy.get('[data-cy="previewTotalAmount"]').should(
						'have.text',
						`${toFactoids(addressOneBalance)} ${
							networkProps[network].factoidAbbreviation
						}`
					);
					// Send max factoids (first address -> second address)
					cy.contains('Send Factoids').click();
					cy.wait(5000);
					cy.contains('Transaction ID');
					cy.get('[data-cy="balance"]')
						.invoke('text')
						.then((text) => {
							// Test Balance
							expect(text.replace(/\u00a0/g, ' ')).equal(
								`0  ${networkProps[network].factoidAbbreviation}`
							);
						});

					// switch to second address
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
					factoidBalancePayload['method'] = 'factoid-balance';
					factoidBalancePayload['params'] = { address: addressTwo.fctAddress };
					cy.request({
						method: 'POST',
						url: networkProps[network].apiUrl,
						body: JSON.stringify(factoidBalancePayload),
						headers: {
							'Content-Type': 'application/json',
						},
					}).then((response) => {
						const addressTwoBalance = response.body.result.balance;
						cy.log(`addressTwoBalance ${addressTwoBalance}`);
						cy.get('[data-cy="balance"]')
							.invoke('text')
							.then((text) => {
								// Test Balance
								expect(text.replace(/\u00a0/g, ' ')).equal(
									`${toFactoids(addressTwoBalance)}  ${
										networkProps[network].factoidAbbreviation
									}`
								);
							});

						// Sidebar
						cy.get('[data-cy="sidebarFctIndex_0"]').within(() => {
							cy.get('[data-cy="sidebarFctNickname"]').should(
								'have.text',
								addressOne.fctName
							);
							cy.get('[data-cy="sidebarFctBalance"]')
								.invoke('text')
								.then((text) => {
									expect(text.replace(/\u00a0/g, ' ')).equal(
										`0  ${networkProps[network].factoidAbbreviation}`
									);
								});
						});
						cy.get('[data-cy="sidebarFctIndex_1"]').within(() => {
							cy.get('[data-cy="sidebarFctNickname"]').should(
								'have.text',
								addressTwo.fctName
							);
							cy.get('[data-cy="sidebarFctBalance"]')
								.invoke('text')
								.then((text) => {
									expect(text.replace(/\u00a0/g, ' ')).equal(
										`${toFactoids(addressTwoBalance)}  ${
											networkProps[network].factoidAbbreviation
										}`
									);
								});
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
						let entryRatePayload = openApiPayload;
						entryRatePayload['method'] = 'entry-credit-rate';
						cy.request({
							method: 'POST',
							url: networkProps[network].apiUrl,
							body: JSON.stringify(entryRatePayload),
							headers: {
								'Content-Type': 'application/json',
							},
						}).then((response) => {
							const newEcRate = response.body.result.rate;
							cy.log(`newEcRate: ${newEcRate}`);
							const newMaxFactoshis = getMaxFactoshis(
								addressTwoBalance,
								getFactoshiFee(newEcRate)
							);
							const newMaxFactoids = toFactoids(newMaxFactoshis);
							cy.get('[name="seed"]').type(addressTwo.seed);
							cy.get('[name="sendFactoidAmount"]').should(
								'have.value',
								newMaxFactoids.toString()
							);
							cy.get('[data-cy="previewAmount"]').should(
								'have.text',
								newMaxFactoids.toString()
							);
							cy.get('[data-cy="networkFee"]').should(
								'have.text',
								`${toFactoids(getFactoshiFee(newEcRate))} ${
									networkProps[network].factoidAbbreviation
								}`
							);
							cy.get('[data-cy="previewTotalAmount"]').should(
								'have.text',
								`${toFactoids(addressTwoBalance)} ${
									networkProps[network].factoidAbbreviation
								}`
							);

							// Send max factoids back (second address -> first address)
							cy.contains('Send Factoids').click();
							cy.wait(5000);
							cy.contains('Transaction ID');
							cy.get('[data-cy="balance"]')
								.invoke('text')
								.then((text) => {
									// Test Balance
									expect(text.replace(/\u00a0/g, ' ')).equal(
										`0  ${networkProps[network].factoidAbbreviation}`
									);
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
										`${newMaxFactoids}  ${
											networkProps[network].factoidAbbreviation
										}`
									);
								});

							// Sidebar
							cy.get('[data-cy="sidebarFctIndex_0"]').within(() => {
								cy.get('[data-cy="sidebarFctNickname"]').should(
									'have.text',
									addressOne.fctName
								);
								cy.get('[data-cy="sidebarFctBalance"]')
									.invoke('text')
									.then((text) => {
										expect(text.replace(/\u00a0/g, ' ')).equal(
											`${newMaxFactoids}  ${
												networkProps[network].factoidAbbreviation
											}`
										);
									});
							});
							cy.get('[data-cy="sidebarFctIndex_1"]').within(() => {
								cy.get('[data-cy="sidebarFctNickname"]').should(
									'have.text',
									addressTwo.fctName
								);
								cy.get('[data-cy="sidebarFctBalance"]')
									.invoke('text')
									.then((text) => {
										expect(text.replace(/\u00a0/g, ' ')).equal(
											`0  ${networkProps[network].factoidAbbreviation}`
										);
									});
							});
						});
					});
				});
			});
		});
	});
});
