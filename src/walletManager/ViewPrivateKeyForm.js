import React, { Component } from 'react';
import _flowRight from 'lodash/flowRight';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { withWalletContext } from '../context/WalletContext';
import { withSeed } from '../context/SeedContext';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import AddressInfoHeader from './shared/AddressInfoHeader';
import Typography from '@material-ui/core/Typography';
import Visibility from '@material-ui/icons/Visibility';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

/**
 * Constants
 */
const privateKeyPath = 'privateKey';
const showPasswordPath = 'showPassword;';
const seedPath = 'seed';

class ViewPrivateKeyForm extends Component {
	verifySeed = (seed) => {
		const activeAddress_o = this.props.walletController.getActiveAddress();
		return this.props.seedController.verifySeed(seed, activeAddress_o);
	};

	render() {
		const {
			classes,
			walletController: { getActiveAddress },
			seedController: { getPrivateKey },
		} = this.props;

		const activeAddress_o = getActiveAddress();

		return (
			<Formik
				enableReinitialize
				initialValues={{
					[privateKeyPath]: '',
					[seedPath]: '',
					[showPasswordPath]: false,
					addressToReinitialize: activeAddress_o.address,
				}}
				onSubmit={async (values, actions) => {
					const { seed } = values;
					try {
						const mnemonic = seed.trim();
						const privateKey = getPrivateKey(mnemonic, activeAddress_o);
						actions.setFieldValue(privateKeyPath, privateKey);
					} catch (err) {
						console.log(err);
					}
				}}
				validationSchema={Yup.object().shape({
					[seedPath]: Yup.string()
						.trim()
						.required('Required')
						.test(seedPath, 'Invalid Seed Phrase', this.verifySeed),
				})}
				render={({ isSubmitting, errors, touched, values, setFieldValue }) => (
					<Form
						autoComplete="nope"
						// eslint-disable-next-line
						autoComplete="off"
					>
						<AddressInfoHeader />
						{_isEmpty(_get(values, privateKeyPath)) && (
							<FormTextField
								name={seedPath}
								fullWidth={true}
								label="Seed Phrase"
								type="text"
								placeholder={
									'Enter Seed Phrase for ' + activeAddress_o.nickname
								}
								error={_get(errors, seedPath) && _get(touched, seedPath)}
								errorClass={classes.errorText}
								disabled={isSubmitting}
							/>
						)}
						<br />
						{!_isEmpty(_get(values, privateKeyPath)) && (
							<React.Fragment>
								<br />
								<Typography variant="subtitle2" style={{ fontSize: 15 }}>
									Private Key:&nbsp;
									{_get(values, privateKeyPath) && (
										<React.Fragment>
											{_get(values, showPasswordPath) ? (
												_get(values, privateKeyPath)
											) : (
												<React.Fragment>
													...
													<Tooltip title="Display Private Key">
														<IconButton
															onClick={() => {
																setFieldValue(showPasswordPath, true);
															}}
														>
															<Visibility
																color="secondary"
																style={{ fontSize: 35 }}
															/>
														</IconButton>
													</Tooltip>
												</React.Fragment>
											)}
										</React.Fragment>
									)}
								</Typography>
							</React.Fragment>
						)}
						<br />

						{isSubmitting ? (
							<React.Fragment />
						) : (
							<Button
								className={classes.sendButton}
								variant="contained"
								color="primary"
								type="submit"
								disabled={isSubmitting}
							>
								Submit
							</Button>
						)}
					</Form>
				)}
			/>
		);
	}
}

const FormTextField = (props) => {
	return (
		<React.Fragment>
			<Field name={props.name}>
				{({ field }) => (
					<TextField
						style={{ width: props.width }}
						required={props.required}
						disabled={props.disabled}
						placeholder={props.placeholder}
						{...field}
						type={props.type}
						inputProps={{
							spellCheck: props.enableSpellCheck,
							maxLength: props.maxLength,
							autoComplete: 'nope',
							// eslint-disable-next-line
							autoComplete: 'off',
						}}
						error={props.error}
						label={props.label}
						fullWidth={props.fullWidth}
						multiline={props.multiline}
					/>
				)}
			</Field>
			<ErrorMessage
				name={props.name}
				render={(msg) => <div className={props.errorClass}>{msg}</div>}
			/>
		</React.Fragment>
	);
};

ViewPrivateKeyForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = {
	sendButton: {
		width: '50%',
	},
	errorText: { color: 'red', fontSize: '12px', textAlign: 'left' },
};

const enhancer = _flowRight(withSeed, withWalletContext, withStyles(styles));

export default enhancer(ViewPrivateKeyForm);
