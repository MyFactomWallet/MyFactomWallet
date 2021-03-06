# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [UNRELEASED]

## [2.2.0] - 2021-02-13

### Added

- Added support to update balances automatically
- Improved overall Ledger experience
- Updated dependencies

### Fixed

- Fixed [Ledger](https://www.ledger.com/) transactions on Windows
- Fixed broken testnet explorer links to use the [Testnet Factom Realtime Explorer](https://testnet.explorer.factom.pro/)

### Changed

- Changed Ledger transport library from `@ledgerhq/lhw-transport-u2f` to `@ledgerhq/hw-transport-webusb` to support Windows transactions

## [2.1.0] - 2020-06-30

### Added

- Changed mainnet explorer links to use Factom Realtime Explorer
- Improved Factom node connection reliability
- Updated dependencies

## [2.0.0] - 2020-04-01

### Added

- Added End-to-End tests
- Updated generate address UI
- Migrated Material-UI to v4
- Improved validations around factoid and entry credit input amounts
- Updated address information header UI
- Added error handling around connecting to nodes
- Converted React components to use hooks
- Added FactomEventEmitter to fetch new directory blocks when they are available
- Changed from HashRouter to BrowserRouter
- Refactor form fields to use reusable components
- Updated edit address form to save automatically
- Added sidebar icons to differentiate address import types

### Fixed

- Fixed js floating-point arithmetic issues causing the amount field and transaction previews to display incorrectly

### Removed

- Moved [On-Chain Voting](https://vote.myfactomwallet.com) to its own [repository](https://github.com/myfactomwallet/voting)

## [1.0.0] - 2019-12-21

### Added

- Import Factoid and Entry Credit addresses
- Generate new addresses using mnemonic seed phrase or Ledger Nano S/X device
- Send and receive Factoids
- Convert Factoids to Entry Credits
- Supports Factom Mainnet and Testnet
- Sign transactions with private key, mnemonic seed phrase, or Ledger device
- Save public addresses to local browser storage
- Support for fully audit-able and decentralized on-chain voting
- MIT License
