import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import _isNil from 'lodash/isNil';
import _flowRight from 'lodash/flowRight';
import _get from 'lodash/get';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withWalletContext } from '../context/WalletContext';
import { withSeed } from '../context/SeedContext';
import { withNetwork } from '../context/NetworkContext';
import GenerateAddressTable from './GenerateAddressTable';

/**
 * Constants
 */
const addressesPath = 'addresses';

const getTitle = (networkProps) => {
	return {
		fct: networkProps.factoidAbbreviationFull + ' Addresses',
		ec: networkProps.ecAbbreviationFull + ' Addresses',
	};
};

function SeedForm(props) {
	const {
		mnemonic,
		type,
		handleNext,
		networkController: { networkProps },
		seedController: { getSeedAddresses },
		walletController: { getAddresses, addAddresses, newSeedAddress },
	} = props;

	const [generatedAddressList, setGeneratedAddressList] = useState([]);

	const [count, setCount] = useState(5);
	useEffect(() => {
		async function fetchData() {
			await fetchAddresses();
		}

		async function fetchAddresses() {
			const newAddressList = await getSeedAddresses(
				mnemonic,
				count - 5,
				5,
				type
			);

			setGeneratedAddressList((prevState) => [...prevState, ...newAddressList]);
		}

		fetchData();
	}, [count, mnemonic, type, getSeedAddresses]);

	function getNextFive() {
		setCount((prevCount) => setCount(prevCount + 5));
	}

	function isAddressSelected(formValues) {
		return Object.keys(formValues)
			.filter((key) => key.startsWith('checkbox'))
			.some((key) => formValues[key]);
	}

	let userAddressList = getAddresses(type);

	return (
		<Formik
			enableReinitialize
			initialValues={{
				[addressesPath]: [],
			}}
			onSubmit={async (values, actions) => {
				let validAddresses = [];
				for (let value of _get(values, addressesPath)) {
					if (!_isNil(value)) {
						validAddresses.push(value);
					}
				}
				// add addresses
				addAddresses(validAddresses, type);

				// proceed to next page
				handleNext();
			}}
			render={({
				isSubmitting,
				errors,
				touched,
				values,
				setFieldValue,
				handleChange,
			}) => (
				<Form>
					<GenerateAddressTable
						title={getTitle(networkProps)[type]}
						type={type}
						generatedAddressList={generatedAddressList}
						userAddressList={userAddressList}
						getNextFive={getNextFive}
						newAddress={newSeedAddress}
						values={values}
						errors={errors}
						touched={touched}
						setFieldValue={setFieldValue}
						handleChange={handleChange}
					/>

					<br />
					<br />
					{props.handleBack && <Button onClick={props.handleBack}>Back</Button>}
					<Button
						type="submit"
						disabled={isSubmitting}
						variant="contained"
						color="primary"
					>
						{isAddressSelected(values) ? 'Add and Continue' : 'Skip'}
					</Button>
				</Form>
			)}
		/>
	);
}

SeedForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	errorText: { color: 'red', fontSize: '12px' },
});

const enhancer = _flowRight(
	withNetwork,
	withSeed,
	withWalletContext,
	withStyles(styles)
);

export default enhancer(SeedForm);
