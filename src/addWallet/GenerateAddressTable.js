import React, { useState } from 'react';

import { Field, ErrorMessage, FieldArray } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormatBalance from '../walletManager/shared/BalanceFormatter.js';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';

import { NICKNAME_MAX_LENGTH } from '../constants/WALLET_CONSTANTS';

/**
 * Constants
 */
const addressesPath = 'addresses';

function GenerateAddressTable(props) {
	const [loading, setLoading] = useState(false);

	function addGeneratedAddress(nickname, address_o, index, arrayHelpers) {
		if (nickname) {
			const addr_o = props.newAddress(
				address_o.address,
				nickname.trim(),
				index
			);
			arrayHelpers.replace(index, addr_o);
		} else {
			arrayHelpers.replace(index, null);
		}
	}

	function validateNickname(value) {
		const { userAddressList } = props;
		const userAddressNicknames = userAddressList.map(
			(addr_o) => addr_o.nickname
		);

		let error;
		if (!value) {
			error = 'Required';
		} else if (userAddressNicknames.indexOf(value.trim()) !== -1) {
			error = 'Enter unique nickname';
		}
		return error;
	}

	async function getNext() {
		setLoading(true);
		await props.getNextFive();
		setLoading(false);
	}

	const {
		classes,
		generatedAddressList,
		userAddressList, // existing addresses
		values,
		errors,
		touched,
		setFieldValue,
		handleChange,
		type,
		title,
	} = props;

	const userAddresses = userAddressList.map((addr_o) => addr_o.address);

	return (
		<>
			<Typography variant="h6">{title}</Typography>
			<ErrorMessage
				name={addressesPath}
				render={(msg) => (
					<span className={classes.errorText}>
						<br />
						{msg}
					</span>
				)}
			/>
			<Paper className={classes.root} elevation={2}>
				<Table>
					<TableHead>
						<TableRow>
							<CustomCell />
							<CustomCell>Address</CustomCell>
							<CustomCell>Balance</CustomCell>
							<CustomCell>Nickname</CustomCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{!_isEmpty(generatedAddressList) &&
							generatedAddressList.map((address_o, index) => {
								const checkboxPath = 'checkbox_' + index;
								const nicknamePath = 'nickname_' + index;
								const address = 'address_' + index;
								const balance = 'balance_' + index;
								const duplicate =
									userAddresses.indexOf(address_o.address) === -1
										? false
										: true;
								return (
									<TableRow key={index}>
										<FieldArray
											name={addressesPath}
											render={(arrayHelpers) => (
												<>
													<CustomCell>
														{duplicate ? (
															<Tooltip title="Address already added">
																<FormControlLabel
																	control={
																		<Checkbox
																			checked
																			disabled
																			name={checkboxPath}
																			color="primary"
																		/>
																	}
																	label={index + 1}
																	labelPlacement="start"
																/>
															</Tooltip>
														) : (
															<Field
																name={checkboxPath}
																render={({ field, form }) => (
																	<FormControlLabel
																		control={
																			<Checkbox
																				name={checkboxPath}
																				color="primary"
																				onChange={(e) => {
																					arrayHelpers.replace(index, null);
																					setFieldValue(nicknamePath, '');
																					handleChange(e);
																				}}
																			/>
																		}
																		label={index + 1}
																		labelPlacement="start"
																	/>
																)}
															/>
														)}
													</CustomCell>
													<CustomCell name={address}>
														{address_o.address}
													</CustomCell>
													<CustomCell name={balance}>
														<FormatBalance
															balance={address_o.balance}
															type={type}
														/>
													</CustomCell>
													<CustomCell>
														{duplicate ? (
															userAddressList.find((addr_o) => {
																return addr_o.address === address_o.address;
															}).nickname
														) : (
															<>
																{_get(values, checkboxPath) && (
																	<>
																		<Field
																			name={nicknamePath}
																			validate={validateNickname}
																		>
																			{({ field }) => (
																				<TextField
																					{...field}
																					onChange={(e) => {
																						handleChange(e);
																						addGeneratedAddress(
																							e.target.value,
																							address_o,
																							index,
																							arrayHelpers
																						);
																					}}
																					autoFocus
																					margin="dense"
																					fullWidth
																					error={
																						errors[nicknamePath] &&
																						touched[nicknamePath]
																							? true
																							: false
																					}
																					inputProps={{
																						maxLength: NICKNAME_MAX_LENGTH,
																					}}
																				/>
																			)}
																		</Field>
																		<ErrorMessage
																			name={nicknamePath}
																			render={(msg) => (
																				<span
																					className={classes.errorTextSmall}
																				>
																					{msg}
																				</span>
																			)}
																		/>
																	</>
																)}
															</>
														)}
													</CustomCell>
												</>
											)}
										/>
									</TableRow>
								);
							})}
					</TableBody>
					<TableFooter />
				</Table>
			</Paper>
			<br />
			<Button
				type="button"
				onClick={getNext}
				variant="outlined"
				color="primary"
				disabled={loading}
			>
				Load Five More
				{(loading || _isEmpty(generatedAddressList)) && (
					<>
						&nbsp;
						<CircularProgress thickness={7} />
					</>
				)}
			</Button>
		</>
	);
}
const CustomCell = withStyles((theme) => ({
	head: {
		color: 'black',
		fontSize: '13px',
		paddingLeft: 5,
		paddingRight: 5,
	},
	body: {
		paddingLeft: 5,
		paddingRight: 5,
	},
}))(TableCell);

const styles = (theme) => ({
	root: {
		width: '800px',
		marginTop: 12,
		overflowX: 'auto',
		maxHeight: 405,
	},
	head: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	errorText: {
		color: 'red',
		fontSize: '20px',
	},
	errorTextSmall: {
		color: 'red',
		fontSize: '12px',
	},
});

export default withStyles(styles)(GenerateAddressTable);
