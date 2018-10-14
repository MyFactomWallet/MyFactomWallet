import React from 'react';
import _flowRight from 'lodash/flowRight';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { isValidFctPublicAddress } from 'factom/dist/factom-struct';
import get from 'lodash/get';
import findIndex from 'lodash/findIndex';
import { withWalletContext } from '../Context/WalletContext';

/**
 * Constants
 */
const FCT_ADDRESS_LENGTH = 52;
const fctAddrPath = 'factoidAddress';
const nicknamePath = 'nickname';

class ImportFctForm extends React.Component {
	handleKeyPress(event) {
		if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
			event.preventDefault();
		}
	}
	render() {
		const { classes } = this.props;
		const { factoidWallets, addFactoidWallet } = this.props.walletController;

		return (
			<Formik
				initialValues={{ factoidAddress: '', nickname: '' }}
				onSubmit={(values, actions) => {
					console.log(values);

					addFactoidWallet(get(values, fctAddrPath), get(values, nicknamePath));

					// proceed to next page
					this.props.handleNext();
				}}
				validationSchema={Yup.object().shape({
					[fctAddrPath]: Yup.string()
						.test(fctAddrPath, 'Invalid Address', isValidFctPublicAddress)
						.test(
							fctAddrPath,
							'Enter unique address',
							(value) => findIndex(factoidWallets, ['address', value]) === -1
						),
					[nicknamePath]: Yup.string()
						.trim()
						.required('Required')
						.test(
							nicknamePath,
							'Enter unique nickname',
							(value) => findIndex(factoidWallets, [nicknamePath, value]) === -1
						),
				})}
				render={({ isSubmitting, errors, touched }) => (
					<Form onKeyPress={this.handleKeyPress}>
						<FormTextField
							error={
								errors.factoidAddress && touched.factoidAddress ? true : false
							}
							name={fctAddrPath}
							label="Public Factoid Address"
							maxLength={FCT_ADDRESS_LENGTH}
						/>
						<ErrorMessage
							name={fctAddrPath}
							render={(msg) => <span className={classes.errorText}>{msg}</span>}
						/>
						<FormTextField
							error={
								errors[nicknamePath] && touched[nicknamePath] ? true : false
							}
							name={nicknamePath}
							label="Nickname"
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
								variant="raised"
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
					}}
					{...field}
					label={props.label + ' ' + (props.error ? '*' : '')}
					margin="dense"
					fullWidth
					multiline
					error={props.error}
				/>
			)}
		</Field>
	);
};

ImportFctForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	errorText: { color: 'red', fontSize: '12px' },
});

const enhancer = _flowRight(withWalletContext, withStyles(styles));

export default enhancer(ImportFctForm);
