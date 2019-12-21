import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import SectionHeader from '../vote/shared/SectionHeader.js';
import FormTextField from '../component/form/FormTextField';

const hostPath = 'host';
const portPath = 'port';

class CustomNodeForm extends React.Component {
	handleKeyPress(event) {
		if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
			event.preventDefault();
		}
	}
	render() {
		return (
			<Formik
				initialValues={{ host: '', port: '' }}
				onSubmit={(values, actions) => {
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
							margin="dense"
							fullWidth
							multiline
						/>

						<FormTextField
							error={errors[portPath] && touched[portPath] ? true : false}
							name={portPath}
							label="Port"
							margin="dense"
							fullWidth
							multiline
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

CustomNodeForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({});
export default withStyles(styles)(CustomNodeForm);
