import React from 'react';
import _flowRight from 'lodash/flowRight';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { isValidEcPublicAddress } from 'factom/dist/factom';
import _get from 'lodash/get';
import findIndex from 'lodash/findIndex';
import { withWalletContext } from '../Context/WalletContext';
import { withNetwork } from '../Context/NetworkContext';

/**
 * Constants
 */
const EC_ADDRESS_LENGTH = 52;
const NICKNAME_MAX_LENGTH = 25;
const ecAddrNamePath = 'entryCreditAddress';
const nicknamePath = 'nickname';

class ImportEcForm extends React.Component {
	render() {
		const {
			classes,
			walletController: {
				getEntryCreditAddresses,
				newStandardAddress,
				addAddress,
			},
			networkController: { networkProps },
		} = this.props;

		const ecAddresses = getEntryCreditAddresses();

		return (
			<Formik
				initialValues={{ entryCreditAddress: '', nickname: '' }}
				onSubmit={(values, actions) => {
					const ecAddress_o = newStandardAddress(
						_get(values, ecAddrNamePath),
						_get(values, nicknamePath).trim()
					);

					addAddress(ecAddress_o, 'ec');

					// proceed to next page
					this.props.handleNext();
				}}
				validationSchema={Yup.object().shape({
					[ecAddrNamePath]: Yup.string()
						.required('Required')
						.test(ecAddrNamePath, 'Invalid Address', isValidEcPublicAddress)
						.test(
							ecAddrNamePath,
							'Enter unique address',
							(value) => findIndex(ecAddresses, ['address', value]) === -1
						),
					[nicknamePath]: Yup.string()
						.trim()
						.required('Required')
						.test(
							nicknamePath,
							'Enter unique nickname',
							(value) => findIndex(ecAddresses, [nicknamePath, value]) === -1
						),
				})}
				render={({ isSubmitting, errors, touched }) => (
					<Form>
						<FormTextField
							error={
								errors.entryCreditAddress && touched.entryCreditAddress
									? true
									: false
							}
							name={ecAddrNamePath}
							label={'Public ' + networkProps.ecAbbreviationFull + ' Address'}
							helperText="test"
							maxLength={EC_ADDRESS_LENGTH}
						/>
						<ErrorMessage
							name={ecAddrNamePath}
							render={(msg) => <span className={classes.errorText}>{msg}</span>}
						/>
						<FormTextField
							error={
								errors[nicknamePath] && touched[nicknamePath] ? true : false
							}
							name={nicknamePath}
							label="Nickname"
							maxLength={NICKNAME_MAX_LENGTH}
						/>
						<ErrorMessage
							name={nicknamePath}
							render={(msg) => <span className={classes.errorText}>{msg}</span>}
						/>

						<br />
						<br />
						<div>
							<Button onClick={this.props.handleBack}>Back</Button>
							<Button
								type="submit"
								disabled={isSubmitting}
								variant="contained"
								color="primary"
							>
								Submit
							</Button>
						</div>
					</Form>
				)}
			/>
		);
	}
}

const FormTextField = (props) => {
	return (
		<Field name={props.name}>
			{({ field }) => (
				<TextField
					inputProps={{
						spellCheck: false,
						maxLength: props.maxLength,
						autoComplete: 'nope',
					}}
					{...field}
					label={props.label + ' ' + (props.error ? '*' : '')}
					margin="dense"
					fullWidth
					error={props.error}
				/>
			)}
		</Field>
	);
};

ImportEcForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	errorText: { color: 'red', fontSize: '12px' },
});

const enhancer = _flowRight(withNetwork, withWalletContext, withStyles(styles));

export default enhancer(ImportEcForm);
