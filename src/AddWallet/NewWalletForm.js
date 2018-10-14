import React from 'react';
import { Formik, Form, Field } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import factombip44 from 'factombip44/dist/factombip44';
import Typography from '@material-ui/core/Typography';
import {
	keyToPrivateFctAddress,
	getPublicAddress,
	keyToPrivateEcAddress,
} from 'factom/dist/factom-struct';

class NewWalletForm extends React.Component {
	handleKeyPress(event) {
		if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
			event.preventDefault();
		}
	}
	keyToFctAddress(key) {
		return getPublicAddress(keyToPrivateFctAddress(key));
	}
	keyToECAddress(key) {
		return getPublicAddress(keyToPrivateEcAddress(key));
	}
	render() {
		const mnemonic = factombip44.randomMnemonic();
		console.log(mnemonic);

		var wallet = new factombip44.FactomBIP44(mnemonic);

		var factoidArray = [];

		for (var i = 0; i < 5; i++) {
			const publicAddress = this.keyToFctAddress(
				wallet.generateFactoidPrivateKey(0, 0, i)
			);
			console.log('FCT Addr: ' + publicAddress);

			factoidArray.push({ publicAddress, index: i });
		}

		console.log('factoidArray' + factoidArray);
		/*
		var ecArray = [];

		for (var i = 0; i < 5; i++) {
			const publicAddress = this.keyToECAddress(
				wallet.generateEntryCreditPrivateKey(0, 0, i)
			);
			console.log('EC Addr: ' + publicAddress);

			ecArray.push({ publicAddress, index: i });
		}

		console.log('EC Array: ' + ecArray[0].publicAddress);
*/
		return (
			<Formik
				initialValues={{
					ecAddress: '',
					ecNickname: '',
					fctNickname: '',
				}}
				onSubmit={(values, actions) => {
					console.log(values);

					// proceed to next page
					this.props.handleNext();
				}}
				validationSchema={Yup.object().shape({
					ecNickname: Yup.string().required(),
					fctNickname: Yup.string().required(),
				})}
				render={({ values, handleChange, isSubmitting, errors, touched }) => (
					<Form onKeyPress={this.handleKeyPress}>
						<Typography variant="body2">Seed Phrase:</Typography>
						<Typography>{mnemonic}</Typography>

						<FormTextField
							error={errors.ecNickname && touched.ecNickname ? true : false}
							name="ecNickname"
							label="Factoid Address Nickname"
						/>
						<FormTextField
							error={errors.ecNickname && touched.ecNickname ? true : false}
							name="fctNickname"
							label="Entry Credit Address Nickname"
						/>

						<br />
						<br />
						<div>
							<Button onClick={this.props.handleBack}>Back</Button>
							<Button
								type="submit"
								//disabled={isSubmitting}
								disabled
								variant="raised"
								color="primary"
							>
								Not implemented yet
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

NewWalletForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	errorText: { color: 'red', fontSize: '12px' },
});
export default withStyles(styles)(NewWalletForm);
