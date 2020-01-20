import React, { useState } from 'react';
import ImportTypeForm from './ImportTypeForm';
import ImportFctForm from './ImportFctForm';
import ImportEcForm from './ImportEcForm';
import NewSeedForm from './NewSeedForm';
import LedgerForm from './LedgerForm';
import SeedForm from './SeedForm';
import ImportSeedForm from './ImportSeedForm';

function AddWalletStepContent(props) {
	const [mnemonic, setMnemonic] = useState(null);

	const {
		activeStep,
		updateImportType,
		handleNext,
		handleBack,
		importType,
	} = props;

	switch (activeStep) {
		case 0:
			return (
				<ImportTypeForm
					handleNext={handleNext}
					importType={importType}
					updateImportType={updateImportType}
				/>
			);
		case 1:
			if (importType === 'fct') {
				return (
					<ImportFctForm handleNext={handleNext} handleBack={handleBack} />
				);
			} else if (importType === 'ec') {
				return <ImportEcForm handleNext={handleNext} handleBack={handleBack} />;
			} else if (importType === 'new') {
				return (
					<NewSeedForm
						setMnemonic={setMnemonic}
						mnemonic={mnemonic}
						handleNext={handleNext}
						handleBack={handleBack}
					/>
				);
			} else if (importType === 'importSeed') {
				return (
					<ImportSeedForm
						setMnemonic={setMnemonic}
						handleNext={handleNext}
						handleBack={handleBack}
					/>
				);
			} else if (importType === 'ledger') {
				return (
					<LedgerForm
						handleNext={handleNext}
						handleBack={handleBack}
						type="fct"
						key="fctLedgerForm"
					/>
				);
			}
			break;
		case 2:
			if (importType === 'new' || importType === 'importSeed') {
				return (
					<SeedForm
						mnemonic={mnemonic}
						handleNext={handleNext}
						type="fct"
						key="fctSeedForm"
					/>
				);
			}
			break;
		case 3:
			if (importType === 'new' || importType === 'importSeed') {
				return (
					<SeedForm
						mnemonic={mnemonic}
						handleNext={handleNext}
						handleBack={handleBack}
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
export default AddWalletStepContent;
