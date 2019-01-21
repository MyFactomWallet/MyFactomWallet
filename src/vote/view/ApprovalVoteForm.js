import React from 'react';
import _get from 'lodash/get';
import _remove from 'lodash/remove';
import _flowRight from 'lodash/flowRight';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import { APPROVAL_CONFIG } from '../create/VOTE_CONSTANTS';

/**
 * Constants
 */
const abstainCheckboxPath = 'abstainCheckbox';

const parentVotePath = 'vote';

const optionsPath = 'pollJSON.vote.config.options';
const minOptionsPath = 'pollJSON.vote.config.minOptions';
const maxOptionsPath = 'pollJSON.vote.config.maxOptions';
const abstentionPath = 'pollJSON.vote.config.allowAbstention';

class ApprovalVoteForm extends React.Component {
	render() {
		const {
			poll,
			parentIsSubmitting,
			parentArrayHelpers,
			parentReset,
			parentSetFieldValue,
			parentVoteArray,
		} = this.props;

		const options = _get(poll, optionsPath);
		const allowAbstain = _get(poll, abstentionPath);
		const minOptions = _get(poll, minOptionsPath);
		const maxOptions = _get(poll, maxOptionsPath);

		return (
			<Formik
				enableReinitialize
				initialValues={{
					reinitialize: parentReset,
					abstainCheckbox: false,
				}}
				render={({ values, handleChange, setFieldValue }) => {
					return (
						<Grid container>
							<Grid item xs={12}>
								<Typography>Type: {APPROVAL_CONFIG.name}</Typography>
								<Typography>Minimum Options Allowed: {minOptions}</Typography>
								<Typography>Maximum Options Allowed: {maxOptions}</Typography>
							</Grid>
							<Grid item xs={12}>
								<FormControl component="fieldset">
									<FormGroup>
										{options.map((option, index) => (
											<FormControlLabel
												key={index}
												control={
													<Checkbox
														name={option + '_checkbox'}
														value={option}
														checked={
															_get(values, option + '_checkbox') === true
														}
														disabled={
															parentIsSubmitting ||
															_get(values, abstainCheckboxPath)
														}
														onChange={(e) => {
															handleChange(e);

															if (e.target.checked) {
																parentArrayHelpers.push(e.target.value);
															} else {
																const newVote = _remove(
																	parentVoteArray,
																	(value) => value !== e.target.value
																);
																parentSetFieldValue(parentVotePath, newVote);
															}
														}}
													/>
												}
												label={option}
											/>
										))}
									</FormGroup>
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

													if (e.target.checked) {
														options.forEach((option) => {
															setFieldValue(option + '_checkbox', false);
														});
														parentSetFieldValue(parentVotePath, []);
													}

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

ApprovalVoteForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({});

const enhancer = _flowRight(withStyles(styles));
export default enhancer(ApprovalVoteForm);
