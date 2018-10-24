import React from 'react';
import _flowRight from 'lodash/flowRight';
import _get from 'lodash/get';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withWalletContext } from '../Context/WalletContext';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';

/**
 * Constants
 */
const NICKNAME_MAX_LENGTH = 25;
const nicknamePath = 'nickname';
const saveLocallyPath = 'saveLocally';
const deleteAnchorElPath = 'deleteAnchorEl';

class AddressInfoForm extends React.Component {
	handleKeyPress(event) {
		if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
			event.preventDefault();
		}
	}

	render() {
		const {
			classes,
			walletController: {
				getActiveAddress,
				getFactoidAddresses,
				getEntryCreditAddresses,
				activeAddressIndex_o,
				updateAddress,
				deleteAddress,
			},
		} = this.props;

		const activeAddress_o = getActiveAddress();

		let userAddressList = [];
		if (activeAddressIndex_o.type === 'fct') {
			userAddressList = getFactoidAddresses();
		} else if (activeAddressIndex_o.type === 'ec') {
			userAddressList = getEntryCreditAddresses();
		}

		const userAddressNicknames = userAddressList
			.filter((addr_o) => addr_o.address !== activeAddress_o.address)
			.map((addr_o) => addr_o.nickname);

		return (
			<Formik
				enableReinitialize
				initialValues={{
					[saveLocallyPath]: activeAddress_o.saveLocally,
					[nicknamePath]: activeAddress_o.nickname,
					[deleteAnchorElPath]: null,
				}}
				onSubmit={(values, actions) => {
					window.setTimeout(() => {
						updateAddress(
							activeAddressIndex_o,
							_get(values, nicknamePath).trim(),
							_get(values, saveLocallyPath)
						);
						actions.resetForm();
					}, 500);
				}}
				validationSchema={Yup.object().shape({
					[nicknamePath]: Yup.string()
						.trim()
						.required('Required')
						.test(
							nicknamePath,
							'Enter unique nickname',
							(value) => userAddressNicknames.indexOf(value) === -1
						),
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
						<Typography variant="h6">Edit Address</Typography>
						<Grid container item xs={12}>
							<Grid item xs={12}>
								<FormTextField
									error={
										errors[nicknamePath] && touched[nicknamePath] ? true : false
									}
									name={nicknamePath}
									label="Nickname"
									maxLength={NICKNAME_MAX_LENGTH}
								/>
								<br />
								<ErrorMessage
									name={nicknamePath}
									render={(msg) => (
										<span className={classes.errorText}>{msg}</span>
									)}
								/>
							</Grid>
							<Grid item xs={12}>
								<Field
									name={saveLocallyPath}
									render={({ field, form }) => (
										<FormControlLabel
											control={
												<Checkbox
													onChange={handleChange}
													name={saveLocallyPath}
													checked={field.value}
													color="default"
												/>
											}
											label="Saved to local browser storage"
										/>
									)}
								/>
							</Grid>
							<Grid item xs={12}>
								<Button
									type="submit"
									disabled={isSubmitting}
									variant="contained"
									color="primary"
								>
									Submit{' '}
									{isSubmitting && (
										<React.Fragment>
											&nbsp;
											<CircularProgress size={20} />
										</React.Fragment>
									)}
								</Button>
								<Button
									aria-owns={values[deleteAnchorElPath] ? 'simple-menu' : null}
									aria-haspopup="true"
									className={classes.deleteButton}
									variant="outlined"
									color="secondary"
									onClick={(event) => {
										setFieldValue(deleteAnchorElPath, event.currentTarget);
									}}
								>
									Delete
								</Button>
								<Menu
									id="simple-menu"
									anchorEl={values[deleteAnchorElPath]}
									open={Boolean(values[deleteAnchorElPath])}
									onClose={() => {
										setFieldValue(deleteAnchorElPath, null);
									}}
								>
									<MenuItem
										onClick={() => {
											deleteAddress(activeAddressIndex_o);
											setFieldValue(deleteAnchorElPath, null);
										}}
										className={classes.deleteConfirmationText}
									>
										Confirm Delete
									</MenuItem>
								</Menu>
							</Grid>
						</Grid>
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
					multiline
					error={props.error}
				/>
			)}
		</Field>
	);
};

AddressInfoForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	errorText: { color: 'red', fontSize: '12px' },
	deleteButton: { marginLeft: 15 },
	deleteConfirmationText: { color: 'red' },
});

const enhancer = _flowRight(withWalletContext, withStyles(styles));

export default enhancer(AddressInfoForm);
