import React from 'react';
import _get from 'lodash/get';
import _flowRight from 'lodash/flowRight';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import { SINGLE_OPTION_CONFIG } from '../create/VOTE_CONSTANTS';

/**
 * Constants
 */
const selectedOptionPath = 'selectedOption';
const abstainCheckboxPath = 'abstainCheckbox';

const optionsPath = 'pollJSON.vote.config.options';
const abstentionPath = 'pollJSON.vote.config.allowAbstention';

class SingleOptionVoteForm extends React.Component {
	render() {
		const {
			poll,
			parentIsSubmitting,
			parentArrayHelpers,
			parentReset,
			parentSetFieldValue,
		} = this.props;

		const options = _get(poll, optionsPath);
		const allowAbstain = _get(poll, abstentionPath);

		return (
			<Formik
				enableReinitialize
				initialValues={{
					selectedOption: '',
					reinitialize: parentReset,
					abstainCheckbox: false,
				}}
				render={({ values, handleChange, setFieldValue }) => {
					return (
						<Grid container>
							<Grid item xs={12}>
								<Typography>Type: {SINGLE_OPTION_CONFIG.name}</Typography>
							</Grid>
							<Grid item xs={12}>
								<FormControl component="fieldset">
									<RadioGroup
										aria-label="Option"
										name={selectedOptionPath}
										value={_get(values, selectedOptionPath)}
										onChange={(e) => {
											handleChange(e);
											parentArrayHelpers.replace(0, e.target.value);
										}}
									>
										{options.map((option, index) => (
											<FormControlLabel
												key={index}
												value={option}
												control={
													<Radio
														disabled={
															parentIsSubmitting ||
															_get(values, abstainCheckboxPath)
														}
													/>
												}
												label={option}
											/>
										))}
									</RadioGroup>
								</FormControl>
							</Grid>
							{allowAbstain && (
								<Grid item xs={12}>
									<Divider />
									<FormControlLabel
										control={
											<Checkbox
												name={abstainCheckboxPath}
												checked={_get(values, abstainCheckboxPath)}
												disabled={parentIsSubmitting}
												onChange={(e) => {
													handleChange(e);

													setFieldValue(selectedOptionPath, '');
													parentArrayHelpers.remove(0);
													parentSetFieldValue(
														abstainCheckboxPath,
														e.target.checked
													);
												}}
											/>
										}
										label="Abstain"
									/>
								</Grid>
							)}
						</Grid>
					);
				}}
			/>
		);
	}
}

SingleOptionVoteForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({});

const enhancer = _flowRight(withStyles(styles));
export default enhancer(SingleOptionVoteForm);
