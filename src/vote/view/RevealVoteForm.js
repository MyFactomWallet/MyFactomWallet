import React from 'react';
import _get from 'lodash/get';
import _flowRight from 'lodash/flowRight';
import _isNil from 'lodash/isNil';
import Grid from '@material-ui/core/Grid';
import * as Yup from 'yup';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import Button from '@material-ui/core/Button';
import SectionHeader from '../shared/SectionHeader';
import FormTextField from '../../component/form/FormTextField';
import { withVote } from '../../context/VoteContext';
import { withNetwork } from '../../context/NetworkContext';
import { isValidPrivateEcAddress } from 'factom/dist/factom';
import { EC_PRIV } from '../create/VOTE_EXAMPLE_DATA';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExplorerLink from '../shared/ExplorerLink';
import Paper from '@material-ui/core/Paper';

/**
 * Constants
 */
const workingFilePath = 'workingFile';
const workingFileNamePath = 'workingFileName';
const ecPrivateKeyPath = 'ecPrivateKey';
const transactionErrorPath = 'transactionError';
const revealJSONPath = 'revealJSON';
const processingPath = 'processing';
const resultPath = 'result';
const fileUploadErrorPath = 'fileUploadError';

const pollChainIdPath = 'voteChainId';

class RevealVoteForm extends React.Component {
	constructor(props) {
		super(props);

		this.reader = new FileReader();
	}

	handleFile = async (file) => {
		await this.reader.readAsText(file);

		this.reader.onloadend = async (e) => {
			const content = this.reader.result;
			const json = JSON.parse(content);

			const fileChainId = _get(json, pollChainIdPath);

			const pollChainId = _get(this.props.poll, pollChainIdPath);

			if (fileChainId === pollChainId) {
				//correct reveal
				this.setFieldValue(revealJSONPath, json);
				this.setFieldValue(fileUploadErrorPath, null);
			} else {
				//invalid reveal
				await this.resetForm();
				this.setFieldValue(fileUploadErrorPath, 'Invalid Poll Chain ID');
			}
		};
	};

	handleKeyPress(event) {
		if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
			event.preventDefault();
		}
	}

	render() {
		const {
			classes,
			networkController: { networkProps },
		} = this.props;

		const entryHashURL = networkProps.explorerURL + '/entry?hash=';

		return (
			<Formik
				initialValues={{
					ecPrivateKey: '',
					workingFile: '',
					workingFileName: '',
					processing: false,
					transactionError: null,
					revealJSON: null,
					result: null,
				}}
				onSubmit={async (values, actions) => {
					actions.setFieldValue(transactionErrorPath, null);
					actions.setFieldValue(processingPath, true);

					try {
						//reveal vote
						const reveal = _get(values, revealJSONPath);
						reveal.ecPrivateAddress = _get(values, ecPrivateKeyPath);

						const result = await this.props.voteController.revealVote(reveal);
						console.log(result);

						actions.setFieldValue(resultPath, result);
						actions.setFieldValue(processingPath, false);
					} catch (e) {
						console.log(e);
						await actions.resetForm();
						actions.setFieldValue(transactionErrorPath, 'Error: ' + e.message);
					}
				}}
				validationSchema={Yup.object().shape({
					[ecPrivateKeyPath]: Yup.string()
						.required('Required')
						.test(ecPrivateKeyPath, 'Invalid Key', isValidPrivateEcAddress),
				})}
				render={({
					values,
					isSubmitting,
					handleChange,
					setFieldValue,
					errors,
					touched,
					resetForm,
				}) => {
					this.setFieldValue = setFieldValue;
					this.resetForm = resetForm;

					return (
						<Form onKeyPress={this.handleKeyPress}>
							<Grid container className={classes.pad}>
								<Grid container justify="space-between" item xs={12}>
									<SectionHeader text="Reveal Vote" />
									<Button
										onClick={() => {
											setFieldValue(ecPrivateKeyPath, EC_PRIV);
										}}
										variant="contained"
										color="default"
									>
										Use Test EC
									</Button>
								</Grid>
								<Grid item xs={9}>
									<FormTextField
										name={workingFileNamePath}
										isNotFast
										type="file"
										accept=".txt"
										onChange={async (e) => {
											handleChange(e);

											setFieldValue(workingFilePath, e.target.files[0]);

											this.handleFile(e.target.files[0]);
										}}
									/>
									{!_isNil(_get(values, fileUploadErrorPath)) && (
										<Typography className={classes.transactionErrorText}>
											{_get(values, fileUploadErrorPath)}
										</Typography>
									)}
								</Grid>
								<Grid item xs={3} />
								<Grid item xs={9}>
									<FormTextField
										name={ecPrivateKeyPath}
										label="EC Private Key *"
										error={
											_get(errors, ecPrivateKeyPath) &&
											_get(touched, ecPrivateKeyPath)
										}
										disabled={isSubmitting}
										fullWidth
									/>
								</Grid>
								<Grid item xs={3} />
								{!_isNil(_get(values, transactionErrorPath)) && (
									<Grid item xs={12}>
										<br />
										<Typography className={classes.transactionErrorText}>
											{_get(values, transactionErrorPath)}
										</Typography>
									</Grid>
								)}
								{_get(values, resultPath) && (
									<Grid item xs={12}>
										<br />
										<Paper className={classes.transaction}>
											<SectionHeader text="Success!" color="green" />

											<Typography gutterBottom>
												Your vote is pending confirmation. The entry will be
												visible in 10-15 minutes, after being included in the
												next block currently being processed by the Factom
												blockchain.
											</Typography>
											<br />
											<ExplorerLink
												label="Vote Reveal"
												value={_get(values, resultPath).entryHash}
												href={entryHashURL + _get(values, resultPath).entryHash}
											/>
										</Paper>
									</Grid>
								)}

								<Grid item xs={12}>
									<br />
									<Button
										type="submit"
										variant="contained"
										color="primary"
										disabled={
											isSubmitting || !_get(values, workingFileNamePath)
										}
									>
										Reveal Vote
										{_get(values, processingPath) && (
											<>
												&nbsp;&nbsp;
												<CircularProgress thickness={5} size={20} />
											</>
										)}
									</Button>
									{isSubmitting && _get(values, resultPath) && (
										<Button
											variant="outlined"
											className={classes.resetButton}
											onClick={() => {
												resetForm();
											}}
										>
											Reset
										</Button>
									)}
								</Grid>
							</Grid>
						</Form>
					);
				}}
			/>
		);
	}
}

RevealVoteForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	pad: {
		padding: '15px',
	},
	transactionErrorText: { color: 'red', fontSize: '16px' },
	resetButton: { marginLeft: 2 },
	transaction: {
		borderColor: '#6fbf73',
		borderStyle: 'solid',
		padding: 10,
	},
});

const enhancer = _flowRight(withNetwork, withVote, withStyles(styles));
export default enhancer(RevealVoteForm);
