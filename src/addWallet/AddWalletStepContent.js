import React from 'react';
import ImportTypeForm from './ImportTypeForm';
import ImportFctForm from './ImportFctForm';
import ImportEcForm from './ImportEcForm';
import NewSeedForm from './NewSeedForm';
import LedgerForm from './LedgerForm';
import SeedForm from './SeedForm';
import ImportSeedForm from './ImportSeedForm';

class AddWalletStepContent extends React.Component {
	state = { mnemonic: null };

	setMnemonic = (mnemonic) => {
		this.setState({ mnemonic });
	};

	render() {
		switch (this.props.activeStep) {
			case 0:
				return (
					<ImportTypeForm
						handleNext={this.props.handleNext}
						importType={this.props.importType}
						updateImportType={this.props.updateImportType}
					/>
				);
			case 1:
				if (this.props.importType === 'fct') {
					return (
						<ImportFctForm
							handleNext={this.props.handleNext}
							handleBack={this.props.handleBack}
						/>
					);
				} else if (this.props.importType === 'ec') {
					return (
						<ImportEcForm
							handleNext={this.props.handleNext}
							handleBack={this.props.handleBack}
						/>
					);
				} else if (this.props.importType === 'new') {
					return (
						<NewSeedForm
							setMnemonic={this.setMnemonic}
							mnemonic={this.state.mnemonic}
							handleNext={this.props.handleNext}
							handleBack={this.props.handleBack}
						/>
					);
				} else if (this.props.importType === 'importSeed') {
					return (
						<ImportSeedForm
							setMnemonic={this.setMnemonic}
							handleNext={this.props.handleNext}
							handleBack={this.props.handleBack}
						/>
					);
				} else if (this.props.importType === 'ledger') {
					return (
						<LedgerForm
							handleNext={this.props.handleNext}
							handleBack={this.props.handleBack}
							type="fct"
							key="fctLedgerForm"
						/>
					);
				}
				break;
			case 2:
				if (
					this.props.importType === 'new' ||
					this.props.importType === 'importSeed'
				) {
					return (
						<SeedForm
							mnemonic={this.state.mnemonic}
							handleNext={this.props.handleNext}
							type="fct"
							key="fctSeedForm"
						/>
					);
				} else if (this.props.importType === 'ledger') {
					return (
						<LedgerForm
							handleNext={this.props.handleNext}
							handleBack={this.props.handleBack}
							type="ec"
							key="ecLedgerForm"
						/>
					);
				}
				break;
			case 3:
				if (
					this.props.importType === 'new' ||
					this.props.importType === 'importSeed'
				) {
					return (
						<SeedForm
							mnemonic={this.state.mnemonic}
							handleNext={this.props.handleNext}
							handleBack={this.props.handleBack}
							type="ec"
							key="ecSeedForm"
						/>
					);
				}
				break;
			default:
				return 'Unknown step';
		}
	}
}
export default AddWalletStepContent;
