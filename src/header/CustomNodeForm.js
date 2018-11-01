import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SectionHeader from '../vote/shared/SectionHeader.js';

const hostPath = 'host';
const portPath = 'port';

class CustomNodeForm extends React.Component {
	handleKeyPress(event) {
		if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
			event.preventDefault();
		}
	}
	render() {
		const { classes } = this.props;
		return (
			<Formik
				initialValues={{ host: '', port: '' }}
				onSubmit={(values, actions) => {
					console.log('Submitted');
					this.props.handleCustomNode(values[hostPath], values[portPath]);
				}}
				validationSchema={Yup.object().shape({
					[hostPath]: Yup.string().required('Required'),
					[portPath]: Yup.string().required('Required'),
				})}
				render={({ isSubmitting, errors, touched }) => (
					<Form onKeyPress={this.handleKeyPress}>
						<SectionHeader text="Custom Node Form" id="modal-title" />
						<FormTextField
							error={errors[hostPath] && touched[hostPath] ? true : false}
							name={hostPath}
							label="Host"
						/>
						<ErrorMessage
							name={hostPath}
							render={(msg) => <span className={classes.errorText}>{msg}</span>}
						/>
						<FormTextField
							error={errors[portPath] && touched[portPath] ? true : false}
							name={portPath}
							label="Port"
						/>
						<ErrorMessage
							name={portPath}
							render={(msg) => <span className={classes.errorText}>{msg}</span>}
						/>
						<br />
						<br />
						<Button
							type="submit"
							disabled={isSubmitting}
							variant="contained"
							color="primary"
						>
							Submit
						</Button>
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
						spellCheck: false,
						maxLength: props.maxLength,
						autoComplete: 'nope',
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

CustomNodeForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({ errorText: { color: 'red', fontSize: '12px' } });
export default withStyles(styles)(CustomNodeForm);
