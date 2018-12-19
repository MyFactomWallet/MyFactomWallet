import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import { withSeed } from '../context/SeedContext';
import _get from 'lodash/get';
import _flowRight from 'lodash/flowRight';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

/**
 * Constants
 */
const mnemonicPath = 'mnemonic';

class NewSeedForm extends React.Component {
	state = {
		step: 1,
	};

	componentDidMount() {
		this.props.setMnemonic(this.props.seedController.getRandomMnemonic());
	}

	nextStep = () => {
		this.setState({ step: 2 });
	};

	render() {
		const { classes } = this.props;

		return (
			<Formik
				initialValues={{
					[mnemonicPath]: '',
				}}
				onSubmit={(values, actions) => {
					// proceed to next page
					this.props.handleNext();
				}}
				validationSchema={Yup.object().shape({
					[mnemonicPath]: Yup.string()
						.trim()
						.required('Required')
						.oneOf([this.props.mnemonic], 'Seed does not match'),
				})}
				render={({ isSubmitting, errors, touched }) => (
					<Form
						style={{ width: '500px' }}
						autoComplete="nope"
						// eslint-disable-next-line
						autoComplete="off"
					>
						{this.state.step === 1 && (
							<React.Fragment>
								<Typography
									style={{ fontWeight: 500 }}
									className={classes.warningText}
								>
									Write down your seed carefully on a piece of paper. This seed
									provides access to all the derived addresses. If you lose this
									seed, you will lose access to your addresses forever!
								</Typography>
								<br />
								<Typography style={{ fontWeight: 500 }}>
									Seed Phrase:
								</Typography>
								<Typography>{this.props.mnemonic}</Typography>
							</React.Fragment>
						)}
						{this.state.step === 2 && (
							<React.Fragment>
								<FormTextField
									error={
										_get(errors, mnemonicPath) && _get(touched, mnemonicPath)
											? true
											: false
									}
									name={mnemonicPath}
									label="Verify Seed Phrase"
									autoFocus={true}
								/>
								<ErrorMessage
									name={mnemonicPath}
									render={(msg) => (
										<span className={classes.errorText}>{msg}</span>
									)}
								/>
							</React.Fragment>
						)}

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
							{this.state.step === 1 && (
								<Button
									onClick={this.nextStep}
									variant="contained"
									color="primary"
								>
									Verify Seed
								</Button>
							)}
							{this.state.step === 2 && (
								<Button
									type="submit"
									disabled={isSubmitting}
									variant="contained"
									color="primary"
								>
									Next
								</Button>
							)}
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
						// eslint-disable-next-line
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

NewSeedForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	warningText: { color: 'red', fontSize: '15px' },
	errorText: { color: 'red' },
});

const enhancer = _flowRight(withSeed, withStyles(styles));

export default enhancer(NewSeedForm);
