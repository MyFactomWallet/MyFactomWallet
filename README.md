# MyFactomWallet

View [MyFactomWallet](https://myfactomwallet.com)

## Table of Contents

- [Getting Started](#getting-started)
- [Tools](#tools)

## Getting Started

Run MyFactomWallet locally:

```bash
git clone https://github.com/MyFactomWallet/MyFactomWallet.git
cd MyFactomWallet
npm ci
HTTPS=true npm start #Linux, macOS (Bash)
set HTTPS=true&&npm start #Windows (cmd.exe)
```

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Many thanks to [MyEtherWallet](https://github.com/MyEtherWallet/) for inspiration.

See
[TESTINGS.md](https://github.com/MyFactomWallet/MyFactomWallet/blob/master/tests/TESTING.md)
for how to run the tests.

## Tools

[factomjs](https://github.com/PaulBernier/factomjs) Library to interact easily with Factom blockchain.

[factombip44](https://github.com/MyFactomWallet/factombip44) BIP44 for Factom in JavaScript.

[ledger-factomjs](https://github.com/MyFactomWallet/ledger-factomjs) JavaScript Factom Interface for the Ledger Nano S.

[factom-vote](https://github.com/PaulBernier/factom-vote) JavaScript implementation of the Factom voting specification.
