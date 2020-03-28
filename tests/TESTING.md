# Testing

MyFactomWallet utilizes [Cypress](https://www.cypress.io/) for running end-to-end tests.

## Test Setup

Save this file at `tests/e2e/config.yaml`

Replace the values in < > with your own.

```yaml
addresses:
  mainnet:
    - ecAddress: <yourEcAddress>
      ecName: e2e EC Mainnet 1
      fctAddress: <yourFctAddress>
      fctName: e2e Fct Mainnet 1
      seed: <yourSeedPhrase>
    - ecAddress: <anotherEcAddress>
      ecName: e2e EC Mainnet 2
      fctAddress: <anotherFctAddress>
      fctName: e2e Fct Mainnet 2
      seed: <anotherSeedPhrase>
  testnet:
    - ecAddress: <yourEcAddress>
      ecName: e2e EC Testnet 1
      fctAddress: <yourFctAddress>
      fctName: e2e Fct Testnet 1
      seed: <yourSeedPhrase>
    - ecAddress: <anotherEcAddress>
      ecName: e2e EC Testnet 2
      fctAddress: <anotherFctAddress>
      fctName: e2e Fct Testnet 2
      seed: <anotherSeedPhrase>
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
