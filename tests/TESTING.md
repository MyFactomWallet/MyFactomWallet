# Testing

MyFactomWallet utilizes [Cypress](https://www.cypress.io/) for running end-to-end tests.

## Test Setup
Most of the tests don't require any configuration, but the importMnemonicAddress.test.js does require some setup.

Two addresses are required to send funds from the first address to the second address and back.

Save this file at `tests/e2e/config.yaml`

Replace the values in < > with your own.

```yaml
addresses:
  mainnet:
    mnemonic:
      - ecAddress: <EcAddress>
        ecName: e2e EC Mainnet 1
        fctAddress: <FctAddress>
        fctName: e2e Fct Mainnet 1
        seed: <SeedPhrase>
        index: <>
      - ecAddress: <anotherEcAddress>
        ecName: e2e EC Mainnet 2
        fctAddress: <anotherFctAddress>
        fctName: e2e Fct Mainnet 2
        seed: <SeedPhrase>
        index: <>
  testnet:
    mnemonic:
      - ecAddress: <EcAddress>
        ecName: e2e EC Testnet 1
        fctAddress: <FctAddress>
        fctName: e2e Fct Testnet 1
        seed: <SeedPhrase>
        index: <>
      - ecAddress: <anotherEcAddress>
        ecName: e2e EC Testnet 2
        fctAddress: <anotherFctAddress>
        fctName: e2e Fct Testnet 2
        seed: <SeedPhrase>
        index: <>
```

Start MFW

```sh
HTTPS=true npm start
```

E2E tests can either be run using the test runner or the command line.

### Test Runner

```sh
npm run cypress:open
```

### Command Line

Run all tests

```sh
npm run cypress:run
```

Run a specific test

```sh
npm run cypress:run -- --spec "tests/e2e/specs/addresses/generateAddressMnemonic.js"
```
