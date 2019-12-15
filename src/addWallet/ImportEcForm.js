import React from 'react';
import _flowRight from 'lodash/flowRight';
import { Formik, Form } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import { isValidPublicEcAddress } from 'factom/dist/factom';
import _get from 'lodash/get';
import findIndex from 'lodash/findIndex';
import { withWalletContext } from '../context/WalletContext';
import { withNetwork } from '../context/NetworkContext';
import { ADDRESS_LENGTH } from '../constants/WALLET_CONSTANTS';
import FormTextField from '../component/form/FormTextField';
import { NICKNAME_MAX_LENGTH } from '../constants/WALLET_CONSTANTS';

/**
 * Constants
 */
const ecAddrNamePath = 'entryCreditAddress';
const nicknamePath = 'nickname';

class ImportEcForm extends React.Component {
	render() {
		const {
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
						.test(ecAddrNamePath, 'Invalid Address', isValidPublicEcAddress)
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

ImportEcForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({});

const enhancer = _flowRight(withNetwork, withWalletContext, withStyles(styles));

export default enhancer(ImportEcForm);
