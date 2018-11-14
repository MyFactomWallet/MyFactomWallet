import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import { withWalletContext } from '../context/WalletContext';
import _get from 'lodash/get';
import _flowRight from 'lodash/flowRight';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import factombip44 from 'factombip44/dist/factombip44';

/**
 * Constants
 */
const mnemonicPath = 'mnemonic';

class ImportSeedForm extends React.Component {
	render() {
		const { classes } = this.props;

		return (
			<Formik
				initialValues={{
					[mnemonicPath]: '',
				}}
				onSubmit={(values, actions) => {
					this.props.setMnemonic(_get(values, mnemonicPath).trim());
					// proceed to next page
					this.props.handleNext();
				}}
				validationSchema={Yup.object().shape({
					[mnemonicPath]: Yup.string()
						.trim()
						.required('Required')
						.test(
							mnemonicPath,
							'Invalid Seed Phrase',
							factombip44.validMnemonic
						),
				})}
				render={({ isSubmitting, errors, touched }) => (
					<Form
						style={{ width: '500px' }}
						autoComplete="nope"
						autoComplete="off"
					>
						<React.Fragment>
							<FormTextField
								error={
									_get(errors, mnemonicPath) && _get(touched, mnemonicPath)
										? true
										: false
								}
								name={mnemonicPath}
								label="Seed Phrase"
								placeholder={'Enter Seed Phrase'}
								autoFocus={true}
							/>
							<ErrorMessage
								name={mnemonicPath}
								render={(msg) => (
									<span className={classes.errorText}>{msg}</span>
								)}
							/>
						</React.Fragment>

						<br />
						<br />
						<div>
							<Button
								onClick={() => {
									this.props.setMnemonic(null);
									this.props.handleBack();
								}}
							>
								Back
							</Button>

							<Button
								type="submit"
								disabled={isSubmitting}
								variant="contained"
								color="primary"
							>
								Next
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
						autoComplete: 'nope',
						autoComplete: 'off',
					}}
					{...field}
					label={props.label + ' ' + (props.error ? '*' : '')}
					margin="dense"
					fullWidth
					error={props.error}
					autoFocus={props.autoFocus}
				/>
			)}
		</Field>
	);
};

ImportSeedForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	warningText: { color: 'red', fontSize: '15px' },
	errorText: { color: 'red' },
});

const enhancer = _flowRight(withWalletContext, withStyles(styles));

export default enhancer(ImportSeedForm);
