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
import Typography from '@material-ui/core/Typography';
import { withLedger } from '../Context/LedgerContext';
import GenerateAddressTable from './GenerateAddressTable';
import CircularProgress from '@material-ui/core/CircularProgress';

/**
 * Constants
 */
const addressesPath = 'addresses';
const TITLE_CONSTANTS = {
	fct: 'Ledger Nano S Factoid Addresses',
	ec: 'Ledger Nano S Entry Credit Addresses',
};

class LedgerForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			generatedAddressList: [],
			ledgerConnected: false,
			ledgerStatus: null,
		};
	}

	componentDidMount() {
		this.getNextFive(0);
	}

	getNextFive = async (startIndex) => {
		try {
			const generatedAddressList = await this.props.ledgerController.getLedgerAddresses(
				startIndex,
				5,
				this.props.type
			);

			this.setState((prevState) => ({
				generatedAddressList: [
					...prevState.generatedAddressList,
					...generatedAddressList,
				],
				ledgerConnected: true, //delete
			}));
		} catch (err) {
			console.log(err);
			this.setState({
				ledgerStatus: 'Ledger Nano S not found. Please go back and try again.',
				ledgerConnected: false,
			});
		}
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
			walletController: { getAddresses, addAddresses, newLedgerAddress },
		} = this.props;

		let userAddressList = getAddresses(type);

		return (
			<Formik
				enableReinitialize
				initialValues={{
					addresses: [],
					ledgerConnected: this.state.ledgerConnected,
					ledgerStatus: this.state.ledgerStatus,
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
				validationSchema={Yup.object().shape({
					/* 	[addressesPath]: Yup.array()
						.compact()
						.required('* You must add an Address'), */
				})}
				render={({
					isSubmitting,
					errors,
					touched,
					values,
					setFieldValue,
					handleChange,
				}) => (
					<Form onKeyPress={this.handleKeyPress}>
						{values.ledgerConnected ? (
							<React.Fragment>
								<GenerateAddressTable
									title={TITLE_CONSTANTS[type]}
									type={type}
									generatedAddressList={this.state.generatedAddressList}
									userAddressList={userAddressList}
									getNextFive={this.getNextFive}
									newAddress={newLedgerAddress}
									values={values}
									errors={errors}
									touched={touched}
									setFieldValue={setFieldValue}
									handleChange={handleChange}
								/>
							</React.Fragment>
						) : (
							<React.Fragment>
								<br />
								{!_isNil(values.ledgerStatus) ? (
									values.ledgerStatus
								) : (
									<React.Fragment>
										<Typography>
											<b>Connect your Ledger</b>
										</Typography>
										<CircularProgress thickness={7} />
									</React.Fragment>
								)}
							</React.Fragment>
						)}

						<br />
						<br />
						<div>
							<Button onClick={this.props.handleBack}>Back</Button>
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

LedgerForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	errorText: { color: 'red', fontSize: '12px' },
});

const enhancer = _flowRight(withLedger, withWalletContext, withStyles(styles));

export default enhancer(LedgerForm);
