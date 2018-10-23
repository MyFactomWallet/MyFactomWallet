import React from 'react';
import _flowRight from 'lodash/flowRight';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import AddressInfoHeader from './Shared/AddressInfoHeader';
import findIndex from 'lodash/findIndex';
import { withWalletContext } from '../Context/WalletContext';
import { withNetwork } from '../Context/NetworkContext';
import { withLedger } from '../Context/LedgerContext';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';

/**
 * Constants
 */
const nicknamePath = 'nickname';
const saveToCachePath = 'saveToCache';

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
			},
			networkController: { networkProps },
			ledgerController: { checkAddress },
		} = this.props;

		const ecAddresses = getEntryCreditAddresses();
		const factoidAddresses = getFactoidAddresses();
		const activeAddress_o = getActiveAddress();

		return (
			<Formik
				initialValues={{
					saveToCachePath: false,
					nickname: activeAddress_o.nickname,
				}}
				onSubmit={(values, actions) => {
					// proceed to next page
					this.props.handleNext();
				}}
				validationSchema={Yup.object().shape({
					[nicknamePath]: Yup.string()
						.trim()
						.required('Required')
						.test(
							nicknamePath,
							'Enter unique nickname',
							(value) =>
								findIndex(factoidAddresses, [nicknamePath, value]) === -1 // change check depending on type
						),
				})}
				render={({ isSubmitting, errors, touched }) => (
					<div className={classes.root}>
						<AddressInfoHeader />
						<br />
						{/* <Paper className={classes.padded}> */}
						<Form onKeyPress={this.handleKeyPress}>
							<Grid container spacing={8}>
								<Grid item xs={6}>
									<Grid item xs={12}>
										<Typography variant="h6">Edit Address</Typography>
									</Grid>

									<Grid container item xs={12}>
										<Grid item xs={12}>
											<FormTextField
												error={
													errors[nicknamePath] && touched[nicknamePath]
														? true
														: false
												}
												name={nicknamePath}
												label="Nickname"
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
												name={saveToCachePath}
												render={({ field, form }) => (
													<FormControlLabel
														control={
															<Checkbox
																name={saveToCachePath}
																checked={field.value}
																color="default"
															/>
														}
														label="Save to Cache" // Save to Browser Storage
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
												Save
											</Button>
											<Button
												className={classes.deleteButton}
												variant="outlined"
												color="secondary"
											>
												Delete
											</Button>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={6}>
									{/*<Grid item>
										<Typography variant="h6">Transactions</Typography>
									</Grid>

									 {!_isEmpty(activeAddress_o.transactions) ? (
										<div className={classes.root}>
											<Typography variant="h6">Recent Transactions</Typography>
											{activeAddress_o.transactions.map(function(transaction, index) {
												return (
													<div key={index}>
														<Typography>
															<b>Tx ID:</b> {transaction}
														</Typography>
													</div>
												);
											})}
										</div>*/}
								</Grid>
							</Grid>
						</Form>
					</div>
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

AddressInfoForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	errorText: { color: 'red', fontSize: '12px' },
	root: { textAlign: 'left' },
	deleteButton: { marginLeft: 10 },
});

const enhancer = _flowRight(
	withNetwork,
	withWalletContext,
	withLedger,
	withStyles(styles)
);

export default enhancer(AddressInfoForm);
