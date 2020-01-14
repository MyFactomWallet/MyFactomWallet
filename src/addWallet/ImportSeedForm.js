import React from 'react';
import { Formik, Form } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import { withWalletContext } from '../context/WalletContext';
import _get from 'lodash/get';
import _flowRight from 'lodash/flowRight';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import factombip44 from 'factombip44/dist/factombip44';
import FormTextField from '../component/form/FormTextField';

/**
 * Constants
 */
const mnemonicPath = 'mnemonic';

class ImportSeedForm extends React.Component {
	render() {
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
						// eslint-disable-next-line
						autoComplete="off"
					>
						<>
							<FormTextField
								error={
									_get(errors, mnemonicPath) && _get(touched, mnemonicPath)
										? true
										: false
								}
								name={mnemonicPath}
								label="Seed Phrase"
								placeholder="Enter Seed Phrase"
								autoFocus
								margin="dense"
								fullWidth
							/>
						</>

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

ImportSeedForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({});

const enhancer = _flowRight(withWalletContext, withStyles(styles));

export default enhancer(ImportSeedForm);
