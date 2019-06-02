import React from 'react';
import _get from 'lodash/get';
import { Formik, Form, ErrorMessage } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import { withNetwork } from '../context/NetworkContext';
import _flowRight from 'lodash/flowRight';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';

const getImportTypes = (networkProps) => {
	return [
		{
			value: 'fct',
			label: 'Import ' + networkProps.factoidAbbreviationFull + ' Address',
		},
		{
			value: 'ec',
			label: 'Import ' + networkProps.ecAbbreviationFull + ' Address',
		},
		{
			value: 'new',
			label: 'Generate new 12-word seed',
		},
		{
			value: 'importSeed',
			label: 'Import addresses from mnemonic seed phrase',
		},
		{
			value: 'ledger',
			label: 'Import addresses from Ledger Nano X/S',
		},
	];
};

/**
 * Constants
 */
const importTypePath = 'importType';

class ImportTypeForm extends React.Component {
	render() {
		const {
			classes,
			importType,
			networkController: { networkProps },
		} = this.props;

		return (
			<Formik
				initialValues={{ [importTypePath]: importType }}
				onSubmit={(values, actions) => {
					// proceed to next page
					this.props.handleNext();
				}}
				validationSchema={Yup.object().shape({
					[importTypePath]: Yup.string().required('Required'),
				})}
				render={({ values, handleChange, isSubmitting, errors, touched }) => (
					<Form>
						<FormControl
							error={
								_get(errors, importTypePath) && _get(touched, importTypePath)
									? true
									: false
							}
							component="fieldset"
						>
							<FormLabel component="legend">
								How would you like to add a new address?
								<ErrorMessage
									name={importTypePath}
									render={() => (
										<span className={classes.errorText}>&nbsp;*</span>
									)}
								/>
							</FormLabel>

							<RadioGroup
								aria-label="Import Type"
								name={importTypePath}
								value={_get(values, importTypePath)}
								onChange={(e) => {
									handleChange(e);
									this.props.updateImportType(e.target.value);
								}}
							>
								{getImportTypes(networkProps).map((option, index) => (
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
								variant="contained"
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

ImportTypeForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
	errorText: { color: 'red' },
});

const enhancer = _flowRight(withNetwork, withStyles(styles));
export default enhancer(ImportTypeForm);
