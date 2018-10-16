import React from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
const importTypes = [
	{
		value: 'fct',
		label: 'Import FCT Address',
	},
	{
		value: 'ec',
		label: 'Import EC Address',
	},
	{
		value: 'new',
		label: 'Generate new 12-word seed',
		disabled: true,
	},
	{
		value: 'seed',
		label: 'Import addresses from 12-word seed',
		disabled: true,
	},

	{
		value: 'ledger',
		label: 'Import addresses from Ledger Nano S',
	},
];
class WalletTypeForm extends React.Component {
	handleKeyPress(event) {
		if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
			event.preventDefault();
		}
	}
	render() {
		const { classes } = this.props;
		return (
			<Formik
				initialValues={{ type: 'fct' }}
				onSubmit={(values, actions) => {
					// proceed to next page
					this.props.handleNext();
				}}
				validationSchema={Yup.object().shape({
					type: Yup.string().required('Required'),
				})}
				render={({ values, handleChange, isSubmitting, errors, touched }) => (
					<Form onKeyPress={this.handleKeyPress}>
						<FormControl
							error={errors.type && touched.type ? true : false}
							component="fieldset"
						>
							<FormLabel component="legend">
								How would you like to add a new address?
								<ErrorMessage
									name="type"
									render={() => (
										<span className={classes.errorText}>&nbsp;*</span>
									)}
								/>
							</FormLabel>

							<RadioGroup
								aria-label="Import Type"
								name="type"
								value={values.type}
								onChange={(e) => {
									handleChange(e);
									this.props.updateImportType(e.target.value);
								}}
							>
								{importTypes.map((option, index) => (
									<FormControlLabel
										key={index}
										value={option.value}
										control={<Radio />}
										label={option.label}
										disabled={option.disabled}
									/>
								))}
							</RadioGroup>
						</FormControl>
						<br />
						<br />
						<div>
							<Button disabled={true}>Back</Button>
							<Button
								type="submit"
								disabled={isSubmitting}
								variant="raised"
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

WalletTypeForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	errorText: { color: 'red' },
});
export default withStyles(styles)(WalletTypeForm);
