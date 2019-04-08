import React from 'react';
import { Formik, Form } from 'formik';
import _isNil from 'lodash/isNil';
import _flowRight from 'lodash/flowRight';
import _get from 'lodash/get';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import SectionHeader from '../vote/shared/SectionHeader';
import FormTextField from '../component/form/FormTextField';
import { withLedger } from '../context/LedgerContext';
import { withVote } from '../context/VoteContext';
import CircularProgress from '@material-ui/core/CircularProgress';
import { REGEX_CHAIN_ID } from '../vote/create/VOTE_CONSTANTS';
import CheckCircle from '@material-ui/icons/CheckCircleOutlined';
import Paper from '@material-ui/core/Paper';

/**
 * Constants
 */
const transactionErrorPath = 'transactionError';
const ledgerStatusPath = 'ledgerStatus';
const chainIdPath = 'chainId';
const resultPath = 'result';

class SetLedgerIdForm extends React.Component {
	render() {
		const {
			classes,
			ledgerController: { storeChainId },
		} = this.props;

		return (
			<Formik
				enableReinitialize
				initialValues={{
					transactionError: null,
					ledgerStatus: null,
					chainId: '',
					result: null,
				}}
				onSubmit={async (values, actions) => {
					actions.setFieldValue(transactionErrorPath, null);

					actions.setFieldValue(
						ledgerStatusPath,
						'Attempting to store identity... check Ledger Nano S display'
					);

					try {
						await storeChainId(_get(values, chainIdPath));

						actions.setFieldValue(ledgerStatusPath, null);
						actions.setFieldValue(
							resultPath,
							'The Identity Chain ID has been successfully saved to the Ledger device.'
						);
					} catch (e) {
						console.log(e);
						await actions.resetForm();
						await actions.setFieldValue(chainIdPath, _get(values, chainIdPath));
						actions.setFieldValue(transactionErrorPath, 'Error: ' + e.message);
					}
				}}
				validationSchema={Yup.object().shape({
					[chainIdPath]: Yup.string()
						.required('Required')
						.matches(REGEX_CHAIN_ID, {
							message: 'Invalid Chain ID',
							excludeEmptyString: true,
						}),
				})}
				render={({ isSubmitting, errors, touched, values, handleReset }) => {
					return (
						<Form>
							<Grid container>
								<Grid item xs={12}>
									<SectionHeader
										text="Set Factom Identity Chain on Ledger Nano S"
										disableGutterBottom
									/>
									<FormTextField
										fullWidth
										label="Identity Chain ID"
										name={chainIdPath}
										error={
											_get(errors, chainIdPath) && _get(touched, chainIdPath)
										}
										type="text"
										disabled={isSubmitting}
									/>
								</Grid>
								{!_isNil(_get(values, transactionErrorPath)) && (
									<Grid item xs={12}>
										<br />
										<Typography className={classes.errorText}>
											{_get(values, transactionErrorPath)}
										</Typography>
									</Grid>
								)}
								{!_isNil(_get(values, resultPath)) ? (
									<Grid item xs={12}>
										<br />
										<Paper className={classes.transaction}>
											<CheckCircle
												nativeColor="#6fbf73"
												className={classes.successIcon}
											/>
											&nbsp;
											<Typography style={{ display: 'inline' }}>
												{_get(values, resultPath)}
											</Typography>
										</Paper>
										<br />
										<Button
											type="button"
											color="primary"
											variant="contained"
											onClick={handleReset}
										>
											Reset
										</Button>
									</Grid>
								) : (
									<Grid item xs={12}>
										<br />
										<Button
											type="submit"
											variant="contained"
											color="primary"
											disabled={isSubmitting}
										>
											Set Identity
											{isSubmitting && (
												<>
													&nbsp;&nbsp;
													<CircularProgress thickness={5} size={20} />
												</>
											)}
										</Button>
										{isSubmitting && _get(values, ledgerStatusPath) && (
											<Typography className={classes.ledgerStatus}>
												{_get(values, ledgerStatusPath)}
											</Typography>
										)}
									</Grid>
								)}
							</Grid>
						</Form>
					);
				}}
			/>
		);
	}
}

SetLedgerIdForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	errorText: { color: 'red', fontSize: '16px' },
	ledgerStatus: { display: 'inline-block', paddingLeft: '10px' },
	transaction: {
		borderColor: '#6fbf73',
		borderStyle: 'solid',
		paddingTop: 3,
		paddingBottom: 8,
	},
	successIcon: {
		position: 'relative',
		top: '5px',
	},
});

const enhancer = _flowRight(withVote, withLedger, withStyles(styles));

export default enhancer(SetLedgerIdForm);
