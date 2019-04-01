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
import { BINARY_CONFIG } from '../create/VOTE_CONSTANTS';

/**
 * Constants
 */
const selectedOptionPath = 'selectedOption';

const optionsPath = 'pollJSON.vote.config.options';

class BinaryVoteForm extends React.Component {
	render() {
		const {
			poll,
			parentIsSubmitting,
			parentArrayHelpers,
			parentReset,
		} = this.props;

		const options = _get(poll, optionsPath);

		return (
			<Formik
				enableReinitialize
				initialValues={{
					selectedOption: '',
					reinitialize: parentReset,
				}}
				render={({ values, handleChange }) => {
					return (
						<Grid container>
							<Grid item xs={12}>
								<Typography>Type: {BINARY_CONFIG.name}</Typography>
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
												control={<Radio disabled={parentIsSubmitting} />}
												label={option}
											/>
										))}
									</RadioGroup>
								</FormControl>
							</Grid>
						</Grid>
					);
				}}
			/>
		);
	}
}

BinaryVoteForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({});

const enhancer = _flowRight(withStyles(styles));
export default enhancer(BinaryVoteForm);
