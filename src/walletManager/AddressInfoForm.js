import React from 'react';
import _flowRight from 'lodash/flowRight';
import _get from 'lodash/get';
import { Formik, Form, Field } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import * as Yup from 'yup';
import { withWalletContext } from '../context/WalletContext';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Tooltip from '@material-ui/core/Tooltip';
import CheckCircle from '@material-ui/icons/CheckCircleOutlined';
import FormTextField from '../component/form/FormTextField';
import { NICKNAME_MAX_LENGTH } from '../constants/WALLET_CONSTANTS';

/**
 * Constants
 */
const CLEAR_SAVED_MS = 500;
const nicknamePath = 'nickname';
const oldNicknamePath = 'oldNickname';
const saveLocallyPath = 'saveLocally';
const deleteAnchorElPath = 'deleteAnchorEl';
const savedPath = 'saved';

function AddressInfoForm(props) {
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
	} = props;

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
				[oldNicknamePath]: activeAddress_o.nickname,
				[deleteAnchorElPath]: null,
				[savedPath]: false,
			}}
			onSubmit={(values, actions) => {
				actions.setFieldValue(savedPath, false);

				window.setTimeout(() => {
					updateAddress(
						activeAddressIndex_o,
						_get(values, nicknamePath).trim(),
						_get(values, saveLocallyPath)
					);
					actions.resetForm();
					actions.setFieldValue(savedPath, true);
				}, CLEAR_SAVED_MS);
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
				submitForm,
				handleBlur,
			}) => (
				<Form>
					<Grid container item xs={12} justify="space-between">
						<Grid item>
							<Typography display="inline" variant="h6">
								Edit Address
							</Typography>
							{isSubmitting && (
								<CircularProgress size={20} className={classes.icon} />
							)}
							{_get(values, savedPath) && (
								<Typography display="inline" style={{ color: 'green' }}>
									<CheckCircle className={classes.icon} />
								</Typography>
							)}
						</Grid>

						<Grid item xs={12} className={classes.textAlignLeft}>
							<FormTextField
								error={
									errors[nicknamePath] && touched[nicknamePath] ? true : false
								}
								name={nicknamePath}
								disabled={isSubmitting}
								onChange={(e) => {
									setFieldValue(savedPath, false);

									setFieldValue(oldNicknamePath, _get(values, nicknamePath));

									handleChange(e);
								}}
								onBlur={async (e) => {
									await handleBlur(e);
									if (e.target.value !== _get(values, oldNicknamePath)) {
										submitForm();
									}
								}}
								label="Nickname"
								maxLength={NICKNAME_MAX_LENGTH}
							/>
						</Grid>
						<Grid container item xs={12} className={classes.pushDown}>
							<Grid item xs={6} className={classes.textAlignLeft}>
								<Field
									name={saveLocallyPath}
									render={({ field, form }) => (
										<FormControlLabel
											control={
												<Checkbox
													onChange={async (e) => {
														await handleChange(e);
														submitForm();
													}}
													disabled={isSubmitting}
													name={saveLocallyPath}
													checked={field.value}
													color="default"
												/>
											}
											label="Save to browser"
										/>
									)}
								/>
							</Grid>
							<Grid item xs={1}>
								<Tooltip title="Delete address">
									<Fab
										className={classes.fab}
										size="small"
										style={{ boxShadow: 'none', width: 35, height: 35 }}
										disabled={isSubmitting}
										onClick={(event) => {
											if (!isSubmitting) {
												setFieldValue(deleteAnchorElPath, event.currentTarget);
											}
										}}
									>
										<DeleteForever />
									</Fab>
								</Tooltip>
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
					</Grid>
				</Form>
			)}
		/>
	);
}

AddressInfoForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = () => ({
	deleteButton: { marginLeft: 15 },
	deleteConfirmationText: { color: 'red' },
	icon: {
		position: 'relative',
		top: '5px',
		left: '6px',
	},
	textAlignLeft: { textAlign: 'left' },
	fab: { backgroundColor: '#3f51b545' },
	pushDown: { paddingTop: '7px' },
});

const enhancer = _flowRight(withWalletContext, withStyles(styles));

export default enhancer(AddressInfoForm);
