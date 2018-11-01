import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Field, ErrorMessage, FieldArray } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import FormatBalance from '../walletManager/shared/BalanceFormatter.js';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';

/**
 * Constants
 */
const addressesPath = 'addresses';
const NICKNAME_MAX_LENGTH = 25;

class GenerateAddressTable extends React.Component {
	state = { loading: false };

	addGeneratedAddress = (nickname, address_o, arrayHelpers) => {
		if (nickname) {
			const addr_o = this.props.newAddress(
				address_o.address,
				nickname.trim(),
				address_o.index
			);
			arrayHelpers.replace(address_o.index, addr_o);
		} else {
			arrayHelpers.replace(address_o.index, null);
		}
	};

	validateNickname = (value) => {
		const { userAddressList } = this.props;
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
	};

	getNext = async () => {
		this.setState({ loading: true });
		await this.props.getNextFive();
		this.setState({ loading: false });
	};

	render() {
		const {
			classes,
			generatedAddressList,
			userAddressList, // existing addresses
			values,
			errors,
			touched,
			setFieldValue,
			handleChange,
		} = this.props;

		const userAddresses = userAddressList.map((addr_o) => addr_o.address);

		return (
			<React.Fragment>
				<Typography variant="h6">{this.props.title}</Typography>
				<ErrorMessage
					name={addressesPath}
					render={(msg) => (
						<span className={classes.errorText}>
							<br />
							{msg}
						</span>
					)}
				/>
				<Paper className={classes.root}>
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
								generatedAddressList.map((address_o) => {
									const checkboxPath = 'checkbox_' + address_o.index;
									const nicknamePath = 'nickname_' + address_o.index;
									const duplicate =
										userAddresses.indexOf(address_o.address) === -1
											? false
											: true;
									return (
										<TableRow key={address_o.index}>
											<FieldArray
												name={addressesPath}
												render={(arrayHelpers) => (
													<React.Fragment>
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
																		label={address_o.index + 1}
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
																						arrayHelpers.replace(
																							address_o.index,
																							null
																						);
																						setFieldValue(nicknamePath, '');
																						handleChange(e);
																					}}
																				/>
																			}
																			label={address_o.index + 1}
																			labelPlacement="start"
																		/>
																	)}
																/>
															)}
														</CustomCell>
														<CustomCell>{address_o.address}</CustomCell>
														<CustomCell>
															<FormatBalance
																balance={address_o.balance}
																type={this.props.type}
															/>
														</CustomCell>
														<CustomCell>
															{duplicate ? (
																userAddressList.find((addr_o) => {
																	return addr_o.address === address_o.address;
																}).nickname
															) : (
																<React.Fragment>
																	{_get(values, checkboxPath) && (
																		<React.Fragment>
																			<Field
																				name={nicknamePath}
																				validate={this.validateNickname}
																			>
																				{({ field }) => (
																					<TextField
																						{...field}
																						onChange={(e) => {
																							handleChange(e);
																							this.addGeneratedAddress(
																								e.target.value,
																								address_o,
																								arrayHelpers
																							);
																						}}
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
																		</React.Fragment>
																	)}
																</React.Fragment>
															)}
														</CustomCell>
													</React.Fragment>
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
					onClick={this.getNext}
					variant="outlined"
					color="primary"
					disabled={this.state.loading}
				>
					Load Five More
					{(this.state.loading || _isEmpty(generatedAddressList)) && (
						<React.Fragment>
							&nbsp;
							<CircularProgress thickness={7} />
						</React.Fragment>
					)}
				</Button>
			</React.Fragment>
		);
	}
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
