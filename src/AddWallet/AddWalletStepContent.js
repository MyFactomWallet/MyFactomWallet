import React from 'react';
import WalletTypeForm from './WalletTypeForm.js';
import ImportFctForm from './ImportFctForm.js';
import ImportEcForm from './ImportEcForm.js';
import NewWalletForm from './NewWalletForm.js';

class AddWalletStepContent extends React.Component {
	render() {
		switch (this.props.activeStep) {
			case 0:
				return (
					<WalletTypeForm
						handleNext={this.props.handleNext}
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
						<NewWalletForm
							handleNext={this.props.handleNext}
							handleBack={this.props.handleBack}
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
