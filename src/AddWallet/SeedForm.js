import React from 'react';
import { Formik, Form } from 'formik';
import _isNil from 'lodash/isNil';
import _flowRight from 'lodash/flowRight';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import { withWalletContext } from '../Context/WalletContext';
import GenerateAddressTable from './GenerateAddressTable';

/**
 * Constants
 */
const addressesPath = 'addresses';
const TITLE_CONSTANTS = {
	fct: 'Factoid Addresses',
	ec: 'Entry Credit Addresses',
};

class SeedForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			generatedAddressList: [],
		};
	}

	componentDidMount() {
		this.getNextFive(0);
	}

	getNextFive = async (startIndex) => {
		const generatedAddressList = await this.props.walletController.getSeedAddresses(
			this.props.mnemonic,
			startIndex,
			5,
			this.props.type
		);

		this.setState((prevState) => ({
			generatedAddressList: [
				...prevState.generatedAddressList,
				...generatedAddressList,
			],
		}));
	};

	handleKeyPress(event) {
		if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
			event.preventDefault();
		}
	}

	hasAddressSelected = (formValues) =>
		Object.keys(formValues)
			.filter((key) => key.startsWith('checkbox'))
			.some((key) => formValues[key]);

	render() {
		const {
			type,
			walletController: { getAddresses, addAddresses, newSeedAddress },
		} = this.props;

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
					addAddresses(validAddresses, this.props.type);

					// proceed to next page
					this.props.handleNext();
				}}
				validationSchema={Yup.object().shape({})}
				render={({
					isSubmitting,
					errors,
					touched,
					values,
					setFieldValue,
					handleChange,
				}) => (
					<Form onKeyPress={this.handleKeyPress}>
						<GenerateAddressTable
							title={TITLE_CONSTANTS[type]}
							type={type}
							generatedAddressList={this.state.generatedAddressList}
							userAddressList={userAddressList}
							getNextFive={this.getNextFive}
							newAddress={newSeedAddress}
							values={values}
							errors={errors}
							touched={touched}
							setFieldValue={setFieldValue}
							handleChange={handleChange}
						/>

						<br />
						<br />
						<div>
							{this.props.handleBack && (
								<Button onClick={this.props.handleBack}>Back</Button>
							)}
							<Button
								type="submit"
								disabled={isSubmitting}
								variant="raised"
								color="primary"
							>
								{this.hasAddressSelected(values) ? 'Add and Continue' : 'Skip'}
							</Button>
						</div>
					</Form>
				)}
			/>
		);
	}
}

SeedForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	errorText: { color: 'red', fontSize: '12px' },
});

const enhancer = _flowRight(withWalletContext, withStyles(styles));

export default enhancer(SeedForm);
