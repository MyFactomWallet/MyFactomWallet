import React from 'react';
import _flowRight from 'lodash/flowRight';
import { Formik, Form } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import { isValidPublicFctAddress } from 'factom/dist/factom';
import get from 'lodash/get';
import findIndex from 'lodash/findIndex';
import { withWalletContext } from '../context/WalletContext';
import { withNetwork } from '../context/NetworkContext';
import { ADDRESS_LENGTH } from '../constants/WALLET_CONSTANTS';
import FormTextField from '../component/form/FormTextField';
import { NICKNAME_MAX_LENGTH } from '../constants/WALLET_CONSTANTS';

/**
 * Constants
 */
const fctAddrPath = 'factoidAddress';
const nicknamePath = 'nickname';

class ImportFctForm extends React.Component {
	render() {
		const {
			walletController: { getFactoidAddresses, newStandardAddress, addAddress },
			networkController: { networkProps },
		} = this.props;

		const factoidAddresses = getFactoidAddresses();

		return (
			<Formik
				initialValues={{ factoidAddress: '', nickname: '' }}
				onSubmit={(values, actions) => {
					const fctAddress_o = newStandardAddress(
						get(values, fctAddrPath),
						get(values, nicknamePath).trim()
					);

					addAddress(fctAddress_o, 'fct');

					// proceed to next page
					this.props.handleNext();
				}}
				validationSchema={Yup.object().shape({
					[fctAddrPath]: Yup.string()
						.required('Required')
						.test(fctAddrPath, 'Invalid Address', isValidPublicFctAddress)
						.test(
							fctAddrPath,
							'Enter unique address',
							(value) => findIndex(factoidAddresses, ['address', value]) === -1
						),
					[nicknamePath]: Yup.string()
						.trim()
						.required('Required')
						.test(
							nicknamePath,
							'Enter unique nickname',
							(value) =>
								findIndex(factoidAddresses, [nicknamePath, value]) === -1
						),
				})}
				render={({ isSubmitting, errors, touched }) => (
					<Form>
						<FormTextField
							error={
								errors.factoidAddress && touched.factoidAddress ? true : false
							}
							name={fctAddrPath}
							label={
								'Public ' + networkProps.factoidAbbreviationFull + ' Address'
							}
							maxLength={ADDRESS_LENGTH}
							margin="dense"
							fullWidth
						/>

						<FormTextField
							error={
								errors[nicknamePath] && touched[nicknamePath] ? true : false
							}
							name={nicknamePath}
							label="Nickname"
							maxLength={NICKNAME_MAX_LENGTH}
							margin="dense"
							fullWidth
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

ImportFctForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({});

const enhancer = _flowRight(withNetwork, withWalletContext, withStyles(styles));

export default enhancer(ImportFctForm);
